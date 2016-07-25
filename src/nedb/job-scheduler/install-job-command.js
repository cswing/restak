'use strict';

var ValidationError = require('../../command').ValidationError;

var InstallJobCommand = function(jobCollection, jobTransform){
	
	this.jobCollection = jobCollection;

	this.jobTransform = jobTransform;
};

InstallJobCommand.prototype.execute = function(cmdInstr, callback){

	var jobTransform = this.jobTransform,
		data = cmdInstr.data,
		job = {
			name: data.name,
			description: data.description,
			commandKey: data.commandKey
			//since: appDescriptor.version
		};

	this.jobCollection.insert(job, function(err, newDoc){

		if(err && err.errorType == 'uniqueViolated' && err.key == job['commandKey']){
			return callback(new ValidationError('non-unique', 'A job for the key ' + job.commandKey + ' already exists.', 'commandKey'), null);
		}
	
		if(err) return callback(err, null);

		callback(null, jobTransform.transform(newDoc));
	});
};

module.exports = InstallJobCommand;