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
 * @param {restak.util.ObjectTransform} jobTransform - optional, a way to transform the job from what exists in the store to what should be returned.
 */
var UpdateJobScheduledTimestampCommand = function(jobStore, jobTransform){
	
	/**
	 * The datastore that contains jobs.
	 *
	 * @protected
	 * @type nedb.Datastore
	 */
	this.jobStore = jobStore;

	/**
	 * A transform that will modify what is returned from the datastore before beeing returned to the caller.
	 *
	 * @protected
	 * @type restak.util.ObjectTransform
	 */
	this.jobTransform = jobTransform;
};

/** @inheritdoc */
UpdateJobScheduledTimestampCommand.prototype.execute = function(cmdInstr, callback){

	var jobStore = this.jobStore,
		data = cmdInstr.data,
		jobId = data.jobId,
		timestamp = data.timestamp,
		jobTransform = this.jobTransform,
		query = { _id: jobId };

	jobStore.update(query, { $set: { nextExecution: timestamp } }, function (err, numReplaced) {
		if(err) {
			return callback(err, null);
		}

		if(numReplaced == 0) {
			return callback('A job with the id does not exist: ' + jobId, null);
		}

		logger.debug('Job [' + jobId + '] updated for next timestamp [' + timestamp + ']');

		jobStore.find(query, function(err, docs){

			var job = docs[0];

			if(jobTransform) {
				job = jobTransform.transform(job);
			}

			callback(null, job);
		});
	});
};

module.exports = UpdateJobScheduledTimestampCommand;