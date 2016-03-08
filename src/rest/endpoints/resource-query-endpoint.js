'use strict';

var log4js = require('log4js'),
	logger = log4js.getLogger('restak.rest.ResourceQueryEndpoint'),
	util = require('util'),
	ResourceEndpoint = require('./resource-endpoint');


/**
 * Create's an endpoint to handle a REST resource.
 *
 * @constructor
 * @extends restak.rest.ResourceEndpoint
 * @memberof restak.rest.endpoints
 * @param {Logger} logger - a log4js logger to use when logging.
 * @param {String} path - the path to register the endpoint to.
 * @param {Query} query - The query to use when a request is made to this collection.
 */
var ResourceQueryEndpoint = function(logger, path, query){
	ResourceEndpoint.apply(this, arguments);
	this.query = query;
};
util.inherits(ResourceQueryEndpoint, ResourceEndpoint);

/**
 * Provide the filter to identify the single entity that is being requested.
 *
 * @protected
 * @abstract
 * @param {Request} req - The HTTP request from the expressjs server.
 * @returns {String} the fixed filter
 */
ResourceQueryEndpoint.prototype.getFixedFilter = function(req){
	return null;
};

/**
 * Provides an opportunity to modify the items that are returned to the caller.
 * For example, one might add links to the entity being returned.
 *
 * @protected
 * @param {Object} item - An item returned from the query
 * @param {restak.rest.endpoints.EndpointContext} context - The context in which the request is executing.
 * @returns {Object} the item to return to the caller.
 */
ResourceQueryEndpoint.prototype.postProcessItem = function(item, context){
	return item;
};

/**
 * Handles a HTTP request for a REST resource.
 *
 * @param {Request} req - The HTTP request from the expressjs server.
 * @param {Response} res - The HTTP response from the expressjs server.
 */
ResourceQueryEndpoint.prototype.onRequest = function(req, res){
	
	var _t = this,
		query = this.query;

	var queryRequest = {
		filter: this.getFixedFilter(req)
	};

	query.execute(queryRequest, function(err, queryResult){
	
		if(err) {
			_t.handleError(req, res, err);
			return;
		}

		if(queryResult.totalCount == 0) {
			res.status(404).send();
			return;
		}

		if(queryResult.totalCount > 1) {
			logger.warn(req.url + ' query returned more than 1 item where only one item was expected. Using the first item.');
		}

		var item = _t.postProcessItem(queryResult.items[0], {
			req: req
		});

		res.send(_t.buildRestResponse(req, res, item));
	});
};

module.exports = ResourceQueryEndpoint;