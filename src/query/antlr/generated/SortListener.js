// Generated from src/query/antlr/Sort.g4 by ANTLR 4.5.1
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete listener for a parse tree produced by SortParser.
function SortListener() {
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}

SortListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
SortListener.prototype.constructor = SortListener;

// Enter a parse tree produced by SortParser#parse.
SortListener.prototype.enterParse = function(ctx) {
};

// Exit a parse tree produced by SortParser#parse.
SortListener.prototype.exitParse = function(ctx) {
};


// Enter a parse tree produced by SortParser#condition.
SortListener.prototype.enterCondition = function(ctx) {
};

// Exit a parse tree produced by SortParser#condition.
SortListener.prototype.exitCondition = function(ctx) {
};


// Enter a parse tree produced by SortParser#partial.
SortListener.prototype.enterPartial = function(ctx) {
};

// Exit a parse tree produced by SortParser#partial.
SortListener.prototype.exitPartial = function(ctx) {
};


// Enter a parse tree produced by SortParser#identifier.
SortListener.prototype.enterIdentifier = function(ctx) {
};

// Exit a parse tree produced by SortParser#identifier.
SortListener.prototype.exitIdentifier = function(ctx) {
};


// Enter a parse tree produced by SortParser#direction.
SortListener.prototype.enterDirection = function(ctx) {
};

// Exit a parse tree produced by SortParser#direction.
SortListener.prototype.exitDirection = function(ctx) {
};



exports.SortListener = SortListener;