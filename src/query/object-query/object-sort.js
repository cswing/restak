'use strict';

var log4js = global.log4js || require('log4js'),
	logger_sort = log4js.getLogger('restak.query.object-query.object-sort'),
	logger_listener = log4js.getLogger('restak.query.object-query.object-sort-listener'),
	util = require('util'),
	SortParser = require('../antlr').SortParser,
	SortListener = require('../antlr').SortListener;

/**
 * Takes the output of sort parsing and creates a set of javascript functions that
 * execute the specified sort.
 *
 * @constructor
 * @memberof restak.query.object-query
 * @implements restak.query.antlr.SortListener
 */
var ObjectSortListener = function() {
	SortListener.apply(this, arguments);
};
util.inherits(ObjectSortListener, SortListener);

// Enter a parse tree produced by SortParser#parse.
ObjectSortListener.prototype.enterParse = function(ctx) {
	ctx.comparators = [];
};

// Enter a parse tree produced by SortParser#partial.
ObjectSortListener.prototype.enterPartial = function(ctx) {
	//console.dir(ctx);

	ctx.__current = {
		property: null,
		direction: 'ASC'
	};
};

// Exit a parse tree produced by SortParser#partial.
ObjectSortListener.prototype.exitPartial = function(ctx) {

	var rootContext = ctx.parentCtx.parentCtx,
		definition = ctx.__current;

	rootContext.comparators.push(function(a,b){

		var aPropValue = a[definition.property] || '',
			bPropValue = b[definition.property] || '';

		if(definition.direction == 'ASC') {
			if(aPropValue.localeCompare) {
				return aPropValue.localeCompare(bPropValue);
			} else {
				return aPropValue - bPropValue;
			}
		} else {
			if(bPropValue.localeCompare) {
				return bPropValue.localeCompare(aPropValue);
			} else {
				return bPropValue - aPropValue;
			}
		}
	});

	delete ctx.__current;
};

// Enter a parse tree produced by SortParser#identifier.
ObjectSortListener.prototype.enterIdentifier = function(ctx) {
	var current = ctx.parentCtx.__current;
	current.property = ctx.getText();
};

// Enter a parse tree produced by SortParser#direction.
ObjectSortListener.prototype.enterDirection = function(ctx) {
	var current = ctx.parentCtx.__current;
	current.direction = ctx.getText().toUpperCase();
};


/**
 * Given a {@link SortRequest|request}, provide a way to apply the sort to an object.
 *
 * @constructor
 * @memberof restak.query.object-query
 * @param {restak.query.SortRequest} request - The query request.
 */
var ObjectSort = function(){
	this.listener = new ObjectSortListener();
};

/**
 * Applies the sort specified in the {@link restak.query.QueryRequest|request} to the item.  If the sort is valid,
 * this function delegates to the {@link restak.query.object-query.ObjectSortListener#sort}.
 *
 * @param {Object[]} items - the items to sort.
 * @returns {Object[]} the item sorted array.
 * @see restak.query.object-query.ObjectSortListener#sort
 */
ObjectSort.prototype.sort = function(request, items){
	
	var parser = new SortParser(this.listener, request),
		clone = items.slice(0);

	if(!parser.isValid) {
		logger_sort.warn('Attempting to sort with an invalid sort definition: ' + this.request.sort);
		return clone;
	}

	var comparators = [];
	
	if(parser.tree && parser.tree.comparators) {
		comparators = parser.tree.comparators;
	}

	clone.sort(function(a,b){
		var val = 0;
		comparators.find(function(fn){
			val = fn(a,b);
			return val != 0;
		});
		return val;
	});

	return clone;
};

module.exports.ObjectSortListener = ObjectSortListener;
module.exports.ObjectSort = ObjectSort;