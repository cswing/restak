'use strict';

var util = require('util'),
	MessageBuilder = require('../messages').MessageBuilder;

/**
 * Base endpoint logic.
 *
 * @constructor
 * @memberof restak.rest.endpoints
 * @param {Logger} logger - a log4js logger to use when logging.
 */
var Endpoint = function(logger){
	
	/**
	 * A logger for logging details performed by the class.
	 *
	 * @type log4js.Logger
	 * @protected
	 */
	this.logger = logger;

	/**
	 * A message builder tool used to create messages to return to the entity invoking the endpoint.
	 *
	 * @type restak.rest.messages.MessageBuilder
	 * @protected
	 */
	this.messageBuilder = MessageBuilder.DEFAULT;

	/** 
	 * The query executor to use to execute queries.
	 *
	 * @type restak.query.QueryExecutor
	 */
	this.queryExecutor = null;

	/** 
	 * The command executor to use to execute commands.
	 *
	 * @type restak.command.CommandExecutor
	 */
	this.queryExecutor = null;

	/**
	 * An array of functions to register as specific middleware for the endpoint.
	 *
	 * @type function[]
	 */
	this.middleware = [];
};

/**
 * Registers the endpoint and logic for collection handling.
 *
 * NOTE: All implementations that override this function should call the base function.
 *
 * @param {expressjs.Application} app - The expressjs application that hosts the endpoint.
 * @param {restak.rest.RestServer} server - The server that will host the expressjs app and the endpoint.
 */
Endpoint.prototype.register = function(app, server) {

	/**
	 * The expressjs application that hosts the endpoint.
	 *
	 * @type expressjs.Application
	 */
	this.app = app;

	/**
	 * The server that will host the expressjs app and the endpoint.
	 *
	 * @type restak.rest.RestServer
	 */
	this.server = server;

	/**
	 * The configuration provider to the server.  
	 *
	 * Note: this is server specific and not endpoint specific. 
	 *
	 * @type restak.rest.RestServerConfig
	 */
	this.config = server.config;
};

/**
 * Common method for handling errors. Delegates to the server for error handling.
 *
 * @protected
 * @param {Error} err - the unhandled error.
 * @param {Request} req - The HTTP request from the expressjs server.
 * @param {Response} res - The HTTP response from the expressjs server.
 */
Endpoint.prototype.handleError = function(err, req, res){
	this.server.handleError(err, req, res, function(){});
};

/**
 * Given response data and messages, build a response object that can be returned to the caller.
 *
 * @protected
 * @param {Request} req - The HTTP request from the expressjs server.
 * @param {Response} res - The HTTP response from the expressjs server.
 * @param {Object} data - The data to return.
 * @param {restak.rest.messages.Message[]|restak.rest.messages.Message} - The message or messages to return.
 * @returns {restak.rest.RestResponse} - The REST response with data and messages.
 */
Endpoint.prototype.buildRestResponse = function(req, res, data, messages){
	return this.server.buildRestResponse(req, res, data, messages);
};

/**
 * Utility method to build a {restak.rest.ResourceLink}.  This function delegates to {restak.rest.Server#buildResourceLink}.
 * 
 * @param {Request} req - The HTTP request from the expressjs server.
 * @param {String} name - The name of the resource that the link represents.
 * @param {String} rel - The relationship of this resource in context of the resource presenting the link.
 * @param {String} url - The url that will take the user to the resource described by the link.
 * @return {restak.rest.ResourceLink} Returns the resource link.
 */
Endpoint.prototype.buildResourceLink = function(req, name, rel, url) {
	return this.server.buildResourceLink(req, name, rel, url);
};

/**
 * Register a middleware function for the endpoint.
 *
 * @param {Function} fn - the middleware function to register.
 */
Endpoint.prototype.registerMiddleware = function(fn){
	this.middleware.push(fn);
};

module.exports = Endpoint;