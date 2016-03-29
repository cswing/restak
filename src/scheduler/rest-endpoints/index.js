'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.scheduler'),
	jobEndpoints = require('./job-endpoints'),
	historyEndpoints = require('./history-endpoints');

/**
 * @namespace restak.scheduler.rest-endpoints
 */

/**
 * @namespace restak.scheduler.rest-endpoints.jobs
 */

/**
 * @namespace restak.scheduler.rest-endpoints.history
 */
 
module.exports.util = require('./job-util');

/**
 * Register the necessary endpoints for the {@link restak.scheduler} namespace.
 *
 * @function register
 * @memberof restak.scheduler.rest-endpoints
 * @see restak.app-server.register
 */
module.exports.register = function(appContext, options) {
	appContext.registerEndpoint('restak.scheduler.rest-endpoints.JobsCollection', new jobEndpoints.CollectionEndpoint());
	appContext.registerEndpoint('restak.scheduler.rest-endpoints.JobResourceGet', new jobEndpoints.ResourceGetEndpoint());
	appContext.registerEndpoint('restak.scheduler.rest-endpoints.HistoryCollection', new historyEndpoints.CollectionEndpoint());
	appContext.registerEndpoint('restak.scheduler.rest-endpoints.HistoryResourceGet', new historyEndpoints.ResourceGetEndpoint());
};