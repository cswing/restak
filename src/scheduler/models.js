'use strict';

/**
 * A descriptor object for a job that is or was scheduled to execute.  A job wraps a command.
 *
 * @typedef JobDescriptor
 * @memberof restak.scheduler
 * @type {object}
 * @property {string} id - An id that uniquely identifies this job descriptor amongst all others.
 * @property {string} name - The name of the job.
 * @property {string} description - A description of what this job does.
 * @property {restak.scheduler.JobDescriptorStatus} status - The status of this job.
 * @property {object|string} schedule - For recurring jobs, this provides the schedule.  For one-time jobs, null.
 * @property {string} command - An identifier to locate the command to execute.
 * @property {object} data - Data to pass to the command.
 * @see restak.scheduler.Scheduler
 * @see restak.command.Command
 * @see restak.scheduler.JobFactory
 */

/**
 * The different statuses for job descriptors.
 *
 * @readonly
 * @memberof restak.scheduler
 * @enum {String}
 * @see restak.scheduler.JobDescriptor
 */
var JobDescriptorStatus = {
	
	/** A recurring job that is scheduled to execute. A one time job may also be in this state when asked to be executed, but before execution.*/
	Scheduled: 'SCHEDULED',

	/** A recurring job that is paused and will not execute. */
	Paused: 'PAUSED',

	/** A one-time job or a recurring job that is currently running. */
	Running: 'RUNNING',

	/** A one time job that has completed. */
	Completed: 'COMPLETED'
};

module.exports.JobDescriptorStatus = JobDescriptorStatus;

/**
 * A descriptor object for a job that is or was scheduled to execute.  A job wraps a command.
 *
 * @typedef JobInstance
 * @memberof restak.scheduler
 * @extends restak.command.CommandInstructions
 * @type {object}
 * @property {string} jobId - The id of the job descriptor.
 * @property {string} name - The name of the job.
 * @property {string} instanceId - An id that uniquely identifies this job instance amongst all others.
 * @property {restak.scheduler.JobInstanceStatus} status - The status of the job instance.
 * @see restak.scheduler.Scheduler
 * @see restak.scheduler.JobDescriptor
 */

/**
 * The different statuses for job instances.
 *
 * @readonly
 * @memberof restak.scheduler
 * @enum {String}
 * @see restak.scheduler.JobInstance
 */
var JobInstanceStatus = {
	
	/** The instance is currently executing.*/
	Executing: 'EXECUTING',

	/** The instance encountered an error during execution. */
	Error: 'ERROR',

	/** The instance completed execution successfully. */
	Completed: 'COMPLETED',
};


module.exports.JobInstanceStatus = JobInstanceStatus;