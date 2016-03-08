'use strict';

var log4js = require('log4js'),
	logger = log4js.getLogger('restak.rest.ResourcePutEndpoint'),
	util = require('util'),
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
// * @param {Number} successHttpStatusCode - the status code to return on successful execution of the command.
	CommandEndpoint.apply(this, arguments.concat([201]));
};
util.inherits(ResourcePutEndpoint, CommandEndpoint);

/** @inheritdoc */
ResourcePutEndpoint.prototype.register = function(app, server) {
	CommandEndpoint.prototype.register.apply(this, arguments);

	var _t = this;
	app.put(this.path, function (req, res) { _t.onRequest(req, res); });
	this.logger.debug('Path registered [PUT] ' + this.path);
};

module.exports = ResourcePutEndpoint;