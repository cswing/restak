'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.command.CommandExecutor'),
	Joi = require('joi');

/** 
 * An executor that will execute commands for the caller.
 *
 * @constructor
 * @memberof restak.command
 * @param {restak.command.CommandFactory} commandFactory - The factory to use to access commands.
 */
var CommandExecutor = function(commandFactory){

	/** 
	 * The command factory used to access commands.
	 *
	 * @type restak.command.CommandFactory
	 */
	this.commandFactory = commandFactory;
};

/**
 * Callback definition for the execution of a command.
 *
 * @callback CommandExecutor~Callback
 * @memberof restak.command
 * @param {Object} error - An error if one occurred, otherwise null.
 * @param {restak.command.CommandResult} result - The result of command execution.
 * @see restak.command.CommandExecutor#executeCommand
 */

/** 
 * Execute a command.
 *
 * @param {string} commandKey - The key of the command to execute.
 * @param {object} data - The data to pass to the command.
 * @param {restak.command.CommandExecutor~Callback} The callback that handles the command result.
 */
CommandExecutor.prototype.executeCommand = function(commandKey, data, context, callback){
	
	var instr = {
		data: data
	};

	this._execute(commandKey, instr, context, callback);
};

CommandExecutor.prototype._execute = function(commandKey, commandInstructions, options, callback){

	var command,
		data = commandInstructions.data;

	try{
		command = this.commandFactory.getCommand(commandKey);	
	
	} catch(err) { 
		return callback(err, null);
	}

	if(command.validation && options.skipValidation !== true) {
		var joiOptions = {
			abortEarly: false
		};

		Joi.validate(data, command.validation, joiOptions, function (errors, value) {
			
			if (errors && errors.details.length > 0) {
				return callback(errors.details, null);
			}

			command.execute(commandInstructions, callback);
		});	
	
	} else {
		command.execute(commandInstructions, callback);
	}
};

module.exports = CommandExecutor;