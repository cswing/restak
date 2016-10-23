'use strict';

var util = require('util'),
	ObjectId = require('mongodb').ObjectId,
	NeDBFilterListener = require('../../nedb/query/nedb-filter-listener');

/**
 * Takes the output of filter parsing and creates a set of javascript object for a MongoDB find call.
 *
 * @constructor
 * @memberof restak.mongodb.query
 * @implements restak.query.antlr.FilterListener
 * @param {String[]} objectIdProperties - optional, the ids of properties that are stored as ObjectIds
 */
var MongoDBFilterListener = function(objectIdProperties){
	NeDBFilterListener.apply(this, arguments);

	/**
	 * Ids of properties that are stored as ObjectIds
	 *
	 * @type String
	 */
	this.objectIdProperties = {};

	var _t = this;
	(objectIdProperties || []).forEach(function(id){
		_t.objectIdProperties[id] = true;
	});
};
util.inherits(MongoDBFilterListener, NeDBFilterListener);

MongoDBFilterListener.prototype._setValue = function(literalCtx, val){

	var predicateCtx = literalCtx.parentCtx.parentCtx,
		predicate = predicateCtx.__currentPredicate,
		propertyName = predicate.__prop,
		updateVal = val;

	if(this.objectIdProperties[propertyName] === true) {
		updateVal = new ObjectId(val);
	}

	NeDBFilterListener.prototype._setValue.apply(this, [literalCtx, updateVal]);
};

module.exports = MongoDBFilterListener