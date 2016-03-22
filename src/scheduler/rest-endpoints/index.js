'use strict';

var log4js = require('log4js'),
	logger = log4js.getLogger('restak.scheduler'),
	jobEndpoints = require('./job-endpoints');

/**
 * @namespace restak.scheduler.rest-endpoints
 */
 

/**
 * Register the necessary objects for the {@link restak.scheduler} namespace.  It requires the commands and query to exist in the appContext.
 *
 * @function register
 * @memberof restak.scheduler.rest-endpoints
 * @see restak.app-server.register
 */
module.exports.register = function(appContext, options) {

	appContext.registerEndpoint('restak.scheduler.rest-endpoints.JobsCollection', new jobEndpoints.CollectionEndpoint());
	
};