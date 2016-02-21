'use strict';

var log4js = require('log4js'),
	logger = log4js.getLogger('XYZframework.query.antlr.query-error-listener'),
	util = require('util'),
	ErrorListener = require('antlr4').error.ErrorListener;

/**
 * An error listener that logs the errors to the error log and tracks whether or not there
 * have been any parsing errors.
 *
 * @constructor
 * @implments {antlr4.error.ErrorListener}
 */
var QueryErrorListener = function() {
	ErrorListener.call(this);
	
	/**
     * Whether or not the parsing is in an error state.
	 * 
     * @name QueryErrorListener#isValid
     * @type Boolean
     * @default true
  	*/
	this.isValid = true;

	/**
     * The error messages generated from parsing
	 * 
     * @name QueryErrorListener#messages
     * @type String[]
     * @default empty array
  	*/
	this.messages = [];
}
util.inherits(QueryErrorListener, ErrorListener);

/** @inheritdoc */
QueryErrorListener.prototype.syntaxError = function(recognizer, offendingSymbol, line, column, msg, e) {
	
	var err = "line " + line + ":" + column + " " + msg;
	
	logger.debug(err);
	this.messages.push(err);
	this.isValid = false;
};

module.exports = QueryErrorListener;