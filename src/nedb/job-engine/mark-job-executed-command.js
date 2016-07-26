'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.nedb.job-engine.MarkJobExecutedCommand'),
	async = require('async'),
	models = require('../../job-engine/models'),
	JobDescriptorStatus = models.JobDescriptorStatus,
	JobInstanceStatus = models.JobInstanceStatus;

/**
 * Mark a job and job instance as executed and persist to the file system.
 *
 * @constructor
 * @implements restak.job-engine.MarkJobExecutedCommand
 * @memberof restak.nedb.job-engine
 * @param {nedb.Datastore} jobStore - The NeDB datastore for jobs.
 * @param {nedb.Datastore} jobInstanceStore - The NeDB datastore for job instances.
 * @param {restak.util.ObjectTransform} jobTransform - optional, a way to transform the job from what exists in the store to what should be returned.
 * @param {restak.util.ObjectTransform} jobInstanceTransform - optional, a way to transform the instance from what exists in the store to what should be returned.
 */
var MarkJobExecutedCommand = function(jobStore, jobInstanceStore, jobTransform, jobInstanceTransform){
	
	/**
	 * The datastore that contains jobs.
	 *
	 * @protected
	 * @type nedb.Datastore
	 */
	this.jobStore = jobStore;

	/**
	 * The datastore that contains job instances.
	 *
	 * @protected
	 * @type nedb.Datastore
	 */
	this.jobInstanceStore = jobInstanceStore;

	/**
	 * A transform that will modify what is returned from the datastore before beeing returned to the caller.
	 *
	 * @protected
	 * @type restak.util.ObjectTransform
	 */
	this.jobTransform = jobTransform;

	/**
	 * A transform that will modify what is returned from the datastore before beeing returned to the caller.
	 *
	 * @protected
	 * @type restak.util.ObjectTransform
	 */
	this.jobInstanceTransform = jobInstanceTransform;
};

/** @inheritdoc */
MarkJobExecutedCommand.prototype.execute = function(cmdInstr, callback){

	var jobStore = this.jobStore,
		jobInstanceStore = this.jobInstanceStore,
		data = cmdInstr.data,
		job = data.job,
		jobInstance = data.instance,
		jobTransform = this.jobTransform,
		jobInstanceTransform = this.jobInstanceTransform;

	var jobQuery = { _id: job.id },
		jobUpdate = {
			$set: { 
				status: job.status
			}
		},
		instanceQuery = { _id: jobInstance.instanceId },
		instanceUpdate = {
			$set: {
				status: jobInstance.status,
				endTimestamp: jobInstance.endTimestamp,
				result: jobInstance.result
			}
		};

	jobStore.update(jobQuery, jobUpdate, function (err, numReplaced) {
		if(err) {
			return callback(err, null);
		}

		if(numReplaced == 0) {
			var msg = 'Job [' + job.id + '] does not exist';
			logger.warn(msg);
			return callback(msg, null);
		}

		jobInstanceStore.update(instanceQuery, instanceUpdate, function(err, numReplaced){
			if(err) {
				return callback(err, null);
			}

			if(numReplaced == 0) {
				logger.warn('Job instance [' + jobInstance.instanceId + '] does not exist for ' + job.name + ' [' + job.id + ']');
			} else {
				logger.debug('Job instance [' + jobInstance.instanceId + '] updated for ' + job.name + ' [' + job.id + ']');
			}

			var tasks = [];

			tasks.push(function(cb){
				jobStore.find(jobQuery, function(err, docs){
					cb(null, docs[0]);
				})
			});

			tasks.push(function(cb){
				jobInstanceStore.find(instanceQuery, function(err, docs){
					cb(null, docs[0]);
				})
			});

			async.parallel(tasks, function(err, result){
				callback(null, {
					job: result[0] || null,
					instance: result[1] || null
				});
			});
		});
	});
};

module.exports = MarkJobExecutedCommand;