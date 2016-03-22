'use strict';

var log4js = require('log4js'),
	logger = log4js.getLogger('restak.scheduler.fs-data.UpdateJobScheduledTimestampCommand'),
	models = require('../models'),
	JobDescriptorStatus = models.JobDescriptorStatus,
	JobInstanceStatus = models.JobInstanceStatus;

/**
 * Update the next scheduled instance for the job to execute.
 *
 * @constructor
 * @implements restak.commands.Command
 * @memberof restak.scheduler.fs-data
 * @param fs - the file system to use to access files
 * @param directoryPath - the directory path to access files
 */
var UpdateJobScheduledTimestampCommand = function(fs, directoryPath){
	this.fs = fs;
	this.directoryPath = directoryPath;
};

/** @inheritdoc */
UpdateJobScheduledTimestampCommand.prototype.execute = function(cmdInstr, callback){

	var fs = this.fs,
		data = cmdInstr.data,
		jobId = data.jobId,
		timestamp = data.timestamp,
		directoryPath = this.directoryPath,
		filepath = directoryPath + jobId + '.json';

	fs.readFile(filepath, function(err, fileContent){

		if(err && err.code == 'ENOENT') {
			return callback('A job with the id does not exist: ' + jobId, null);
		}

		if(err) {
			return callback(err, null);
		}

		var jobToUpdate = JSON.parse(fileContent);
		jobToUpdate.nextExecution = timestamp;

		fs.writeFile(filepath, JSON.stringify(jobToUpdate, null, 4),
			function(err) {				
				if(err) {
					callback(err, null);
					return;
				}
				
				logger.debug('Job [' + jobId + '] updated for next timestamp [' + timestamp + ']');

				callback(null, jobToUpdate);
			}
		);	
	});
};

module.exports = UpdateJobScheduledTimestampCommand;