'use strict';

var log4js = require('log4js'),
	logger = log4js.getLogger('restak.scheduler'),
	Scheduler = require('./scheduler');

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

	var jobQuery = appContext.getQuery('restak.data-dir.jobs');

	appContext.registerObject('rest.scheduler.JobQuery', jobQuery);
	appContext.registerObject('rest.scheduler.Scheduler', new Scheduler(jobQuery, appContext.commandExecutor));
};