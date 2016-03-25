'use strict';

var log4js = require('log4js'),
	logger = log4js.getLogger('restak.scheduler'),
	Scheduler = require('./scheduler');

/**
 * @namespace restak.scheduler
 */

module.exports.nedb = require('./nedb'); 
module.exports.restEndpoints = require('./rest-endpoints');

/**
 * Register the necessary objects for the {@link restak.scheduler} namespace.  It requires the commands and query to exist in the appContext.
 *
 * @function register
 * @memberof restak.scheduler
 * @see restak.app-server.register
 */
module.exports.register = function(appContext) {
	var jobsQuery = appContext.getQuery('restak.scheduler.JobsQuery');
	appContext.registerObject('restak.scheduler.Scheduler', new Scheduler(jobsQuery, appContext.commandExecutor));
};