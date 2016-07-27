'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.job-engine'),
	Scheduler = require('./scheduler'),
	InstallJobCommand = require('./install-job-command'),
	ExecutionEngine = require('./execution-engine');

// Application Context Extensions
require('./application-context-extensions');

/**
 * @namespace restak.job-engine
 */
 
module.exports.restEndpoints = require('./rest-endpoints');

/**
 * Used to install a job.
 *
 * @interface InstallJobCommand
 * @memberof restak.job-engine
 * @extends restak.command.Command
 */

 /**
 * Used to queue a job for the execution engine to pick up and execute.
 *
 * @interface QueueJobInvocationCommand
 * @memberof restak.job-engine
 * @extends restak.command.Command
 */

/**
 * Used by the {@link restak.job-engine.Scheduler} to mark a job as executing.  It is the reponsibility of 
 * this command to: 
 * <ul>
 * <li>Update the status to "executing" and persist the {@link restak.job-engine.JobDescriptor|job}.</li>
 * <li>Persist the job instance passed into the command, taking responsibility for creating the id of the instance.</li>
 * <li>Pass the updated job and job instance back as part of the command result.</li>
 * </ul>
 *
 * @interface MarkJobExecutingCommand
 * @memberof restak.job-engine
 * @extends restak.command.Command
 */

/**
 * Used by the {@link restak.job-engine.Scheduler} to mark a job as executed.  It is the reponsibility of 
 * this command to:
 * <ul>
 * <li>Persist the status of the {@link restak.job-engine.JobDescriptor|job} to what is specified by the scheduler.</li>
 * <li>Persist the status of the {@link restak.job-engine.JobInstance|job instance} to what is specified by the scheduler.</li>
 * <li>Persist the endTimestamp of the {@link restak.job-engine.JobInstance|job instance} to what is specified by the scheduler.</li>
 * <li>Persist the result of the {@link restak.job-engine.JobInstance|job instance} to what is specified by the scheduler.</li>
 * <li>Pass the updated job and job instance back as part of the command result.</li>
 * </ul>
 *
 * @interface MarkJobExecutedCommand
 * @memberof restak.job-engine
 * @extends restak.command.Command
 */

/**
 * The data expected as part of the {@link restak.command.CommandInstructions} passed to the execute method.
 *
 * @typedef JobExecutionData
 * @memberof restak.job-engine.Scheduler
 * @type {Object}
 * @param {restak.job-engine.JobDescriptor} job - The job descriptor.
 * @param {restak.job-engine.JobInstance} instance - The instance of the job being executed or executed.
 * @see restak.command.CommandInstructions#data
 */
 
/**
 * Register the necessary objects for the {@link restak.job-engine} namespace.  It requires the commands and query to exist in the appContext.
 *
 * @function register
 * @memberof restak.job-engine
 * @see restak.app-server.register
 */
module.exports.register = function(appContext) {
	
	var commandExecutor = appContext.commandExecutor,
		jobsQuery = appContext.getQuery('restak.job-engine.JobQuery'),
		instanceQuery = appContext.getQuery('restak.job-engine.JobInstanceQuery'),
		markInstanceExecutingCommand = appContext.getCommand('restak.job-engine.MarkJobExecutingCommand'), 
		markInstanceExecutedCommand = appContext.getCommand('restak.job-engine.MarkJobExecutedCommand'),
		createJobCommand = appContext.getCommand('restak.job-engine.CreateJobCommand');

	appContext.registerObject('restak.job-engine.ExecutionEngine', new ExecutionEngine(instanceQuery, markInstanceExecutingCommand, markInstanceExecutedCommand, commandExecutor));

	//appContext.registerObject('restak.job-engine.Scheduler', new Scheduler(jobsQuery, appContext.commandExecutor));
	appContext.registerCommand('restak.job-engine.InstallJobCommand', new InstallJobCommand(createJobCommand));
};
