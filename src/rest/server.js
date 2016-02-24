'use strict';

var log4js = require('log4js'),
	logger = log4js.getLogger('restak.rest.RestServer'),
	requestLogger = log4js.getLogger('restak.rest.RestServer-Requests'),
	util = require('util'),
	express = require('express'),
	morgan = require('morgan'),
	messageBuilder = require('./messages').MessageBuilder.DEFAULT;
	
 /**
  * Configuration for the REST server.
  *
  * @typedef RestServerConfig
  * @memberof restak.rest
  * @property {Number} port - The port the server should listen on.
  * @property {String} appName - The name of the application.
  * @property {String} appVersion - The version of the application.
  * @property {String} unhandledErrorCode - The error code on error messages for unhandled errors.  Defaults to 'SYS-0000'. This is *not* the HTTP status code.
  * @see restak.rest.RestServer
  * @see restak.messages.Message
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
 * @property {Object} data - The data to return to the caller; specific to the endpoint.
 * @property {restak.rest.messages.Message[]} messages - Any messages to return to the caller; specific to the endpoint.
 */

/**
 * Wraps an express application to provide REST services defined via {@link restak.rest.endpoints.Endpoint|endpoints}.
 * 
 * @constructor
 * @memberof restak.rest
 * @param {restak.rest.endpoints.Endpoint[]} endpoints - The endpoints this server is to support.
 * @param {restak.rest.RestServerConfig} config - Configuration parameters for the server.
 */
var RestServer = function(endpoints, config){

	/**
	 * The endpoints this server serves.
	 *
	 * @type restak.rest.endpoints.Endpoint[]
	 */
	this.endpoints = endpoints;

	/**
	 * Configuration parameters for the server.
	 *
	 * @type restak.rest.RestServerConfig
	 */
	this.config = config;

	/**
	 * The expressjs application that hosts the endpoint.
	 *
	 * @type expressjs.Application
	 */
	this.app = express();

	/**
	 * The application descriptor.
	 *
	 * @type restak.rest.ApplicationDescriptor
	 */
	this.appDescriptor = {
		appName: this.config.appName || 'REST server',
		appVersion: this.config.appVersion
	};

	// Configure expressjs app
	var _t = this,
		app = this.app;

	logger.debug('Registering endpoints');
	(this.endpoints || []).forEach(function(ep){ ep.register(app, _t); });

	logger.debug('Registering middleware');
	
	// use morgan to build the log, but log4js to write the data.
	this.app.use(morgan('combined', {
		stream: {
			write: function(str) {
				requestLogger.info(str);
			}
		}
	}));

	// error handling
	this.app.use(function (err, req, res, next) { _t.onUnhandledError(err, req, res, next); });
};

/**
 * Error handler to catch all unhandled errors. 
 *
 * http://expressjs.com/en/guide/error-handling.html
 *
 * @protected
 * @param {Error} err - the unhandled error.
 * @param {Request} req - The HTTP request from the expressjs server.
 * @param {Response} res - The HTTP response from the expressjs server.
 * @param {Function} next - the next function in the chain.
 */
RestServer.prototype.onUnhandledError = function(err, req, res, next){
	
	logger.error('Unhandled Error: ' + err.message);

	if (res.headersSent) {
		logger.debug('Headers previously sent.  Deferring error handling.');
		return next(err);
	}

	var errCode = this.config.unhandledErrorCode || 'SYS-0000',
		errMessage = messageBuilder.buildErrorMessage(errCode, err.message),
		response = this.buildRestResponse(req, res, null, errMessage);

	res.status(500).send(response);
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
RestServer.prototype.buildRestResponse = function(req, res, data, messages){

	var msgs = [];
	if(util.isArray(messages)){
		msgs = messages;
	} else if (messages) {
		msgs.push(messages);
	}

	return {
		application: 	this.appDescriptor,
		data: 			data,
		messages: 		msgs
	};
};

/**
 * Start the expressjs server and handle requests to the REST services.
 */
RestServer.prototype.start = function() {

	var applicationName = this.appDescriptor.appName;
	if(this.appDescriptor.appVersion) {
		applicationName = applicationName + ' [' + this.config.appVersion + ']';
	}

	var _t = this,
		port = this.config.port || 3000,
		app = this.app;

	logger.debug(applicationName + ' starting REST server on port ' + port);
	
	app.listen(port, function () {
		logger.debug(applicationName + ' listening on port ' + port);
		logger.info(applicationName + ' startup complete');
	});
};

module.exports = RestServer;