'use strict';

var log4js = require('log4js'),
	logger = log4js.getLogger('restak.nedb.scheduler.MarkJobExecutingCommand'),
	async = require('async'),
	models = require('../../scheduler/models'),
	JobDescriptorStatus = models.JobDescriptorStatus,
	JobInstanceStatus = models.JobInstanceStatus;

/**
 * Mark a job and job instance as executing and persist to the file system.
 *
 * @constructor
 * @implements restak.commands.Command
 * @memberof restak.nedb.scheduler
 * @param {nedb.Datastore} jobStore - The NeDB datastore for jobs.
 * @param {nedb.Datastore} jobInstanceStore - The NeDB datastore for job instances.
 * @param {restak.util.ObjectTransform} jobTransform - optional, a way to transform the job from what exists in the store to what should be returned.
 * @param {restak.util.ObjectTransform} jobInstanceTransform - optional, a way to transform the instance from what exists in the store to what should be returned.
 */
var MarkJobExecutingCommand = function(jobStore, jobInstanceStore, jobTransform, jobInstanceTransform){
	
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
MarkJobExecutingCommand.prototype.execute = function(cmdInstr, callback){

	var jobStore = this.jobStore,
		jobInstanceStore = this.jobInstanceStore,
		data = cmdInstr.data,
		job = data.job,
		jobInstance = data.instance,
		jobTransform = this.jobTransform,
		jobInstanceTransform = this.jobInstanceTransform;

	var query = { _id: job.id },
		update = {
			$set: { 
				status: JobDescriptorStatus.Executing
			}
		};

	jobStore.update(query, update, function (err, numReplaced) {
		if(err) {
			return callback(err, null);
		}

		if(numReplaced == 0) {
			var msg = 'Job [' + job.id + '] does not exist';
			logger.warn(msg);
			return callback(msg, null);
		}

		jobInstance.status = JobInstanceStatus.Executing;
		jobInstanceStore.insert(jobInstance, function (err, instance) {
			
			if(err) {
				return callback(err, null);
			}

			if(jobInstanceTransform) {
				instance = jobInstanceTransform.transform(instance);
			}

			jobStore.find(query, function(err, docs){
			
				var job = docs[0];

				if(jobTransform) {
					job = jobTransform.transform(job);
				}

				logger.debug('Job instance [' + instance.instanceId + '] created for ' + job.name + ' [' + job.id + ']');

				callback(null, {
					job: job,
					instance: instance
				});
			});
		});

	});
};

module.exports = MarkJobExecutingCommand;