'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.rest.ResourceEndpoint'),
	util = require('util'),
	Endpoint = require('./endpoint');


/**
 * Create's an endpoint to handle a REST resource.
 *
 * @constructor
 * @extends restak.rest.Endpoint
 * @memberof restak.rest.endpoints
 * @param {Logger} logger - a log4js logger to use when logging.
 * @param {String} path - the path to register the endpoint to.
 */
var ResourceEndpoint = function(logger, path){
	Endpoint.apply(this, arguments);
	this.path = path;
};
util.inherits(ResourceEndpoint, Endpoint);

/** @inheritdoc */
ResourceEndpoint.prototype.register = function(app, server) {
	Endpoint.prototype.register.apply(this, arguments);

	var _t = this;
	app.get(this.path, this.middleware, function (req, res) { _t.onRequest(req, res); });
	this.logger.debug('Path registered [GET] ' + this.path);
};

/**
 * Handles a HTTP request for a REST resource.
 *
 * @param {Request} req - The HTTP request from the expressjs server.
 * @param {Response} res - The HTTP response from the expressjs server.
 */
ResourceEndpoint.prototype.onRequest = function(req, res){
	var _t = this;
	this.getPayload(req, function(err, payload){

		if(!payload) {
			res.status(404).send();
			return;
		}

		res.send(_t.buildRestResponse(req, res, payload));
	});
};

ResourceEndpoint.prototype.getPayload = function(req, callback){
	callback(null, null);
};

module.exports = ResourceEndpoint;