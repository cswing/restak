'use strict';

var log4js = require('log4js'),
	logger = log4js.getLogger('restak.scheduler.fs-data.MarkJobExecutingCommand'),
	models = require('../models'),
	JobDescriptorStatus = models.JobDescriptorStatus,
	JobInstanceStatus = models.JobInstanceStatus;

/**
 * Mark a job and job instance as executing and persist to the file system.
 *
 * @constructor
 * @implements restak.commands.Command
 * @memberof restak.scheduler.fs-data
 * @param fs - the file system to use to access files
 * @param directoryPath - the directory path to access files
 */
var MarkJobExecutingCommand = function(fs, directoryPath){
	this.fs = fs;
	this.directoryPath = directoryPath;
};

/** @inheritdoc */
MarkJobExecutingCommand.prototype.execute = function(cmdInstr, callback){

	var fs = this.fs,
		data = cmdInstr.data,
		job = data.job,
		jobInstance = data.instance,
		directoryPath = this.directoryPath,
		filepath = directoryPath + job.id + '.json';

	fs.readFile(filepath, function(err, fileContent){

		if(err && err.code == 'ENOENT') {
			return callback('A job with the id does not exist: ' + job.id, null);
		}

		if(err) {
			return callback(err, null);
		}

		var jobToUpdate = JSON.parse(fileContent);
		job.status = jobToUpdate.status = JobDescriptorStatus.Executing;
		jobInstance.status = JobInstanceStatus.Executing;
		jobInstance.instanceId = job.id + '-' + new Date().getTime();

		if(!jobToUpdate.instances) {
			jobToUpdate.instances = [];
		}
		jobToUpdate.instances.push(jobInstance);

		fs.writeFile(filepath, JSON.stringify(jobToUpdate, null, 4), { flag: 'w' },
		function(err) {
			
				if(err) {
					callback(err, null);
					return;
				}
				
				logger.debug('Job instance [' + jobInstance.instanceId + '] created for ' + job.name + ' [' + job.id + ']');

				callback(null, { data: {
					job: job,
					instance: jobInstance
				} });		
			}
		);	
	});
};

module.exports = MarkJobExecutingCommand;