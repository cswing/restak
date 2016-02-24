'use strict';

/**
 * @namespace restak.rest.messages
 */

/**
 * A message to be returned to the caller.
 *
 * @class Message
 * @memberof restak.rest.messages
 * @property {restak.rest.messages.MessageType} type - The type of message.
 * @property {String} code - The code associated with the message.
 * @property {String} message - The actual message.
 */

/**
 * The types of messages.
 *
 * @enum {String} MessageType
 * @memberof restak.rest.messages
 * @readonly
 * @see restak.rest.messages.Message
 */
var MessageType = {
	/** An error message */
	error: 'error',

	/** A warning message */
	warn: 'warn',

	/** An informational message */
	info: 'info'
};

/**
 * Utility class to help build {@link restak.rest.messages.Message|messages}.
 *
 * @constructor
 * @memberof restak.rest.messages
 */
var MessageBuilder = function(){};

/**
 * Utility method to build an error message.
 *
 * @param {String} code - The code associated with the error.
 * @param {String} message - The error message.
 * @returns {restak.rest.messages.Message} the error message object.
 */
MessageBuilder.prototype.buildErrorMessage = function(code, message){
	return this.buildMessage(RestMessageType.error, code, message);
};

/**
 * Utility method to build a warning message.
 *
 * @param {String} code - The code associated with the warning.
 * @param {String} message - The warning message.
 * @returns {restak.rest.messages.Message} the warning message object.
 */
MessageBuilder.prototype.buildWarningMessage = function(code, message){
	return this.buildMessage(RestMessageType.warn, code, message);
};

/**
 * Utility method to build an informational message.
 *
 * @param {String} code - The code associated with the informational message.
 * @param {String} message - The informational message.
 * @returns {restak.rest.messages.Message} the informational message object.
 */
MessageBuilder.prototype.buildInfoMessage = function(code, message){
	return this.buildMessage(RestMessageType.info, code, message);
};

/**
 * Utility method to build a message.
 *
 * @param {restak.rest.messages.MessageType} type - The type of message.
 * @param {String} code - The code associated with the message.
 * @param {String} message - The string message.
 * @returns {restak.rest.messages.Message} the message object.
 */
MessageBuilder.prototype.buildMessage = function(type, code, message){
	return {
		type: type,
		code: code,
		message: message
	};
};

/**
 * Default {@link restak.rest.messages.MessageBuilder|MessageBuilder}.
 * @readonly
 */
MessageBuilder.DEFAULT = new MessageBuilder();

module.exports.MessageBuilder = MessageBuilder;
module.exports.MessageType = MessageType;