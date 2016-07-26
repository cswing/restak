'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.scheduler'),
	jobEndpoints = require('./job-endpoints'),
	statusEndpoints = require('./status-endpoints');

/**
 * @namespace restak.scheduler.rest-endpoints
 */

/**
 * @namespace restak.scheduler.rest-endpoints.jobs
 */

/**
 * @namespace restak.scheduler.rest-endpoints.status
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

	var queueCommand = appContext.getCommand('restak.scheduler.QueueJobInvocationCommand');

	appContext.registerEndpoint('restak.scheduler.rest-endpoints.JobsCollection', new jobEndpoints.CollectionEndpoint());
	appContext.registerEndpoint('restak.scheduler.rest-endpoints.JobResourceGet', new jobEndpoints.ResourceGetEndpoint());
	appContext.registerEndpoint('restak.scheduler.rest-endpoints.JobResourcePost', new jobEndpoints.ResourcePostEndpoint(queueCommand));

	appContext.registerEndpoint('restak.scheduler.rest-endpoints.StatusCollection', new statusEndpoints.CollectionEndpoint());
	appContext.registerEndpoint('restak.scheduler.rest-endpoints.StatusResourceGet', new statusEndpoints.ResourceGetEndpoint());
};