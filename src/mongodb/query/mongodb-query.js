'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.mongodb.query.MongoDBQuery'),
	FilterParser = require('../../query/antlr/filter-parser'),
	MongoDBFilterListener = require('./mongodb-filter-listener'),
	SortParser = require('../../query/antlr/sort-parser'),
	NeDBSortListener = require('../../nedb/query/nedb-sort-listener'),
	queryUtil = require('../../query/query-util');

/**
 * A {@link restak.query.Query} implementation that uses NeDB as the underlying data store.
 *
 * @constructor
 * @memberof restak.mongodb.query
 * @implements restak.query.Query
 * @param {nedb.Datastore} collection - The MongoDB collection.
 * @param {restak.util.ObjectTransform} objectTransform - optional, a way to transform the object from what exists in the store to what should be returned.
 * @param {String[]} objectIdProperties - optional, the ids of properties that are stored as ObjectIds
 */
var MongoDBQuery = function(collection, objectTransform, objectIdProperties){

	/**
	 * The datastore to query for data.
	 *
	 * @type mongodb.Collection
	 */
	this.collection = collection;

	/**
	 * A transform that will modify what is returned from the datastore before beeing returned to the caller.
	 *
	 * @protected
	 * @type restak.util.ObjectTransform
	 */
	this.objectTransform = objectTransform;

	/**
	 * The listener used in the parsing of the filter expression.
	 *
	 * @protected
	 * @type restak.mongodb.query.MongoDBFilterListener
	 */
	this.filterListener = new MongoDBFilterListener(objectIdProperties);

	/**
	 * The listener used in the parsing of the sort expression.
	 *
	 * @protected
	 * @type restak.nedb.query.NeDBSortListener
	 */
	this.sortListener = new NeDBSortListener();
};

/** @inheritdoc */
MongoDBQuery.prototype.execute = function(req, callback) {

	var _t = this;

	this.executeCursor(req, function(err, result){
		if(err) return callback(err, null);

		var cursor = result.cursor;

		var items = [];
		cursor.forEach(
			function(doc){
				items.push(_t.processDocument(doc));
			}, function(err){
				result.items = items;
				callback(null, result);
			});
	});
};

MongoDBQuery.prototype.processDocument = function(doc) {
	
	var objectTransform = this.objectTransform;

	return objectTransform ? objectTransform.transform(doc) : doc;
};

MongoDBQuery.prototype.executeCursor = function(req, callback) {

	var collection = this.collection,
		filterListener = this.filterListener,
		sortListener = this.sortListener;

	// Filter
	var filterParser = new FilterParser(filterListener, req),
		filterObject = {};

	if(!filterParser.isValid()) {
		logger.debug('Invalid query request. Cannot execute query.');
		callback(filterParser.getErrorMessages(), null);
		return;
	}

	if(filterParser.tree) {
		filterObject = filterParser.tree.filterObject;
	}

	// Sort
	var sortParser = new SortParser(sortListener, req),
		sortObject = {};
	
	if(!sortParser.isValid()) {
		logger.debug('Invalid query request. Cannot execute query.');
		callback(sortParser.getErrorMessages(), null);
		return;
	}

	if(sortParser.tree) {
		sortObject = sortParser.tree.sortObject;
	}	

	collection.count(filterObject, function(err, count){
		
		if(err){
			logger.error('An error occurred querying for count: ' + err);
			return callback(err, null);
		}

		var qResult = queryUtil.buildResult(req, count),
			skip = (qResult.page - 1) * qResult.pageSize,
			limit = qResult.pageSize;

		var cursor = collection.find(filterObject)
			.sort(sortObject)
			.limit(limit);

		if(skip > 0)
			cursor = cursor.skip(skip);

		qResult.cursor = cursor;

		callback(null, qResult);
	});
};

module.exports = MongoDBQuery;