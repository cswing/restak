'use strict';

var log4js = require('log4js'),
	logger = log4js.getLogger('restak.nedb.query.query-listener'),
	util = require('util'),
	QueryListener = require('../../query/antlr').QueryListener;

/**
 * Takes the output of filter parsing and creates a set of javascript object for an NeDB find call.
 *
 * @constructor
 * @memberof restak.nedb.query
 * @implements restak.query.antlr.QueryListener
 */
var NeDBQueryListener = function(){
	QueryListener.apply(this, arguments);
};
util.inherits(NeDBQueryListener, QueryListener);


/** @inheritdoc */
NeDBQueryListener.prototype.enterParse = function(ctx) {

	if(logger.isTraceEnabled) {
		logger.trace('enterParse - ' + ctx.getText());
	}

	ctx.__predicates = [];
};

/** @inheritdoc */
NeDBQueryListener.prototype.exitParse = function(ctx) {

	if(logger.isTraceEnabled) {
		logger.trace('exitParse - ' + ctx.getText());
	}

	var predicates = ctx.__predicates;

	if(!predicates || predicates.length == 0)
		return;

	if(predicates.length > 1)
		throw new Error('Unable to handle multiple predicates at this level.');

	ctx.filterObject = predicates[0];

	delete ctx.__predicates;
};

/** @inheritdoc */
NeDBQueryListener.prototype.enterCondition = function(ctx) {

	if(logger.isTraceEnabled) {
		logger.trace('enterCondition - ' + ctx.getText());
	}

	ctx.__predicates = [];
};

/** @inheritdoc */
NeDBQueryListener.prototype.exitCondition = function(ctx) {

	if(logger.isTraceEnabled) {
		logger.trace('exitCondition - ' + ctx.getText());
	}

	var predicates = ctx.__predicates;

	if(!predicates || predicates.length == 0)
		return;
	
	var parentCtx = ctx.parentCtx;
	while(parentCtx && !parentCtx.__predicates) {
		parentCtx = parentCtx.parentCtx;
	}

	if(predicates.length == 1) {
		parentCtx.__predicates.push(predicates[0]);
	} else {
		parentCtx.__predicates.push({ $and: predicates });
	}

	delete ctx.__predicates;
};

/** @inheritdoc */
NeDBQueryListener.prototype.enterCondition_or = function(ctx) {

	if(logger.isTraceEnabled) {
		logger.trace('enterCondition_or - ' + ctx.getText());
	}

	ctx.__predicates = [];
};

/** @inheritdoc */
NeDBQueryListener.prototype.exitCondition_or = function(ctx) {

	if(logger.isTraceEnabled) {
		logger.trace('exitCondition_or - ' + ctx.getText());
	}

	var predicates = ctx.__predicates;

	if(!predicates || predicates.length == 0)
		return;
	
	if(predicates.length == 1) {
		ctx.parentCtx.__predicates.push(predicates[0]);
	} else {
		ctx.parentCtx.__predicates.push({ $or: predicates });
	}

	delete ctx.__predicates;
};

/** @inheritdoc */
NeDBQueryListener.prototype.enterPredicate = function(ctx) {

	if(logger.isTraceEnabled) {
		logger.trace('enterPredicate - ' + ctx.getText());
	}

	ctx.__currentPredicate = {};
};

/** @inheritdoc */
NeDBQueryListener.prototype.exitPredicate = function(ctx) {
	
	if(logger.isTraceEnabled) {
		logger.trace('exitPredicate - ' + ctx.getText());
	}

	var predicate = ctx.__currentPredicate;

	if(!predicate)
		return;

	delete predicate.__prop;
	delete predicate.__setter;

	if(Object.keys(predicate).length > 0) {
		ctx.parentCtx.__predicates.push(predicate);	
	}

	delete ctx.__currentPredicate;
};

/** @inheritdoc */
NeDBQueryListener.prototype.enterIdentifier = function(ctx) {
	var predicateCtx = ctx.parentCtx,
		property = ctx.getText();

	predicateCtx.__currentPredicate.__prop = property;
	predicateCtx.__currentPredicate[property] = null;
};

/** @inheritdoc */
NeDBQueryListener.prototype.enterComparison_operator = function(ctx) {
	
	var predicateCtx = ctx.parentCtx,
		predicate = predicateCtx.__currentPredicate,
		property = predicate.__prop,
		operator = ctx.getText();

	if(operator == '=') {
		predicateCtx.__currentPredicate.__setter = function(val) {
			predicate[property] = val;
		};
		return;
	}

	if(operator == '<') {
		predicateCtx.__currentPredicate.__setter = function(val) {
			predicate[property] = { $lt: val };
		};
		return;
	}

	if(operator == '<=') {
		predicateCtx.__currentPredicate.__setter = function(val) {
			predicate[property] = { $lte: val };
		};
		return;
	}

	if(operator == '>') {
		predicateCtx.__currentPredicate.__setter = function(val) {
			predicate[property] = { $gt: val };
		};
		return;
	}

	if(operator == '>=') {
		predicateCtx.__currentPredicate.__setter = function(val) {
			predicate[property] = { $gte: val };
		};
		return;
	}

	if(operator == '<>' || operator == '!=' ) {
		predicateCtx.__currentPredicate.__setter = function(val) {
			predicate[property] = { $ne: val };
		};
		return;
	}

	if(operator == '~') {
		predicateCtx.__currentPredicate.__setter = function(val) {
			var re = new RegExp(val);
			predicate[property] = re;
		};
		return;
	}
		
};

var setValue = function(literalCtx, val){

	var predicateCtx = literalCtx.parentCtx.parentCtx,
		predicate = predicateCtx.__currentPredicate,
		setter = predicate.__setter;

	if(setter) setter(val);  // setter can be null with invalid queries
};

/** @inheritdoc */
NeDBQueryListener.prototype.enterStringLiteral = function(ctx) {
	
	// remove single and double quotes that are on the ends of the string	
	var result = ctx.getText().substring(1);
	result = result.substring(0, result.length-1);

	setValue(ctx, result);
};

/** @inheritdoc */
NeDBQueryListener.prototype.enterNumericLiteral = function(ctx) {
	setValue(ctx, Number(ctx.getText()));
};

/** @inheritdoc */
NeDBQueryListener.prototype.enterIdLiteral = function(ctx) {
	setValue(ctx, ctx.getText());
};

module.exports = NeDBQueryListener;