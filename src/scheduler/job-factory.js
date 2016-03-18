'use strict';

/**
 * @interface JobFactory
 * @memberof restak.scheduler
 */

/**
 * Given a {@link restak.scheduler.JobDescriptor} return the corresponding {@link restak.command.Command}.
 *
 * @function
 * @name restak.scheduler.JobFactory#getCommand
 * @param {restak.scheduler.JobDescriptor} jobDescriptor - The job to get the command for.
 * @return {restak.command.Command} - The command.
 */

/**
 * Default implementation of {@link restak.scheduler.JobFactory} to provide commands to the {@link restak.scheduler.Scheduler}.
 *
 * @constructor
 * @implements restak.scheduler.JobFactory
 * @memberof restak.scheduler
 * @param {object} commandMap - Key value pairs of command keys and the command implementations.
 */
var DefaultJobFactory = function(commandMap){
	this.commandMap = commandMap;
};

/** @inheritdoc */
DefaultJobFactory.prototype.getCommand = function(jobDescriptor) {

	var jd = jobDescriptor || {},
		cmdKey = jd.command;

	if(cmdKey && this.commandMap[cmdKey]){
		return this.commandMap[cmdKey];
	}

	return null;
};

module.exports.DefaultJobFactory = DefaultJobFactory;