'use strict';

var log4js = require('log4js'),
	logger = log4js.getLogger('restak.scheduler.fs-data'),
	FileSystemObjectQuery = require('../../query/object-query/fs-object-query'),
	models = require('../models'),
	ObjectTransform = require('../../util/object-transform').DefaultObjectTransform,
	MarkJobExecutingCommand = require('./fs-mark-job-executing-command'),
	MarkJobExecutedCommand = require('./fs-mark-job-executed-command'),
	UpdateJobScheduledTimestampCommand = require('./fs-update-job-scheduled-timestamp-command');

/**
 * A simple store implementation for {@link restak.scheduler.Scheduler} using the file system.  This implementation is not ideal for
 * production environments.
 * 
 * There are potentials for race conditions as currently written
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
module.exports.register = function(appContext, opts) {

	var opts_ = opts || {},
		fs_ = opts_.fs || require('fs'),
		jobsDirectory = appContext.getConfigSetting('restak.data-dir.jobs'),
		jobsTransform = new ObjectTransform(models.JobDescriptor),
		jobsQuery = new FileSystemObjectQuery(fs_, jobsDirectory, jobsTransform);
	
	appContext.registerObject('restak.scheduler.JobsQuery#ObjectTransform', jobsTransform);
	appContext.registerQuery('restak.scheduler.JobsQuery', jobsQuery);
	appContext.registerCommand('restak.scheduler.UpdateJobScheduledTimestampCommand', new UpdateJobScheduledTimestampCommand(fs_, jobsDirectory));
	appContext.registerCommand('restak.scheduler.MarkJobExecutingCommand', new MarkJobExecutingCommand(fs_, jobsDirectory));
	appContext.registerCommand('restak.scheduler.MarkJobExecutedCommand', new MarkJobExecutedCommand(fs_, jobsDirectory));
};