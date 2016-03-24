'use strict';

var log4js = require('log4js'),
	logger = log4js.getLogger('restak.scheduler.nedb.UpdateJobScheduledTimestampCommand');

/**
 * Update the next scheduled instance for the job to execute.
 *
 * @constructor
 * @implements restak.commands.Command
 * @memberof restak.scheduler.nedb
 * @param {nedb.Datastore} jobStore - The NeDB datastore for jobs.
 */
var UpdateJobScheduledTimestampCommand = function(jobStore){
	
	/**
	 * The datastore that contains jobs.
	 *
	 * @protected
	 * @type nedb.Datastore
	 */
	this.jobStore = jobStore;
};

/** @inheritdoc */
UpdateJobScheduledTimestampCommand.prototype.execute = function(cmdInstr, callback){

	var jobStore = this.jobStore,
		data = cmdInstr.data,
		jobId = data.jobId,
		timestamp = data.timestamp;

	jobStore.update({ id: jobId }, { $set: { nextExecution: timestamp } }, function (err, numReplaced) {
		if(err) {
			return callback(err, null);
		}

		if(numReplaced == 0) {
			return callback('A job with the id does not exist: ' + jobId, null);
		}

		logger.debug('Job [' + jobId + '] updated for next timestamp [' + timestamp + ']');

		jobStore.find({ id: jobId }, function(err, docs){
			callback(null, docs[0]);
		});
	});
};

module.exports = UpdateJobScheduledTimestampCommand;