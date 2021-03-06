'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.rest.RestServer'),
	requestLogger = log4js.getLogger('restak.rest.RestServer-Requests'),
	util = require('util'),
	express = require('express'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	validation = require('express-validation'),
	CommandValidationError = require('../command/validation-error'),
	messageBuilder = require('./messages').MessageBuilder.DEFAULT;
	
 /**
  * Configuration for the REST server.
  *
  * @typedef RestServerConfig
  * @memberof restak.rest
  * @property {Number} port - The port the server should listen on.
  * @property {String} appName - The name of the application.
  * @property {String} appVersion - The version of the application.
  * @property {String} urlPrefix - A url prefix to register this application to. Optional, defaults to '/api'
  * @property {String} unhandledErrorCode - The error code on error messages for unhandled errors.  Defaults to 'SYS-0000'. This is *not* the HTTP status code.
  * @see restak.rest.RestServer
  * @see restak.messages.Message
  */ 

/**
 * Wraps an express application to provide REST services defined via {@link restak.rest.endpoints.Endpoint|endpoints}.
 * 
 * @constructor
 * @memberof restak.rest
 * @param {restak.app-server.ApplicationDescriptor} - The application descriptor.
 * @param {restak.rest.RestServerConfig} config - Configuration parameters for the server.
 * @param {restak.rest.endpoints.Endpoint[]} endpoints - The endpoints this server is to support.
 * @param {restak.rest.middleware.Middleware[]} middleware - The middleware to install on the express server.
 */
var RestServer = function(appDescriptor, config, endpoints, middleware){

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
	 * Configuration parameters for the server.
	 *
	 * @type restak.rest.Middleware[]
	 */
	this.middleware = middleware;

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
	this.appDescriptor = appDescriptor;

	// Configure expressjs app
	var _t = this,
		app = this.app;

	logger.debug('Registering middleware');
	
	// use morgan to build the log, but log4js to write the data.
	this.app.use(morgan('combined', {
		stream: {
			write: function(str) {
				requestLogger.info(str);
			}
		}
	}));
	this.app.use(bodyParser.json()); // for parsing application/json
	this.app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

	(this.middleware || []).forEach(function(mw){ mw.install(app); });

	logger.debug('Registering endpoints');
	(this.endpoints || []).forEach(function(ep){ ep.register(app, _t); });
	
	logger.debug('Registering error handling');
	this.app.use(function (err, req, res, next) { _t.handleError(err, req, res, next); });
};

/**
 * Error handler to catch errors. 
 *
 * http://expressjs.com/en/guide/error-handling.html
 *
 * @protected
 * @param {Error|String} err - the unhandled error.
 * @param {Request} req - The HTTP request from the expressjs server.
 * @param {Response} res - The HTTP response from the expressjs server.
 * @param {Function} next - the next function in the chain.
 */
RestServer.prototype.handleError = function(err, req, res, next){
	
	if (res.headersSent) {
		logger.debug('Headers previously sent.  Deferring error handling.');
		return next(err);
	}

	// validation errors
	if (err instanceof validation.ValidationError) {
		var response = this.buildRestResponse(req, res, { 'validation-errors': err.errors });
		return res.status(err.status).json(response);
	}

	if (err instanceof CommandValidationError) {
		var error = {
				field: err.field,
				messages: [err.message],
				types: [err.type]
			},
			response = this.buildRestResponse(req, res, { 'validation-errors': [error] });

		return res.status(400).json(response);	
	}

	// unhandled errors
	if(typeof err === 'string') {
		err = {
			message: err,
			stack: null
		};
	}

	logger.error('Unhandled Error: ' + err.message);
	logger.error(err.stack);

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
 * @param {Object} payload - The payload to return.
 * @param {restak.rest.messages.Message[]|restak.rest.messages.Message} - The message or messages to return.
 * @returns {restak.rest.RestResponse} - The REST response with data and messages.
 */
RestServer.prototype.buildRestResponse = function(req, res, payload, messages){

	var msgs = [];
	if(util.isArray(messages)){
		msgs = messages;
	} else if (messages) {
		msgs.push(messages);
	}

	return {
		application: 	this.appDescriptor,
		payload: 		payload,
		messages: 		msgs
	};
};

RestServer.prototype._getUrlPrefix = function(){
	if(this.config.has('urlPrefix'))
		return this.config.get('urlPrefix');

	return '/api';
};

/**
 * Utility method to build a {restak.rest.ResourceLink}.
 * 
 * @param {Request} req - The HTTP request from the expressjs server.
 * @param {String} name - The name of the resource that the link represents.
 * @param {String} rel - The relationship of this resource in context of the resource presenting the link.
 * @param {String} url - The url that will take the user to the resource described by the link.
 * @return {restak.rest.ResourceLink} Returns the resource link.
 */
RestServer.prototype.buildResourceLink = function(req, name, rel, url) {

	// TODO better handling of url building
	//  test for trialing slash

	return {
		name: name,
		rel: rel,
		url: req.protocol + '://' + req.headers.host + this._getUrlPrefix() + url
	};
};

/**
 * Registers the REST express app witht he parent app provided.  The REST app will be registered using the 
 * urlPrefix provided in the configuration.
 *
 * @param {express} parentApp - the parent app to register the REST app with.
 */
RestServer.prototype.registerApp = function(parentApp) {
	parentApp.use(this._getUrlPrefix(), this.app);
};

module.exports = RestServer;