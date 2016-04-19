'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.rest.CollectionEndpoint'),
	util = require('util'),
	url = require('url'),
	Endpoint = require('./endpoint');

/**
 * Create's an endpoint to handle a REST collection, delegating to the query that is provided.
 *
 * @constructor
 * @extends restak.rest.endpoints.Endpoint
 * @memberof restak.rest.endpoints
 * @param {Logger} logger - A log4js logger to use when logging.
 * @param {String} path - The path to register the endpoint to.
 * @param {String} queryKey - The key that identifies the query to use when a request is made to this collection.
 */
var CollectionEndpoint = function(logger, path, queryKey){
	Endpoint.apply(this, arguments);
	this.path = path;
	this.queryKey = queryKey;
};
util.inherits(CollectionEndpoint, Endpoint);

/** @inheritdoc */
CollectionEndpoint.prototype.register = function(app, server) {
	Endpoint.prototype.register.apply(this, arguments);

	var _t = this;
	app.get(this.path, this.middleware, function (req, res) { _t.onRequest(req, res); });
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

/**
 * Provide the capability to provide a fixed filter on the query.  This is useful when a parameter in the route 
 * needs to be applied to the query.
 *
 * @protected
 * @param {Request} req - The HTTP request from the expressjs server.
 * @returns {String} the fixed filter
 */
CollectionEndpoint.prototype.getFixedFilter = function(req){
	return null;
};

/**
 * Handles a HTTP request for a REST collection.
 *
 * @param {Request} req - The HTTP request from the expressjs server.
 * @param {Response} res - The HTTP response from the expressjs server.
 */
CollectionEndpoint.prototype.onRequest = function(req, res){

	var _t = this,
		queryExecutor = this.queryExecutor,
		queryKey = this.queryKey,
		queryRequest = this.buildQueryRequest(req);

	var originalFilter = queryRequest.filter,
		fixedFilter = this.getFixedFilter(req);

	if(fixedFilter) {

		if(originalFilter && originalFilter.trim() != ''){
			queryRequest.filter = '(' + fixedFilter + ') AND (' + originalFilter + ')';
		} else {
			queryRequest.filter = fixedFilter;
		}
	}

	queryExecutor.executeQuery(queryKey, queryRequest, function(err, queryResult){
		
		if(err) {
			_t.handleError(err, req, res);
			return;
		}

		var buildUrl = function(page) {
			var result = req._parsedUrl.pathname + '?page=' + page + '&pageSize=' + queryResult.pageSize;
			if(queryResult.filter && queryResult.filter != '') {
				result = result + '&filter=' + encodeURIComponent(queryResult.filter) + '&'
			}
			return result;
		};

		queryResult.filter = originalFilter;

		var links = [];
		links.push(_t.buildResourceLink(req, 'First', 'first', buildUrl(1)));
		if(queryResult.page > 1) {
			links.push(_t.buildResourceLink(req, 'Previous', 'prev', buildUrl(queryResult.page - 1)));
		}
		if(queryResult.page < queryResult.pageCount) {
			links.push(_t.buildResourceLink(req, 'Next', 'next', buildUrl(queryResult.page + 1)));
		}
		links.push(_t.buildResourceLink(req, 'Last', 'last', buildUrl(queryResult.pageCount)));

		queryResult.links = links;

		queryResult.items = queryResult.items.map(
			function(item){
				return _t.postProcessItem(item, { 
					req: req
				});
			});

		res.send(_t.buildRestResponse(req, res, queryResult));
	});
};

/**
 * Provides an opportunity to modify the items that are returned to the caller.
 * For example, one might add links to the entity being returned.
 *
 * @protected
 * @param {Object} item - An item returned from the query
 * @param {Object} context - The context in which the request is executing.
 * @param {Request} context.req - The HTTP request from the expressjs server.
 * @returns {Object} the item to return to the caller.
 */
CollectionEndpoint.prototype.postProcessItem = function(item, context){
	return item;
};

module.exports = CollectionEndpoint;