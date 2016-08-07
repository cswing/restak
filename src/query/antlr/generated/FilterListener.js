// Generated from src/query/antlr/Filter.g4 by ANTLR 4.5.1
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete listener for a parse tree produced by FilterParser.
function FilterListener() {
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}

FilterListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
FilterListener.prototype.constructor = FilterListener;

// Enter a parse tree produced by FilterParser#parse.
FilterListener.prototype.enterParse = function(ctx) {
};

// Exit a parse tree produced by FilterParser#parse.
FilterListener.prototype.exitParse = function(ctx) {
};


// Enter a parse tree produced by FilterParser#condition.
FilterListener.prototype.enterCondition = function(ctx) {
};

// Exit a parse tree produced by FilterParser#condition.
FilterListener.prototype.exitCondition = function(ctx) {
};


// Enter a parse tree produced by FilterParser#condition_or.
FilterListener.prototype.enterCondition_or = function(ctx) {
};

// Exit a parse tree produced by FilterParser#condition_or.
FilterListener.prototype.exitCondition_or = function(ctx) {
};


// Enter a parse tree produced by FilterParser#predicate.
FilterListener.prototype.enterPredicate = function(ctx) {
};

// Exit a parse tree produced by FilterParser#predicate.
FilterListener.prototype.exitPredicate = function(ctx) {
};


// Enter a parse tree produced by FilterParser#identifier.
FilterListener.prototype.enterIdentifier = function(ctx) {
};

// Exit a parse tree produced by FilterParser#identifier.
FilterListener.prototype.exitIdentifier = function(ctx) {
};


// Enter a parse tree produced by FilterParser#literal.
FilterListener.prototype.enterLiteral = function(ctx) {
};

// Exit a parse tree produced by FilterParser#literal.
FilterListener.prototype.exitLiteral = function(ctx) {
};


// Enter a parse tree produced by FilterParser#idLiteral.
FilterListener.prototype.enterIdLiteral = function(ctx) {
};

// Exit a parse tree produced by FilterParser#idLiteral.
FilterListener.prototype.exitIdLiteral = function(ctx) {
};


// Enter a parse tree produced by FilterParser#stringLiteral.
FilterListener.prototype.enterStringLiteral = function(ctx) {
};

// Exit a parse tree produced by FilterParser#stringLiteral.
FilterListener.prototype.exitStringLiteral = function(ctx) {
};


// Enter a parse tree produced by FilterParser#numericLiteral.
FilterListener.prototype.enterNumericLiteral = function(ctx) {
};

// Exit a parse tree produced by FilterParser#numericLiteral.
FilterListener.prototype.exitNumericLiteral = function(ctx) {
};


// Enter a parse tree produced by FilterParser#sign.
FilterListener.prototype.enterSign = function(ctx) {
};

// Exit a parse tree produced by FilterParser#sign.
FilterListener.prototype.exitSign = function(ctx) {
};


// Enter a parse tree produced by FilterParser#comparison_operator.
FilterListener.prototype.enterComparison_operator = function(ctx) {
};

// Exit a parse tree produced by FilterParser#comparison_operator.
FilterListener.prototype.exitComparison_operator = function(ctx) {
};



exports.FilterListener = FilterListener;