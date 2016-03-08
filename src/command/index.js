
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
 * An object that describes the validation for the {@link restak.command.CommandInstructions#data} for the command.
 *
 * @property
 * @name restak.command.Command#validation
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
 * @param {restak.command.CommandResult} result - The result of command execution.
 * @see restak.command.Command#execute
 */