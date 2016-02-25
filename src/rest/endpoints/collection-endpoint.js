'use strict';

var log4js = require('log4js'),
	logger = log4js.getLogger('restak.rest.CollectionEndpoint'),
	util = require('util'),
	url = require('url'),
	Endpoint = require('./endpoint');

/**
 * Create's an endpoint to handle a REST collection, delegating to the query that is provided.
 *
 * @constructor
 * @extends Endpoint
 * @memberof restak.rest.endpoints
 * @param {Logger} logger - a log4js logger to use when logging.
 * @param {String} path - the path to register the endpoint to.
 * @param {Query} query - The query to use when a request is made to this collection.
 */
var CollectionEndpoint = function(logger, path, query){
	Endpoint.apply(this, arguments);
	this.path = path;
	this.query = query;
};
util.inherits(CollectionEndpoint, Endpoint);

/** @inheritdoc */
CollectionEndpoint.prototype.register = function(app, server) {
	Endpoint.prototype.register.apply(this, arguments);

	var _t = this;
	app.get(this.path, function (req, res) { _t.onRequest(req, res); });
	this.logger.debug('Path registered [GET] ' + this.path);
};

/**
 * Builds a {QueryRequest|query request} derived from the HTTP request.
 *
 * @protected
 * @param {Request} req - The HTTP request from the expressjs server.
 * @returns {QueryRequest} the query request.
 */
CollectionEndpoint.prototype.buildQueryRequest = function(req){
	
	var httpRequest = req || {},
		queryParams = url.parse(httpRequest.url || '', true).query;

	var queryRequest = {
		filter: queryParams.filter || '',
		page: Math.floor(Number(queryParams.page)),
		pageSize: Math.floor(Number(queryParams.pageSize)),
	};

	if(isNaN(queryRequest.page)) {
		queryRequest.page = 1;
	}

	if(isNaN(queryRequest.pageSize)) {
		queryRequest.pageSize = 25;
	}

	return queryRequest;
};

var buildCollectionResponse = function(data, messages){
	return buildResponse({
		count: data.length,
		items: data
	}, messages);
};

/**
 * Handles a HTTP request for a REST collection.
 *
 * @param {Request} req - The HTTP request from the expressjs server.
 * @param {Response} res - The HTTP response from the expressjs server.
 */
CollectionEndpoint.prototype.onRequest = function(req, res){

	var _t = this,
		query = this.query,
		queryRequest = this.buildQueryRequest(req);

	query.execute(queryRequest, function(err, queryResult){
		
		if(err) {
			_t.handleError(req, res, err);
			return;
		}

		res.send(_t.buildRestResponse(req, res, queryResult));
	});
};

module.exports = CollectionEndpoint;