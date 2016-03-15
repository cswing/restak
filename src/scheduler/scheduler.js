'use strict';

var log4js = require('log4js'),
	logger = log4js.getLogger('restak.scheduler.Scheduler'),
	nodeSchedule = require('node-schedule'),
	parseSchedule = require('./schedule-parser'),
	models = require('./models'),
	JobDescriptorStatus = models.JobDescriptorStatus;

/**
 * The core component of the scheduler functionality.  The scheduler will wrap the node-scheduler functionality,
 * providing additional features including persistence, logging, etc.
 *
 * @constructor
 * @memberof restak.scheduler
 * @param {restak.query.Query} jobQuery - A query to provide access to {@link restak.scheduler.JobDescriptor}.
 * @param {restak.scheduler.JobFactory} jobFactory - A factory to provide access to {@link restak.commands.Comnmand}.
 */
var Scheduler = function(jobQuery, jobFactory){
	this.jobStore = {};
	this.jobQuery = jobQuery;
	this.jobFactory = jobFactory;
};

/**
 * Initializes the scheduler based on jobs returned from the query.
 * 
 * @param {Function} callback - a simple callback that notifies that initialization has been completed.
 */
Scheduler.prototype.initialize = function(callback){

	var jobQuery = this.jobQuery,
		jobFactory = this.jobFactory,
		jobStore = this.jobStore,
		qr = {
			filter: '(status=' + JobDescriptorStatus.Scheduled + ' OR status=' + JobDescriptorStatus.Running + ')',
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

			logger.debug('Scheduling job ' + job.description + ' [' + job.id + ']');

			if(jobStore[job.id]) {
				logger.error('Found multiple jobs with the same id; subsequent jobs will be gnored [' + job.id + ']');
				return;
			}

			// TEMP - this would happen when running and the job crashes
			// Need to define recovery behavior
			if(job.status == JobDescriptorStatus.Running) {
				logger.error('Job is in the running status. Will not be registered to run again. [' + job.id + ']');
				return;
			}

			jobStore[job.id] = null;

			var schedule = job.schedule;
			if(!schedule) {
				// one time job that never executed.  
				schedule = new Date();
			}
			schedule = parseSchedule(schedule);

			// get command based on job descriptor
			var command = jobFactory.getCommand(job);

			if(command == null){
				logger.error('Unable to locate a command for the job [' + job.id + ', '+ job.command + ']');
				return;
			}
			
			jobStore[job.id] = nodeSchedule.scheduleJob(job.description, schedule, command);
			if(!jobStore[job.id]) {
				logger.error('Invalid schedule for [' + job.id + ', '+ (job.schedule || '').toString() + ']');
				return;
			}

			logger.debug('Job initialized in the scheduler: ' + job.description + ' [' + job.id + ']');
		});

		callback();
	});
};

module.exports = Scheduler;