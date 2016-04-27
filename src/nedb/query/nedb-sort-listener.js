'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.nedb.query.nedb-sort-listener'),
	util = require('util'),
	SortListener = require('../../query/antlr').SortListener;

/**
 * Takes the output of sort parsing and creates a set of javascript functions that
 * execute the specified sort.
 *
 * @constructor
 * @memberof restak.nedb.query
 * @implements restak.query.antlr.SortListener
 */
var NeDBSortListener = function() {
	SortListener.apply(this, arguments);
};
util.inherits(NeDBSortListener, SortListener);

// Enter a parse tree produced by SortParser#parse.
NeDBSortListener.prototype.enterParse = function(ctx) {
	ctx.sortObject = {};
};

// Enter a parse tree produced by SortParser#partial.
NeDBSortListener.prototype.enterPartial = function(ctx) {
	//console.dir(ctx);
	//{ firstField: 1, secondField: -1 }
	ctx.__current = {
		property: null,
		direction: 'ASC'
	};
};

// Exit a parse tree produced by SortParser#partial.
NeDBSortListener.prototype.exitPartial = function(ctx) {

	var rootContext = ctx.parentCtx.parentCtx,
		definition = ctx.__current,
		sortValue = definition.direction == 'ASC' ? 1 : -1;

	rootContext.sortObject[definition.property] = sortValue;

	delete ctx.__current;
};

// Enter a parse tree produced by SortParser#identifier.
NeDBSortListener.prototype.enterIdentifier = function(ctx) {
	var current = ctx.parentCtx.__current;
	current.property = ctx.getText();
};

// Enter a parse tree produced by SortParser#direction.
NeDBSortListener.prototype.enterDirection = function(ctx) {
	var current = ctx.parentCtx.__current;
	current.direction = ctx.getText().toUpperCase();
};

module.exports = NeDBSortListener;