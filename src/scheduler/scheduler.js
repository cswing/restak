'use strict';

var log4js = require('log4js'),
	logger = log4js.getLogger('restak.scheduler.Scheduler'),
	nodeSchedule = require('node-schedule'),
	models = require('./models'),
	JobDescriptorStatus = models.JobDescriptorStatus,
	JobInstanceStatus = models.JobInstanceStatus;

/**
 * The core component of the scheduler functionality.  The scheduler will wrap the node-scheduler functionality,
 * providing additional features including persistence, logging, etc.
 *
 * @constructor
 * @memberof restak.scheduler
 * @param {restak.query.Query} jobQuery - A query to provide access to {@link restak.scheduler.JobDescriptor}.
 * @param {restak.scheduler.JobFactory} jobFactory - A factory to provide access to {@link restak.command.Command}.
 * @param {restak.command.Command} markJobExecutingCommand - A command that is executed before executing a scheduled command.
 * @param {restak.command.Command} markJobExecutedCommand - A command that is executed after executing a scheduled command.
 */
var Scheduler = function(jobQuery, jobFactory, markJobExecutingCommand, markJobExecutedCommand){
	this.jobStore = {};
	this.jobQuery = jobQuery;
	this.jobFactory = jobFactory;
	this.markJobExecutingCommand = markJobExecutingCommand;
	this.markJobExecutedCommand = markJobExecutedCommand;
};

/**
 * Initializes the scheduler based on jobs returned from the query.
 * 
 * @param {Function} callback - a simple callback that notifies that initialization has been completed.
 */
Scheduler.prototype.initialize = function(callback){

	var _t = this,
		jobQuery = this.jobQuery,
		jobFactory = this.jobFactory,
		jobStore = this.jobStore,
		qr = {
			filter: '(status=' + JobDescriptorStatus.Scheduled + ' OR status=' + JobDescriptorStatus.Executing + ')',
			pageSize: 'ALL'
		};

	logger.debug('Loading jobs into scheduler');

	jobQuery.execute(qr, function(err, result) {
		
		if(err){
			logger.error('Unable to load jobs: ' + err);
			return callback(err);
		}

		logger.debug('Query returned ' + result.totalCount + ' jobs to load into scheduler')

		result.items.forEach(function(job){

			logger.debug('Scheduling job ' + job.name + ' [' + job.id + ']');

			if(jobStore[job.id]) {
				logger.error('Found multiple jobs with the same id; subsequent jobs will be ignored [' + job.id + ']');
				return;
			}

			// TEMP - this would happen when executing and the job crashes
			// Need to define recovery behavior
			if(job.status == JobDescriptorStatus.Executing) {
				logger.error('Job is in the executing status. Will not be registered to run again. [' + job.id + ']');
				return;
			}

			jobStore[job.id] = null;

			var schedule = job.schedule;
			if(!schedule) {
				// one time job that never executed.
				schedule = new Date();
				schedule.setSeconds(schedule.getSeconds() + 20); // run this job 20 seconds from now.
			}

			// get command based on job descriptor
			var command = jobFactory.getCommand(job);

			if(command == null){
				logger.error('Unable to locate a command for the job [' + job.id + ', '+ job.command + ']');
				return;
			}
			
			var context = {
				scheduler: _t,
				job: job,
				command: command
			};

			jobStore[job.id] = nodeSchedule.scheduleJob(job.name, schedule, _t.invokeJobCommand.bind(context));

			if(!jobStore[job.id]) {
				logger.error('Invalid schedule for [' + job.id + ', '+ (job.schedule || '').toString() + ']');
				return;
			}

			logger.debug('Job initialized in the scheduler: ' + job.name + ' [' + job.id + ']');
		});

		callback();
	});
};

/**
 * A descriptor object for a job that is or was scheduled to execute.  A job wraps a command.
 *
 * @typedef InvocationContext
 * @memberof restak.scheduler.Scheduler
 * @type {object}
 * @property {restak.scheduler.JobDescriptor} job - The job that is having it's command executing.
 * @property {restak.scheduler.Scheduler} scheduler - The scheduler responsible for maintaining schedules.
 * @property {restak.command.Command} command - The command to execute.
 * @see restak.scheduler.Scheduler#invokeJobCommand
 */

/**
 * The data expected as part of the {@link restak.command.CommandInstructions} passed to the execute method.
 *
 * @typedef JobExecutionData
 * @memberof restak.scheduler.Scheduler
 * @type {Object}
 * @param {restak.scheduler.JobDescriptor} job - The job descriptor.
 * @param {restak.scheduler.JobInstance} instance - The instance of the job being executed or executed.
 * @see restak.command.CommandInstructions#data
 */

/**
 * Function responsible for invoking the command related to a job.  The function assumes that
 * it has been binded to a {@link restak.scheduler.Scheduler#InvocationContext} object.
 *
 * @protected
 */
Scheduler.prototype.invokeJobCommand = function() {

	var job = this.job,
		scheduler = this.scheduler,
		command = this.command,
		markJobExecutingCommand = scheduler.markJobExecutingCommand,
		markJobExecutedCommand = scheduler.markJobExecutedCommand;

	var jobInstance = {
		jobId: job.id,
		name: job.name,
		instanceId: null,
		status: JobInstanceStatus.Executing,
		user: {
			id: 'SYSTEM',
			name: 'System'
		},
		data: job.data
	};

	markJobExecutingCommand.execute({ data: {
			job: job,
			instance: jobInstance
		}}, function(err){

			if(err) {
				logger.error('An error occurred preparing for job execution: ' + err);
				return;
			}

			var onCommandExecution = function(err, result) {
				if(err) {
					jobInstance.status = JobInstanceStatus.Error;
					jobInstance.result = err;
				} else {
					jobInstance.status = JobInstanceStatus.Completed;
					jobInstance.result = (result || {}).data || null;
				}

				markJobExecutedCommand.execute({ data: {
					job: job,
					instance: jobInstance
				}}, function(err){
					if(err) {
						logger.error('An error occurred updating job status: ' + err);
					}
				});
			};

			try {
				
				command.execute(jobInstance, onCommandExecution);

			} catch(err){
				
				var err = err || 'An error occurred';
				
				if(err instanceof Error) {
					onCommandExecution(err.message, null);
				} else {
					onCommandExecution((err || '').toString(), null);
				}
			}
		});
};

module.exports = Scheduler;