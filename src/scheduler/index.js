'use strict';

var log4js = require('log4js'),
	logger = log4js.getLogger('restak.scheduler'),
	Scheduler = require('./scheduler'),
	JobFactory = require('./job-factory').DefaultJobFactory;

/**
 * @namespace restak.scheduler
 */

module.exports.fsData = require('./fs-data');

/**
 * Register the necessary objects for the {@link restak.scheduler} namespace.  It requires the commands and query to exist in the appContext.
 *
 * @function register
 * @memberof restak.scheduler
 * @see restak.app-server.register
 */
module.exports.register = function(appContext) {

	var commandMap = {},
		jobFactory = new JobFactory(commandMap),
		jobQuery = appContext.getQuery('restak.data-dir.jobs'),
		markJobExecutingCommand = appContext.getCommand('restak.scheduler.MarkJobExecutingCommand'),
		markJobExecutedCommand = appContext.getCommand('restak.scheduler.MarkJobExecutedCommand');

	appContext.registerObject('rest.scheduler.JobFactory', jobFactory);
	appContext.registerObject('rest.scheduler.Scheduler', new Scheduler(jobQuery, jobFactory, markJobExecutingCommand, markJobExecutedCommand));
};