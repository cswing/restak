'use strict';

var log4js = require('log4js'),
	logger = log4js.getLogger('restak.scheduler.fs-data'),
	FileSystemObjectQuery = require('../../query/object-query/fs-object-query'),
	MarkJobExecutingCommand = require('../fs-mark-job-executing-command'),
	MarkJobExecutedCommand = require('../fs-mark-job-executed-command');

/**
 * A simple store implementation for {@link restak.scheduler.Scheduler} using the file system.  This implementation is not ideal for
 * production environments.
 *
 * @namespace restak.scheduler.fs-data
 */

/**
 * Register the necessary objects for the {@link restak.scheduler.fs-data} namespace.  These objects provide a file system data store 
 * that can be used by the scheduler
 *
 * @function register
 * @memberof restak.scheduler.fs-data
 * @see restak.app-server.register
 */
module.exports.register = function(appContext) {

	var jobsDirectory = appContext.getConfigSetting('restak.data-dir.jobs'),
		jobsQuery = new FileSystemObjectQuery(fs, jobsDirectory);

	appContext.registerQuery('restak.scheduler.JobsQuery', jobsQuery);
	appContext.registerCommand('restak.scheduler.MarkJobExecutingCommand', new MarkJobExecutingCommand(fs, jobsDirectory));
	appContext.registerCommand('restak.scheduler.MarkJobExecutedCommand', new MarkJobExecutedCommand(fs, jobsDirectory));
};