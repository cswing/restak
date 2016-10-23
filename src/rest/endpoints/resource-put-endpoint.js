'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.rest.ResourcePutEndpoint'),
	util = require('util'),
	validate = require('express-validation'),
	CommandEndpoint = require('./command-endpoint');

/**
 * Create's an endpoint to handle an HTTP PUT on a REST resource.
 *
 * @constructor
 * @extends restak.rest.endpoints.CommandEndpoint
 * @memberof restak.rest.endpoints
 * @param {Logger} logger - a log4js logger to use when logging.
 * @param {String} path - the path to register the endpoint to.
 * @param {restak.command.Command} command - the command to execute.
 */
var ResourcePutEndpoint = function(logger, path, command){
	var args = Array.prototype.slice.call(arguments);
	args.push(200);
	CommandEndpoint.apply(this, args);

	this.registerValidationMiddleware();
};
util.inherits(ResourcePutEndpoint, CommandEndpoint);

/**
 * Registers the middleware for validating a request.  The default implementation builds the validation 
 * object once and uses it for all requests.
 * 
 * If dynamic validation is needed, this function can be overridden and the validation object can be built 
 * per request.
 */
ResourcePutEndpoint.prototype.registerValidationMiddleware = function(){
	this.registerMiddleware(validate(this.getValidationDefinition()));
};

/**
 * Provide a validation definition to be used in middleware.  By default, it uses the validation object
 * from the command and expect all parameters to be in the body.  However, there are times where a required
 * parameter might be parte of the url.  This method allows the specific endpoint to configure this.
 *
 * @returns an object that can be passed into express-validation and used as misddleware.
 */
ResourcePutEndpoint.prototype.getValidationDefinition = function(){
	return { body: this.command.validation };
};

/** @inheritdoc */
ResourcePutEndpoint.prototype.register = function(app, server) {
	CommandEndpoint.prototype.register.apply(this, arguments);

	var _t = this;
	app.put(this.path, this.middleware, function (req, res) { _t.onRequest(req, res); });
	this.logger.debug('Path registered [PUT] ' + this.path);
};

module.exports = ResourcePutEndpoint;