'use strict';

/**
 * @namespace restak.rest.endpoints
 */

/**
 * Context for performing an action in an endpoint.
 *
 * @typedef EndpointContext
 * @memberof restak.rest.endpoints
 * @type {object}
 * @param {Request} req - The HTTP request from the expressjs server.
 */

module.exports.Endpoint = require('./endpoint');
module.exports.CollectionEndpoint = require('./collection-endpoint');
module.exports.ResourceEndpoint = require('./resource-endpoint');
module.exports.ResourceQueryEndpoint = require('./resource-query-endpoint');
module.exports.ResourcePostEndpoint = require('./resource-post-endpoint');
module.exports.ResourcePutEndpoint = require('./resource-put-endpoint');