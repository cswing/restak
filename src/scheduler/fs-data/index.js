'use strict';

var log4js = require('log4js'),
	logger = log4js.getLogger('nhl-modeling.structures'),
	FileSystemObjectQuery = require('../../query/object-query/fs-object-query'),
	MarkJobExecutingCommand = require('../fs-mark-job-executing-command'),
	MarkJobExecutedCommand = require('../fs-mark-job-executed-command');

/**
 * A simple store implementation for {@link restak.scheduler.Scheduler} using the file system.  This implementation is not ideal for
 * production environments.
 *
 * @namespace restak.scheduler.fs-data
 */

module.exports.wire = function(fs, jobsDirectory) {

	logger.debug('wiring up file system backing store for scheduler');
	logger.debug('jobsDirectory: ' + jobsDirectory);

	var result = {};

	result.jobsQuery = new FileSystemObjectQuery(fs, jobsDirectory);
	result.markJobExecutingCommand = new MarkJobExecutingCommand(fs, jobsDirectory);
	result.markJobExecutedCommand = new MarkJobExecutedCommand(fs, jobsDirectory);

	return result;
};