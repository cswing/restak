'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.query.antlr.sort-parser'),
	antlr4 = require('antlr4'),
	walker = antlr4.tree.ParseTreeWalker.DEFAULT,
	SortLexer = require('./generated/SortLexer').SortLexer,
	_SortParser = require('./generated/SortParser').SortParser,
	AntlrErrorListener = require('./antlr-error-listener');

/**
 * Parses the sort string on a query request.  This is a convience class to set up the antlr stuff.  Most of the 
 * heavy lifting is delegated to the {@link restak.query.antlr.SortListener|listener}.
 *
 * @constructor
 * @memberof restak.query.antlr
 * @param {restak.query.antlr.SortListener} listener - a listener that responds to the parsing of the sort string.  The listener will be specific to the underlying technology.
 * @param {restak.query.SortRequest} request - the query request
 */
var SortParser = function(listener, request){
	
	this.listener = listener;
	this.request = request || {};
	this.errorListener = new AntlrErrorListener();
	this.sort = (this.request.sort || '').trim();

	if(this.sort.length > 0){ // build sort function if sort is provided

		var chars = new antlr4.InputStream(this.request.sort);
		
		var lexer = new SortLexer(chars);
		lexer.removeErrorListeners();
		lexer.addErrorListener(this.errorListener);
		
		var tokens  = new antlr4.CommonTokenStream(lexer);
		
		var parser = new _SortParser(tokens);
		parser.removeErrorListeners();
		parser.addErrorListener(this.errorListener);
		
		this.tree = parser.parse();
		walker.walk(this.listener, this.tree);
	}
};

/**
 * Whether or not the {@link restak.query.SortRequest} is valid.
 * 
 * @returns {boolean} true if valid, otherwise false.
 */
SortParser.prototype.isValid = function(){
	return this.errorListener.isValid;
};

/**
 * The error messages, if parsing finds errors.
 *
 * @returns {String[]} the error messages if not valid, otherwise an empty array.
 */
SortParser.prototype.getErrorMessages = function(){
	return this.errorListener.messages; 
};

module.exports = SortParser;