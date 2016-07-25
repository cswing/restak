'use strict';

var ValidationError = require('../command').ValidationError;

/**
 * The install command wraps the create job command but ignores the 
 * duplicate job error.  Jobs are installed on server startup and this error
 * just means that the job was previously installed.
 */
var InstallJobCommand = function(createCommand){
	this.createCommand = createCommand;
};

InstallJobCommand.prototype.execute = function(cmdInstr, callback){
	this.createCommand.execute(cmdInstr, function(err, result){

		if (err instanceof ValidationError && err.type == 'non-unique' && err.field == 'commandKey') {
			return callback(null, null);
		}

		callback(err, result);
	});
};

module.exports = InstallJobCommand;