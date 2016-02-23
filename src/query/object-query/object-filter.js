'use strict';

var log4js = require('log4js'),
	logger_filter = log4js.getLogger('XYZframework.query.object-query.object-filter'),
	logger_listener = log4js.getLogger('XYZframework.query.object-query.object-query-listener'),
	util = require('util'),
	QueryParser = require('../antlr').QueryParser,
	QueryListener = require('../antlr').QueryListener;

/**
 * @namespace restak.query.object
 */

var comparisonMap = {
	'_FALSE': function(lhs, rhs){
		return function(item){ return false; };
	},
	'=': function(lhs, rhs) {
		return function(item){
			return item[lhs] === rhs;
		};
	},
	'>': function(lhs, rhs) {
		return function(item){
			return item[lhs] > rhs;
		};
	},
	'<': function(lhs, rhs) {
		return function(item){
			return item[lhs] < rhs;
		};
	},
	'>=': function(lhs, rhs) {
		return function(item){
			return item[lhs] >= rhs;
		};
	},
	'<=': function(lhs, rhs) {
		return function(item){
			return item[lhs] <= rhs;
		};
	},
	'<>': function(lhs, rhs) {
		return function(item){
			if(!item[lhs])
				return false;
			
			return item[lhs] !== rhs;
		};
	},
	'!=': function(lhs, rhs) {
		return function(item){
			if(!item[lhs])
				return false;
			
			return item[lhs] !== rhs;
		};
	},
	'~': function(lhs, rhs) {
		return function(item){
			var valueToSearch = (item[lhs] || '')
				.toString()
				.toLowerCase();

			return valueToSearch.includes(rhs.toLowerCase());
		};
	}
};

/**
 * Takes the output of filter parsing and creates a set of javascript functions that
 * execute the specified query.
 *
 * @constructor
 * @memberof restak.query.object
 * @implements restak.query.antlr.QueryListener
 */
var ObjectQueryListener = function() {
	QueryListener.apply(this, arguments);

	this.filters = [];
};
util.inherits(ObjectQueryListener, QueryListener);

/**
 * Applies the filters that were created as a result of parsing the query request filter string on the item.
 *
 * @param {Object} item - the item to test the filter on.
 * @returns {boolean} true if the filters are all satisifed, otherwise false.
 */
ObjectQueryListener.prototype.filter = function(item) {
	/*
	return this.filters.every(function(fn){
		return fn(item);
	});
	*/
	return this._createFilter(this.filters, 'every')(item);
};

ObjectQueryListener.prototype._createFilter = function(filters, method){

	// if only one filter function, the array.every or array.some does not need to be called.
	if(filters.length == 1) { 
		return filters[0];
	}

	return function(item){
		return filters[method](function(fn){
			return fn(item);
		});
	};
};

ObjectQueryListener.prototype._initializeConditionArray = function(){
	this.currentConditionArray = [];
	this.conditionArray.push(this.currentConditionArray);
};

ObjectQueryListener.prototype._closeConditionArray = function(method){
	
	// take the filters in the last item of the array, create a filter 
	// and push the filter onto the second to last item.

	this.conditionArray.pop();

	// ASSUMPTION that there is always a second to last element.
	//  This is gauranteed by the call to _initializeConditionArray in enterParse

	var filters = this.currentConditionArray;
	
	this.currentConditionArray = this.conditionArray[this.conditionArray.length-1];
	
	this.currentConditionArray.push(
		this._createFilter(filters, method));
};

/** @inheritdoc */
ObjectQueryListener.prototype.enterParse = function(ctx) {

	if(logger_listener.isTraceEnabled) {
		logger_listener.trace('enterParse - ' + ctx.getText());
	}

	this.conditionArray = [];
	this._initializeConditionArray();
};

/** @inheritdoc */
ObjectQueryListener.prototype.exitParse = function(ctx) {

	if(logger_listener.isTraceEnabled) {
		logger_listener.trace('exitParse - ' + ctx.getText());
	}

	if(this.currentConditionArray.length != 1) {
		throw 'Something bad happened. Length should only be 1 at this point.'
	}

	this.filters = this.conditionArray[0];

	delete this.currentConditionArray;
	delete this.conditionArray;
};

/** @inheritdoc */
ObjectQueryListener.prototype.enterCondition = function(ctx) {

	if(logger_listener.isTraceEnabled) {
		logger_listener.trace('enterCondition - ' + ctx.getText());
	}

	this._initializeConditionArray();
};

/** @inheritdoc */
ObjectQueryListener.prototype.exitCondition = function(ctx) {

	if(logger_listener.isTraceEnabled) {
		logger_listener.trace('exitCondition - ' + ctx.getText());
	}

	this._closeConditionArray('every');
};

/** @inheritdoc */
ObjectQueryListener.prototype.enterCondition_or = function(ctx) {

	if(logger_listener.isTraceEnabled) {
		logger_listener.trace('enterCondition_or - ' + ctx.getText());
	}

	this._initializeConditionArray();
};

/** @inheritdoc */
ObjectQueryListener.prototype.exitCondition_or = function(ctx) {

	if(logger_listener.isTraceEnabled) {
		logger_listener.trace('exitCondition_or - ' + ctx.getText());
	}

	this._closeConditionArray('some');
};

/** @inheritdoc */
ObjectQueryListener.prototype.enterPredicate = function(ctx) {

	if(logger_listener.isTraceEnabled) {
		logger_listener.trace('enterPredicate - ' + ctx.getText());
	}

	this.currentPredicate = {};
};

/** @inheritdoc */
ObjectQueryListener.prototype.exitPredicate = function(ctx) {
	
	if(logger_listener.isTraceEnabled) {
		logger_listener.trace('exitPredicate - ' + ctx.getText());
	}

	if(!this.currentPredicate)
		return;

	var pred = this.currentPredicate,
		fnKey = pred.oper;

	if(!comparisonMap[pred.oper]) {
		logger_listener.debug('Unknown operator [' + pred.oper + ']: using default filter.');
		fnKey = '_FALSE';
	}
	
	this.currentConditionArray.push(
		comparisonMap[fnKey](pred.lhs, pred.rhs));

	delete this.currentPredicate;
};

/** @inheritdoc */
ObjectQueryListener.prototype.enterIdentifier = function(ctx) {
	this.currentPredicate.lhs = ctx.getText();
};

/** @inheritdoc */
ObjectQueryListener.prototype.enterComparison_operator = function(ctx) {
	this.currentPredicate.oper = ctx.getText();
};

/** @inheritdoc */
ObjectQueryListener.prototype.enterStringLiteral = function(ctx) {
	
	// remove single and double quotes that are on the ends of the string	
	var result = ctx.getText().substring(1);
	result = result.substring(0, result.length-1);

	this.currentPredicate.rhs = result;
};

/** @inheritdoc */
ObjectQueryListener.prototype.enterNumericLiteral = function(ctx) {
	this.currentPredicate.rhs = Number(ctx.getText());
};


/**
 * Given a {@link QueryRequest|request}, provide a way to apply the filter to an object.
 *
 * @constructor
 * @memberof restak.query.object
 * @param {restak.query.QueryRequest} request - The query request.
 */
var ObjectFilter = function(request){
	this.request = request;
	this.listener = new ObjectQueryListener();
	this.parser = new QueryParser(this.listener, this.request);
};

/**
 * Applies the filter specified in the {@link restak.query.QueryRequest|request} to the item.  If the filter is valid,
 * this function delegates to the {@link restak.query..object.ObjectQueryListener#filter}.
 *
 * @param {Object} item - the item to test the filter on.
 * @returns {boolean} true if the parser is valid and all filters are all satisifed, otherwise false.
 * @see restak.query.object.ObjectQueryListener#filter
 */
ObjectFilter.prototype.filter = function(item){
	
	if(!this.parser.isValid) {
		logger_filter.warn('Attempting to filter with an invalid filter: ' + this.request.filter);
		return false;
	}

	return this.listener.filter(item);
};

module.exports.ObjectQueryListener = ObjectQueryListener;
module.exports.ObjectFilter = ObjectFilter;