'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.nedb.job-engine.MarkJobExecutingCommand'),
	moment = require('moment'),
	models = require('../../job-engine/models'),
	JobInstanceStatus = models.JobInstanceStatus;

/**
 * Mark a job instance as executing and persist using NeDB.
 *
 * @constructor
 * @implements restak.job-engine.MarkJobExecutingCommand
 * @memberof restak.nedb.job-engine
 * @param {nedb.Datastore} instanceCollection - The NeDB datastore for job instances.
 * @param {restak.util.ObjectTransform} instanceTransform - optional, a way to transform the instance from what exists in the store to what should be returned.
 */
var MarkJobExecutingCommand = function(instanceCollection, instanceTransform){
	
	/**
	 * The datastore that contains job instances.
	 *
	 * @protected
	 * @type nedb.Datastore
	 */
	this.instanceCollection = instanceCollection;

	/**
	 * A transform that will modify what is returned from the datastore before beeing returned to the caller.
	 *
	 * @protected
	 * @type restak.util.ObjectTransform
	 */
	this.instanceTransform = instanceTransform;
};

/** @inheritdoc */
MarkJobExecutingCommand.prototype.execute = function(cmdInstr, callback){

	var instanceCollection = this.instanceCollection,
		data = cmdInstr.data,
		instanceId = data.instanceId,
		instanceTransform = this.instanceTransform,
		queryObject = {
			_id: instanceId,
			status: JobInstanceStatus.Queued
		},
		now = moment(),
		updateObject = {
			$set: {
				status: JobInstanceStatus.Executing,
				executionStartTimestamp: now.toISOString(), 
				executionStartUts: now.unix()
			}
		};

	instanceCollection.update(queryObject, updateObject, { returnUpdatedDocs: true }, function (err, numReplaced, doc) {
		if(err) return callback(err, null);

		if(numReplaced == 0) {
			return callback('Unable to find an instance[' + instanceId + '] in a queued status.', null);
		}

		var instance = instanceTransform ? instanceTransform.transform(doc) : doc;

		callback(null, instance);
	});
};

module.exports = MarkJobExecutingCommand;