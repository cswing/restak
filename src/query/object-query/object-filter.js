'use strict';

var log4js = global.log4js || require('log4js'),
	logger_filter = log4js.getLogger('restak.query.object-query.object-filter'),
	logger_listener = log4js.getLogger('restak.query.object-query.object-filter-listener'),
	util = require('util'),
	FilterParser = require('../antlr').FilterParser,
	FilterListener = require('../antlr').FilterListener;

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
			return Number(item[lhs]) > Number(rhs);
		};
	},
	'<': function(lhs, rhs) {
		return function(item){
			return Number(item[lhs]) < Number(rhs);
		};
	},
	'>=': function(lhs, rhs) {
		return function(item){
			return Number(item[lhs]) >= Number(rhs);
		};
	},
	'<=': function(lhs, rhs) {
		return function(item){
			return Number(item[lhs]) <= Number(rhs);
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
 * @memberof restak.query.object-query
 * @implements restak.query.antlr.FilterListener
 */
var ObjectFilterListener = function() {
	FilterListener.apply(this, arguments);

	this.filters = [];
};
util.inherits(ObjectFilterListener, FilterListener);

/**
 * Applies the filters that were created as a result of parsing the query request filter string on the item.
 *
 * @param {Object} item - the item to test the filter on.
 * @returns {boolean} true if the filters are all satisifed, otherwise false.
 */
ObjectFilterListener.prototype.filter = function(item) {
	/*
	return this.filters.every(function(fn){
		return fn(item);
	});
	*/
	return this._createFilter(this.filters, 'every')(item);
};

ObjectFilterListener.prototype._createFilter = function(filters, method){

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

ObjectFilterListener.prototype._initializeConditionArray = function(){
	this.currentConditionArray = [];
	this.conditionArray.push(this.currentConditionArray);
};

ObjectFilterListener.prototype._closeConditionArray = function(method){
	
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
ObjectFilterListener.prototype.enterParse = function(ctx) {

	if(logger_listener.isTraceEnabled) {
		logger_listener.trace('enterParse - ' + ctx.getText());
	}

	this.conditionArray = [];
	this._initializeConditionArray();
};

/** @inheritdoc */
ObjectFilterListener.prototype.exitParse = function(ctx) {

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
ObjectFilterListener.prototype.enterCondition = function(ctx) {

	if(logger_listener.isTraceEnabled) {
		logger_listener.trace('enterCondition - ' + ctx.getText());
	}

	this._initializeConditionArray();
};

/** @inheritdoc */
ObjectFilterListener.prototype.exitCondition = function(ctx) {

	if(logger_listener.isTraceEnabled) {
		logger_listener.trace('exitCondition - ' + ctx.getText());
	}

	this._closeConditionArray('every');
};

/** @inheritdoc */
ObjectFilterListener.prototype.enterCondition_or = function(ctx) {

	if(logger_listener.isTraceEnabled) {
		logger_listener.trace('enterCondition_or - ' + ctx.getText());
	}

	this._initializeConditionArray();
};

/** @inheritdoc */
ObjectFilterListener.prototype.exitCondition_or = function(ctx) {

	if(logger_listener.isTraceEnabled) {
		logger_listener.trace('exitCondition_or - ' + ctx.getText());
	}

	this._closeConditionArray('some');
};

/** @inheritdoc */
ObjectFilterListener.prototype.enterPredicate = function(ctx) {

	if(logger_listener.isTraceEnabled) {
		logger_listener.trace('enterPredicate - ' + ctx.getText());
	}

	this.currentPredicate = {};
};

/** @inheritdoc */
ObjectFilterListener.prototype.exitPredicate = function(ctx) {
	
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
ObjectFilterListener.prototype.enterIdentifier = function(ctx) {
	this.currentPredicate.lhs = ctx.getText();
};

/** @inheritdoc */
ObjectFilterListener.prototype.enterComparison_operator = function(ctx) {
	this.currentPredicate.oper = ctx.getText();
};

/** @inheritdoc */
ObjectFilterListener.prototype.enterStringLiteral = function(ctx) {
	
	// remove single and double quotes that are on the ends of the string	
	var result = ctx.getText().substring(1);
	result = result.substring(0, result.length-1);

	this.currentPredicate.rhs = result;
};

/** @inheritdoc */
ObjectFilterListener.prototype.enterNumericLiteral = function(ctx) {
	this.currentPredicate.rhs = Number(ctx.getText());
};

/** @inheritdoc */
ObjectFilterListener.prototype.enterIdLiteral = function(ctx) {
	this.currentPredicate.rhs = ctx.getText();
};


/**
 * Given a {@link FilterRequest|request}, provide a way to apply the filter to an object.
 *
 * @constructor
 * @memberof restak.query.object-query
 * @param {restak.query.FilterRequest} request - The query request.
 */
var ObjectFilter = function(request){
	this.request = request;
	this.listener = new ObjectFilterListener();
	this.parser = new FilterParser(this.listener, this.request);
};

/**
 * Applies the filter specified in the {@link restak.query.FilterRequest|request} to the item.  If the filter is valid,
 * this function delegates to the {@link restak.query.object-query.ObjectFilterListener#filter}.
 *
 * @param {Object} item - the item to test the filter on.
 * @returns {boolean} true if the parser is valid and all filters are all satisifed, otherwise false.
 * @see restak.query.object-query.ObjectFilterListener#filter
 */
ObjectFilter.prototype.filter = function(item){
	
	if(!this.parser.isValid) {
		logger_filter.warn('Attempting to filter with an invalid filter: ' + this.request.filter);
		return false;
	}

	return this.listener.filter(item);
};

module.exports.ObjectFilterListener = ObjectFilterListener;
module.exports.ObjectFilter = ObjectFilter;