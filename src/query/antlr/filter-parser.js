'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.query.antlr.query-parser'),
	antlr4 = require('antlr4'),
	walker = antlr4.tree.ParseTreeWalker.DEFAULT,
	FilterLexer = require('./generated/FilterLexer').FilterLexer,
	_FilterParser = require('./generated/FilterParser').FilterParser,
	AntlrErrorListener = require('./antlr-error-listener');

/**
 * Parses the filter string on a query request.  This is a convience class to set up the antlr stuff.  Most of the 
 * heavy lifting is delegated to the {@link restak.query.antlr.FilterListener|listener}.
 *
 * @constructor
 * @memberof restak.query.antlr
 * @param {restak.query.antlr.FilterListener} listener - a listener that responds to the parsing of the filter string.  The listener will be specific to the underlying technology.
 * @param {restak.query.FilterRequest} request - the query request
 */
var FilterParser = function(listener, request){
	
	this.listener = listener;
	this.request = request || {};
	this.errorListener = new AntlrErrorListener();
	this.filter = (this.request.filter || '').trim();

	if(this.filter.length > 0){ // build filter function if filter is provided

		var chars = new antlr4.InputStream(this.request.filter);
		
		var lexer = new FilterLexer(chars);
		lexer.removeErrorListeners();
		lexer.addErrorListener(this.errorListener);
		
		var tokens  = new antlr4.CommonTokenStream(lexer);
		
		var parser = new _FilterParser(tokens);
		parser.removeErrorListeners();
		parser.addErrorListener(this.errorListener);
		
		this.tree = parser.parse();
		walker.walk(this.listener, this.tree);
	}
};

/**
 * Whether or not the {@link restak.query.FilterRequest} is valid.
 * 
 * @returns {boolean} true if valid, otherwise false.
 */
FilterParser.prototype.isValid = function(){
	return this.errorListener.isValid;
};

/**
 * The error messages, if parsing finds errors.
 *
 * @returns {String[]} the error messages if not valid, otherwise an empty array.
 */
FilterParser.prototype.getErrorMessages = function(){
	return this.errorListener.messages; 
};

module.exports = FilterParser;