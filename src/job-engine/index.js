'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.scheduler'),
	Scheduler = require('./scheduler'),
	InstallJobCommand = require('./install-job-command');

// Application Context Extensions
require('./application-context-extensions');

/**
 * @namespace restak.scheduler
 */
 
module.exports.restEndpoints = require('./rest-endpoints');

/**
 * Used to install a job.
 *
 * @interface InstallJobCommand
 * @memberof restak.scheduler
 * @extends restak.command.Command
 */

 /**
 * Used to queue a job for the execution engine to pick up and execute.
 *
 * @interface QueueJobInvocationCommand
 * @memberof restak.scheduler
 * @extends restak.command.Command
 */

/**
 * Used by the {@link restak.scheduler.Scheduler} to mark a job as executing.  It is the reponsibility of 
 * this command to: 
 * <ul>
 * <li>Update the status to "executing" and persist the {@link restak.scheduler.JobDescriptor|job}.</li>
 * <li>Persist the job instance passed into the command, taking responsibility for creating the id of the instance.</li>
 * <li>Pass the updated job and job instance back as part of the command result.</li>
 * </ul>
 *
 * @interface MarkJobExecutingCommand
 * @memberof restak.scheduler
 * @extends restak.command.Command
 */

/**
 * Used by the {@link restak.scheduler.Scheduler} to mark a job as executed.  It is the reponsibility of 
 * this command to:
 * <ul>
 * <li>Persist the status of the {@link restak.scheduler.JobDescriptor|job} to what is specified by the scheduler.</li>
 * <li>Persist the status of the {@link restak.scheduler.JobInstance|job instance} to what is specified by the scheduler.</li>
 * <li>Persist the endTimestamp of the {@link restak.scheduler.JobInstance|job instance} to what is specified by the scheduler.</li>
 * <li>Persist the result of the {@link restak.scheduler.JobInstance|job instance} to what is specified by the scheduler.</li>
 * <li>Pass the updated job and job instance back as part of the command result.</li>
 * </ul>
 *
 * @interface MarkJobExecutedCommand
 * @memberof restak.scheduler
 * @extends restak.command.Command
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
 * Register the necessary objects for the {@link restak.scheduler} namespace.  It requires the commands and query to exist in the appContext.
 *
 * @function register
 * @memberof restak.scheduler
 * @see restak.app-server.register
 */
module.exports.register = function(appContext) {
	
	var jobsQuery = appContext.getQuery('restak.scheduler.JobQuery'),
		createJobCommand = appContext.getCommand('restak.scheduler.CreateJobCommand');

	appContext.registerObject('restak.scheduler.Scheduler', new Scheduler(jobsQuery, appContext.commandExecutor));
	appContext.registerCommand('restak.scheduler.InstallJobCommand', new InstallJobCommand(createJobCommand));
};
