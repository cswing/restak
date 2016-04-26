'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.nedb.query.NeDBQuery'),
	FilterParser = require('../../query/antlr/filter-parser'),
	NeDBFilterListener = require('./nedb-filter-listener'),
	queryUtil = require('../../query/query-util');

/**
 * A {@link restak.query.Query} implementation that uses NeDB as the underlying data store.
 *
 * @constructor
 * @memberof restak.nedb.query
 * @implements restak.query.Query
 * @param {nedb.Datastore} store - The NeDB datastore.
 * @param {restak.util.ObjectTransform} objectTransform - optional, a way to transform the object from what exists in the store to what should be returned.
 */
var NeDBQuery = function(store, objectTransform){

	/**
	 * The datastore to query for data.
	 *
	 * @type nedb.Datastore
	 */
	this.store = store;

	/**
	 * A transform that will modify what is returned from the datastore before beeing returned to the caller.
	 *
	 * @protected
	 * @type restak.util.ObjectTransform
	 */
	this.objectTransform = objectTransform;

	/**
	 * The parser listener used in the parsing of the filter.
	 *
	 * @protected
	 * @type restak.nedb.query.NeDBFilterListener
	 */
	this.listener = new NeDBFilterListener();
};

/** @inheritdoc */
NeDBQuery.prototype.execute = function(req, callback) {

	var db = this.store,
		listener = this.listener,
		objectTransform = this.objectTransform;

	var parser = new FilterParser(listener, req);

	if(!parser.isValid()) {
		logger.debug('Invalid query request. Cannot execute query.');
		callback(parser.getErrorMessages(), null);
		return;
	}

	var filterObject = {},
		tasks = [];

	if(parser.tree) {
		filterObject = parser.tree.filterObject;
	}

	db.count(filterObject, function(err, count){
		
		if(err){
			logger.error('An error occurred querying for count: ' + err);
			return callback(err, null);
		}

		var qResult = queryUtil.buildResult(req, count),
			skip = (qResult.page - 1) * qResult.pageSize,
			limit = qResult.pageSize;

		db.find(filterObject)
			.skip(skip).limit(limit)
			.exec(function(err, docs){

				if(err){
					logger.error('An error occurred querying for docs: ' + err);
					return callback(err, null);
				}

				if(objectTransform){
					qResult.items = docs.map(function(doc){
						return objectTransform.transform(doc);
					});
				} else {
					qResult.items = docs;	
				}

				//TODO add transform
				

				callback(null, qResult);
			});
	});
};

module.exports = NeDBQuery;