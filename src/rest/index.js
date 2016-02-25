'use strict';

/**
 * @namespace restak.rest
 */

/**
 * A set of properties that describes the application being served by a {@link restak.rest.RestServer | REST server}.
 *
 * @typedef ApplicationDescriptor
 * @memberof restak.rest
 * @property {String} appName - The name of the application.
 * @property {String} appVersion - The version of the application.
 * @see restak.rest.RestServer
 */

/**
 * Data structure for all responses from {@link restak.rest.endpoints.Endpoint|endpoints}.
 *
 * @typedef RestResponse
 * @memberof restak.rest
 * @property {restak.rest.ApplicationDescriptor} application - The application descriptor.
 * @property {Object} payload - The payload to return to the caller; specific to the endpoint.
 * @property {restak.rest.messages.Message[]} messages - Any messages to return to the caller; specific to the endpoint.
 */

/**
 * A link to another resource in the system.
 * 
 * @typedef ResourceLink
 * @memberof restak.rest
 * @property {String} name - The name of the resource that the link represents.
 * @property {String} rel - The relationship of this resource in context of the resource presenting the link.
 * @property {String} href - The link that will take the user to the resource described by the link.
 */

module.exports.RestServer = require('./server');
module.exports.endpoints = require('./endpoints');