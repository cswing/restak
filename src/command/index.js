
/**
 * @namespace restak.command
 */

/**
 * @interface Command
 * @memberof restak.command
 */

/**
 * Execute a command with a {@link CommandInstructions|command instructions} object.
 *
 * @function
 * @name restak.command.Command#execute
 * @param {restak.command.CommandInstructions} instructions - The instructions for command execution.
 * @param {restak.command.Command~CommandCallback} callback - The callback that handles the command result.
 */

/**
 * An object that describes the validation for the command.
 *
 * @member
 * @name restak.command.Command#validation
 * @see restak.command.CommandInstructions
 */

/**
 * Instructions for executing a command.
 *
 * @typedef CommandInstructions
 * @memberof restak.command
 * @type {object}
 * @property {Object} data - The data for the command.
 * @see restak.command.Command
 */

/**
 * The result of executing a command.
 * 
 * @typedef CommandResult
 * @memberof restak.command
 * @property {Object} data - The data returned from the command.
 * @see restak.command.Command
 */

/**
 * Callback definition for the execution of a command.
 *
 * @callback Command~CommandCallback
 * @memberof restak.command
 * @param {Object} error - An error if one occurred, otherwise null.
 * @param {Object} data - The result of command.
 * @see restak.command.Command#execute
 */

/**
 * A factory that contians commands that can be accessed later to use.
 *
 * @interface CommandFactory
 * @memberof restak.command
 */

/**
 * Register a command for use later.
 *
 * @function
 * @name restak.command.CommandFactory#registerCommand
 * @param {string} commandKey - The key that identifies the command.
 * @param {restak.command.Command} command - The command.
 * @return {boolean} true if the command was registered, otherwise false.
 */

/**
 * Get a command to use.
 *
 * @function
 * @name restak.command.CommandFactory#getCommand
 * @param {string} commandKey - The key that identifies the command.
 * @return {restak.command.Command} the command.
 * @throws {restak.command.CommandNotFoundError}
 */

 /**
 * Has a command with the given key been registered.
 *
 * @function
 * @name restak.command.CommandFactory#hasCommand
 * @param {string} commandKey - The key that identifies the command.
 * @return {boolean} true if there is a command, otherwise false;
 */

/**
 * An error describing the use of a command that has not been registered.
 *
 * @constructor
 * @memberof restak.command
 */
 var CommandNotFoundError = function(commandKey){
 	this.commandKey = commandKey;
 	this.message = 'Unknown command: ' + commandKey;
 };
 module.exports.CommandNotFoundError = CommandNotFoundError;

 module.exports.CommandExecutor = require('./command-executor');