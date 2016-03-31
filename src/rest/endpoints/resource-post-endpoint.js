'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.rest.ResourcePostEndpoint'),
	util = require('util'),
	validate = require('express-validation'),
	CommandEndpoint = require('./command-endpoint');

/**
 * Create's an endpoint to handle an HTTP POST on a REST resource.
 *
 * @constructor
 * @extends restak.rest.endpoints.CommandEndpoint
 * @memberof restak.rest.endpoints
 * @param {Logger} logger - a log4js logger to use when logging.
 * @param {String} path - the path to register the endpoint to.
 * @param {restak.command.Command} command - the command to execute.
 */
var ResourcePostEndpoint = function(logger, path, command){
	var args = Array.prototype.slice.call(arguments);
	args.push(201);
	CommandEndpoint.apply(this, args);

	this.registerMiddleware(validate({body: this.command.validation }));
};
util.inherits(ResourcePostEndpoint, CommandEndpoint);

/** @inheritdoc */
ResourcePostEndpoint.prototype.register = function(app, server) {
	CommandEndpoint.prototype.register.apply(this, arguments);

	var _t = this;
	app.post(this.path, this.middleware, function (req, res) { _t.onRequest(req, res); });
	this.logger.debug('Path registered [POST] ' + this.path);
};

module.exports = ResourcePostEndpoint;