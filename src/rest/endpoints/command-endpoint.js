'use strict';

var util = require('util'),
	Endpoint = require('./endpoint');

/**
 * Create's an endpoint that proxies the execution of a {@link restak.command.Command|command}.  It is the responsibility of 
 * an implementing class to wire the path to the {@link restak.command.Command#onRequest|onRequest} function.
 *
 * @constructor
 * @extends restak.rest.Endpoint
 * @memberof restak.rest.endpoints
 * @param {Logger} logger - a log4js logger to use when logging.
 * @param {String} path - the path to register the endpoint to.
 * @param {restak.command.Command} command - the command to execute.
 * @param {Number} successHttpStatusCode - the status code to return on successful execution of the command.
 */
var CommandEndpoint = function(logger, path, command, successHttpStatusCode){
	Endpoint.apply(this, arguments);
	this.path = path;
	this.command = command;
	this.successHttpStatusCode = successHttpStatusCode || 200;
};
util.inherits(CommandEndpoint, Endpoint);

/**
 * Given an http request, build and validate the data object to pass to the command.
 *
 * @protected
 * @param {Request} req - The HTTP request from the expressjs server.
 * @param {Callback} callback - callback with the data to pass to the command.
 */
CommandEndpoint.prototype.buildData = function(req, callback){
	callback(null, {});
};

/**
 * Given a {@link restak.command.CommandResult|command result}, build the payload to return to the caller.
 *
 * @protected
 * @param {restak.command.CommandResult} cmdResult - The result of the command execution.
 * @returns {Object} the payload to return to the user
 */
CommandEndpoint.prototype.buildPayload = function(cmdResult){
	return cmdResult;
};

/**
 * Handles a HTTP put request to create a REST resource.
 *
 * @param {Request} req - The HTTP request from the expressjs server.
 * @param {Response} res - The HTTP response from the expressjs server.
 */
CommandEndpoint.prototype.onRequest = function(req, res){
	
	var _t = this,
		logger = this.logger,
		command = this.command,
		successHttpStatusCode = this.successHttpStatusCode;

	this.buildData(req, function(err, data){

		if(err) {
			_t.handleError(req, res, err);
			return;
		}

		var cmdInstr = {
			data: data
		};

		command.execute(cmdInstr, function(err, cmdResult){

			if(err){
				_t.handleError(req, res, err);
				return;
			}

			res.status(successHttpStatusCode).send(
				_t.buildRestResponse(req, res, _t.buildPayload(cmdResult)) );
		});
	});		
};

module.exports = CommandEndpoint;