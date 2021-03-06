'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.job-engine.Scheduler'),
	async = require('async'),
	nodeSchedule = require('node-schedule'),
	moment = require('moment'),
	models = require('./models'),
	JobDescriptorStatus = models.JobDescriptorStatus,
	JobInstanceStatus = models.JobInstanceStatus,
	Execution = require('./execution');

/**
 * The core component of the scheduler functionality.  The scheduler will wrap the node-scheduler functionality,
 * providing additional features including persistence, logging, etc.
 *
 * @constructor
 * @memberof restak.job-engine
 * @param {restak.query.Query} jobQuery - A query to provide access to {@link restak.job-engine.JobDescriptor}.
 * @param {restak.command.CommandExecutor} commandExecutor - A command executor used to execute commands.
 */
var Scheduler = function(jobQuery, commandExecutor){
	
	/** 
	 * A map of jobs keyed by their id.
	 *
	 * @type object
	 */
	this.jobStore = {};

	/** 
	 * The command executor used to execute jobs.
	 *
	 * @type {restak.command.CommandExecutor}
	 */
	this.commandExecutor = commandExecutor;

	this.jobQuery = jobQuery;
};

/**
 * Initializes the scheduler based on jobs returned from the query.
 * 
 * @param {Function} callback - a simple callback that notifies that initialization has been completed.
 */
Scheduler.prototype.initialize = function(callback){

	var _t = this,
		jobQuery = this.jobQuery,
		jobStore = this.jobStore,
		commandExecutor = this.commandExecutor,
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

		logger.debug('Query returned ' + result.totalCount + ' jobs to load into scheduler');

		async.eachSeries(result.items, function(job, cb) {
			
			logger.debug('Scheduling job ' + job.name + ' [' + job.id + ']');

			if(jobStore[job.id]) {
				logger.error('Found multiple jobs with the same id; subsequent jobs will be ignored [' + job.id + ']');
				return callback(null); // do not return the error
			}

			// TEMP - this would happen when executing and the job crashes
			// Need to define recovery behavior
			if(job.status == JobDescriptorStatus.Executing) {
				logger.error('Job is in the executing status. Will not be registered to run again. [' + job.id + ']');
				return callback(); // do not return the error
			}

			jobStore[job.id] = null;

			var schedule = job.schedule;
			if(!schedule) {
				// one time job that never executed.
				schedule = new Date();
				schedule.setSeconds(schedule.getSeconds() + 20); // run this job 20 seconds from now.
			}

			// see if job command exists
			var hasCommand = commandExecutor.commandFactory.hasCommand(job.command);

			if(!hasCommand){
				logger.error('Unable to locate a command for the job [' + job.id + ', '+ job.command + ']');
				return callback(null); // do not return the error
			}
			
			var context = {
				scheduler: _t,
				job: job
			};

			jobStore[job.id] = nodeSchedule.scheduleJob(job.name, schedule, _t.invokeJobCommand.bind(context));

			if(!jobStore[job.id]) {
				logger.error('Invalid schedule for [' + job.id + ', '+ (job.schedule || '').toString() + ']');
				return callback(null); // do not return the error
			}

			var nextFireMoment = moment(jobStore[job.id].pendingInvocations()[0].fireDate);

			jobStore[job.id].on('scheduled', function(nextFireDate){
				var nextFireMoment = moment(nextFireDate);
				_t._updateNextExecution(job.id, nextFireMoment.toISOString());
			});

			_t._updateNextExecution(job.id, nextFireMoment.toISOString(), function(){
				logger.debug('Job initialized in the scheduler: ' + job.name + ' [' + job.id + ']');
				cb();
			});
			
		}, function(err){
			logger.debug('Scheduler initialized with jobs');
			callback(err); 
		});
	});
};

Scheduler.prototype._updateNextExecution = function(jobId, timestamp, callback){
	
	var commandExecutor = this.commandExecutor;

	commandExecutor.executeCommand('restak.job-engine.UpdateJobScheduledTimestampCommand', {
		jobId: jobId,
		timestamp: timestamp
	}, function(err, commandResult){

		if(err){
			logger.warn('Unable to record next scheduled instance for job: ' + job.id + ' [' + nextFireMoment.toISOString()+ ']; ' + err);
		}
		
		if(callback){
			callback(err);
		}
	});
};

/**
 * A descriptor object for a job that is or was scheduled to execute.  A job wraps a command.
 *
 * @typedef InvocationContext
 * @memberof restak.job-engine.Scheduler
 * @type {object}
 * @property {restak.job-engine.JobDescriptor} job - The job that is having it's command executing.
 * @property {restak.job-engine.Scheduler} scheduler - The scheduler responsible for maintaining schedules.
 * @property {restak.command.Command} command - The command to execute.
 * @see restak.job-engine.Scheduler#invokeJobCommand
 */



/**
 * Function responsible for invoking the command related to a job.  The function assumes that
 * it has been binded to a {@link restak.job-engine.Scheduler#InvocationContext} object.
 *
 * @protected
 */
Scheduler.prototype.invokeJobCommand = function() {

	var job = this.job,
		scheduler = this.scheduler,
		commandExecutor = scheduler.commandExecutor,
		execution = new Execution(commandExecutor, job);

	execution.invoke();
};

module.exports = Scheduler;