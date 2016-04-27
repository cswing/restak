'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.query.object-query.InMemoryObjectQuery'),
	util = require('util'),
	ObjectFilter = require('./object-filter').ObjectFilter,
	ObjectSort = require('./object-sort').ObjectSort,
	queryUtil = require('../query-util');

var objSort = new ObjectSort();

/**
 * An implementation of {@link restak.query.Query|Query} that uses and array of javascript objects for it's backing store.
 *
 * @implements restak.query.Query
 * @memberof restak.query.object-query
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

	var objFilter = new ObjectFilter(req);

	if(!objFilter.parser.isValid()) {
		logger.debug('Invalid query request. Cannot execute query.');
		callback(objFilter.parser.getErrorMessages(), null);
		return;
	}

	var filteredData = this.data.filter(function(item){ return objFilter.filter(item); }),
		qResult = queryUtil.buildResult(req, filteredData.length),
		begin = (qResult.page - 1) * qResult.pageSize,
		end = begin + qResult.pageSize;

	qResult.items = objSort.sort(req, 
		JSON.parse(JSON.stringify(filteredData.slice(begin, end))));

	callback(null, qResult);
};

module.exports = InMemoryObjectQuery;