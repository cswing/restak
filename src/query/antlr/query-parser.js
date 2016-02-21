'use strict';

var log4js = require('log4js'),
	logger = log4js.getLogger('XYZframework.query.antlr.query-parser'),
	antlr4 = require('antlr4'),
	QueryLexer = require('./generated/QueryLexer').QueryLexer,
	_QueryParser = require('./generated/QueryParser').QueryParser,
	QueryErrorListener = require('./query-error-listener');

/**
 * Parses the filter string on a query request.  This is a convience class to set up the antlr stuff.  Most of the 
 * heavy lifting is delegated to the {@link QueryVisitor|visitor}.
 *
 * @constructor
 * @param {QueryVisitor} visitor - a visitor that responds to the parsing of the filter string.  The visitor will be specific to the underlying technology.
 * @param {QueryRequest} request - the query request
 */
var QueryParser = function(visitor, request){
	
	this.visitor = visitor;
	this.request = request || {};
	this.errorListener = new QueryErrorListener();

	if((this.request.filter || '').trim().length > 0){ // build filter function if filter is provided

		var chars = new antlr4.InputStream(this.request.filter);
		
		var lexer = new QueryLexer(chars);
		lexer.removeErrorListeners();
		lexer.addErrorListener(this.errorListener);
		
		var tokens  = new antlr4.CommonTokenStream(lexer);
		
		var parser = new _QueryParser(tokens);
		parser.removeErrorListeners();
		parser.addErrorListener(this.errorListener);
		parser.buildParseTrees = true;

		var tree = parser.parse();
		this.visitor.visitParse(tree);
	}
};

/**
 * Whether or not the {@link QueryRequest} is valid.
 * 
 * @returns {boolean} true if valid, otherwise false.
 */
QueryParser.prototype.isValid = function(){
	return this.errorListener.isValid;
};

/**
 * The error messages, if parsing finds errors.
 *
 * @returns {String[]} the error messages if not valid, otherwise an empty array.
 */
QueryParser.prototype.getErrorMessages = function(){
	return this.errorListener.messages; 
};

module.exports = QueryParser;