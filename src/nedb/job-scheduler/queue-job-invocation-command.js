'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.nedb.scheduler.QueueJobInvocationCommand'),
	moment = require('moment'),
	Joi = require('joi'),
	ValidationError = require('../../command').ValidationError,
	models = require('../../job-scheduler/models'),
	JobInstanceStatus = models.JobInstanceStatus,
	isoTimestampFormat = require('../../util').commonFormats.isoTimestamp;

/**
 * The data expected as part of the {@link restak.command.CommandInstructions} passed to the execute method.
 *
 * @typedef QueueJobInvocationData
 * @memberof restak.nedb.scheduler
 * @type {Object}
 * @param {String} jobId - The id of the job to queue.
 *
 * @see restak.command.CommandInstructions#data
 * @see restak.nedb.scheduler.QueueJobInvocationCommand#execute
 */
var validation = {
	jobId: Joi.string().required(),
	params: Joi.object().optional()
};

/**
 * Queues a job to be invoked.
 *
 * @constructor
 * @memberof restak.nedb.scheduler
 * @param {nedb.Datastore} jobCollection - The NeDB datastore for jobs.
 * @param {nedb.Datastore} instanceCollection - The NeDB datastore for instances of jobs.
 * @param {restak.util.ObjectTransform} instanceTransform - optional, a way to transform the instance from what exists in the store to what should be returned.
 */
var QueueJobInvocationCommand = function(jobCollection, instanceCollection, instanceTransform){

	/**
	 * The datastore that contains jobs.
	 *
	 * @protected
	 * @type nedb.Datastore
	 */
	this.jobCollection = jobCollection;

	/**
	 * The datastore that contains instances of jobs.
	 *
	 * @protected
	 * @type nedb.Datastore
	 */
	this.instanceCollection = instanceCollection;

	/**
	 * A transform that will modify instances from the datastore before being returned to the caller.
	 *
	 * @protected
	 * @type restak.util.ObjectTransform
	 */
	this.instanceTransform = instanceTransform;

	/** @inheritdoc */
	this.validation = validation;
};

/**
 * Validation logic for the command and {@link restak.nedb.scheduler.QueueJobInvocationData}
 */
QueueJobInvocationCommand.validation = validation;

/** @inheritdoc */
QueueJobInvocationCommand.prototype.execute = function(cmdInstr, callback){

	var jobCollection = this.jobCollection,
		instanceCollection = this.instanceCollection,
		instanceTransform = this.instanceTransform,
		jobId = cmdInstr.data.jobId,
		params = cmdInstr.data.params;

	jobCollection.findOne({_id: jobId}, function(err, job){
		if(err) return callback(err, null);

		if(!job){
			return callback(new ValidationError('entity.unknown', 'A job with this id does not exist.', 'jobId'), null);
		}

		var now = moment(),
			instance = {
				jobId: jobId, 
				name: job.name, 
				description: job.description, 
				commandKey: job.commandKey, 
				queuedTimestamp: now.format(isoTimestampFormat), 
				queuedUts: now.unix(), 
				executionStartTimestamp: null, 
				executionStartUts: null, 
				executionEndTimestamp: null, 
				executionEndUts: null, 
				status: JobInstanceStatus.Queued, 
				params: params
				// TODO: 	software version that executed the command
				// 			node that executed the command
			};

		instanceCollection.insert(instance, function(err, result){
			
			if(err && err == 'RangeError: Maximum call stack size exceeded') {
				return callback(new ValidationError('circular.reference', 'The params for this command contain a circular reference.', 'params'), null);
			}

			if(!err && logger.isDebugEnabled()){
				logger.debug(job.name + ' [' + job.commandKey + '] has been queued [id: ' + result._id + '] with arguments: ' + JSON.stringify(params));
			}
			
			callback(err, instanceTransform.transform(result));
		});
	});
};

module.exports = QueueJobInvocationCommand;