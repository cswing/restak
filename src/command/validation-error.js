'use strict';

/**
 * A validation error that can be passed back when executing a command.  This can be used for complex validation.
 * For example, if saving an object requires that a property value that references another entity must exist in the system.
 *
 * @constructor
 * @memberof restak.command
 */
var ValidationError = function(type, message, field){
	
	/**
	 * Programatic way to identify error
	 */
	this.type = type;

	/**
	 * The validation message.
	 */
	this.message = message;

	/**
	 * The field that the message relates to.
	 */
	this.field = field;
};

module.exports = ValidationError;