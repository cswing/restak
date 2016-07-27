'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.nedb.job-engine.MarkJobExecutedCommand'),
	moment = require('moment'),
	models = require('../../job-engine/models'),
	InstanceStatus = models.JobInstanceStatus;

/**
 * Mark a job and job instance as executed and persist to the file system.
 *
 * @constructor
 * @implements restak.job-engine.MarkJobExecutedCommand
 * @memberof restak.nedb.job-engine
 * @param {nedb.Datastore} instanceStore - The NeDB datastore for job instances.
 * @param {restak.util.ObjectTransform} instanceTransform - optional, a way to transform the instance from what exists in the store to what should be returned.
 */
var MarkJobExecutedCommand = function(instanceStore, instanceTransform){
	
	/**
	 * The datastore that contains job instances.
	 *
	 * @protected
	 * @type nedb.Datastore
	 */
	this.instanceStore = instanceStore;

	/**
	 * A transform that will modify what is returned from the datastore before beeing returned to the caller.
	 *
	 * @protected
	 * @type restak.util.ObjectTransform
	 */
	this.instanceTransform = instanceTransform;
};

/** @inheritdoc */
MarkJobExecutedCommand.prototype.execute = function(cmdInstr, callback){

	var instanceStore = this.instanceStore,
		data = cmdInstr.data,
		instanceId = data.instanceId,
		job = data.job,
		instanceTransform = this.instanceTransform;

	var instanceQuery = { 
			_id: instanceId,
			status: InstanceStatus.Executing
		},
		now = moment(),
		instanceUpdate = {
			$set: {
				status: data.status,
				executionEndTimestamp: now.toISOString(), 
				executionEndUts: now.unix(), 
				result: data.result
			}
		};

	instanceStore.update(instanceQuery, instanceUpdate, { returnUpdatedDocs: true }, function(err, numReplaced, doc){
		if(err) return callback(err, null);

		if(numReplaced == 0) {
			return callback('Unable to find an instance[' + instanceId + '] in a executing status.', null);
		}

		var instance = instanceTransform ? instanceTransform.transform(doc) : doc;

		callback(null, instance);
	});
};

module.exports = MarkJobExecutedCommand;