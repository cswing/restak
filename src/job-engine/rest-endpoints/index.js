'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.job-engine'),
	jobEndpoints = require('./job-endpoints'),
	statusEndpoints = require('./status-endpoints');

/**
 * @namespace restak.job-engine.rest-endpoints
 */

/**
 * @namespace restak.job-engine.rest-endpoints.jobs
 */

/**
 * @namespace restak.job-engine.rest-endpoints.status
 */
 
module.exports.util = require('./job-util');

/**
 * Register the necessary endpoints for the {@link restak.job-engine} namespace.
 *
 * @function register
 * @memberof restak.job-engine.rest-endpoints
 * @see restak.app-server.register
 */
module.exports.register = function(appContext, options) {

	var queueCommand = appContext.getCommand('restak.job-engine.QueueJobInvocationCommand');

	appContext.registerEndpoint('restak.job-engine.rest-endpoints.JobsCollection', new jobEndpoints.CollectionEndpoint());
	appContext.registerEndpoint('restak.job-engine.rest-endpoints.JobResourceGet', new jobEndpoints.ResourceGetEndpoint());
	appContext.registerEndpoint('restak.job-engine.rest-endpoints.JobResourcePost', new jobEndpoints.ResourcePostEndpoint(queueCommand));

	appContext.registerEndpoint('restak.job-engine.rest-endpoints.StatusCollection', new statusEndpoints.CollectionEndpoint());
	appContext.registerEndpoint('restak.job-engine.rest-endpoints.StatusResourceGet', new statusEndpoints.ResourceGetEndpoint());
};