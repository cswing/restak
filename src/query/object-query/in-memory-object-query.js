'use strict';

var log4js = require('log4js'),
	logger = log4js.getLogger('restak.query.object-query.InMemoryObjectQuery'),
	util = require('util'),
	ObjectFilter = require('./object-filter').ObjectFilter;

var DEFAULT_PAGE_SIZE = 25;

/**
 * An implementation of {@link restak.query.Query|Query} that uses and array of javascript objects for it's backing store.
 *
 * @implements restak.query.Query
 * @memberof restak.query.objectQuery
 * @constructor
 * @param {Array} data - The backing data use when querying
 */
var InMemoryObjectQuery = function(data){

	/**
	 * The backing data use when querying
	 *
	 * @type Array
	 */
	this.data = data || [];
};

/** @inheritdoc */
InMemoryObjectQuery.prototype.execute = function(req, callback){

	var objFilter = new ObjectFilter(req),
		request = req || {};

	if(!objFilter.parser.isValid()) {
		logger.debug('Invalid query request. Cannot execute query.');
		callback(objFilter.parser.getErrorMessages(), null);
		return;
	}

	var filteredData = this.data.filter(function(item){ return objFilter.filter(item); }),
		page = request.page || 1,
		pageSize = request.pageSize || DEFAULT_PAGE_SIZE;

	if (page<=0) {
		logger.debug('Negative page requested, reverting to default.');
		page = 1;
	}

	if (pageSize<=0) {
		logger.debug('Negative page size requested, reverting to default.');
		pageSize = DEFAULT_PAGE_SIZE;
	}
	
	var qResult = {
		filter: objFilter.parser.filter,
		pageSize: pageSize,
		page: page,
		pageCount: Math.ceil(filteredData.length / pageSize),
		totalCount: filteredData.length
	};
	
	if(page > qResult.pageCount) {
		logger.debug('Page requested greater than total pages, reverting to last available page.');
		page = qResult.page = qResult.pageCount;
	}
	
	var begin = (page - 1) * pageSize,
		end = begin + pageSize;

	qResult.data = filteredData.slice(begin, end);

	callback(null, qResult);
};

module.exports = InMemoryObjectQuery;