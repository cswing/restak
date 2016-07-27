'use strict';

var log4js = global.log4js || require('log4js'),
	async = require('async'),
	Datastore = require('nedb'),
	NeDBQuery = require('../query/nedb-query'),
	transforms = require('./transforms'),
	ObjectTransform = require('../../util/object-transform').DefaultObjectTransform,
	MarkJobExecutingCommand = require('./mark-job-executing-command'),
	MarkJobExecutedCommand = require('./mark-job-executed-command'),
	UpdateJobScheduledTimestampCommand = require('./update-job-scheduled-timestamp-command'),
	CreateJobCommand = require('./create-job-command'),
	QueueJobInvocationCommand = require('./queue-job-invocation-command');

/**
 * A simple store implementation for {@link restak.job-engine.Scheduler} using NeDB.
 * 
 * @namespace restak.nedb.job-engine
 */

/**
 * Register the necessary objects for the {@link restak.nedb.job-engine} namespace.  These objects provide a file system data store 
 * that can be used by the scheduler
 *
 * @function register
 * @memberof restak.nedb.job-engine
 * @see restak.app-server.register
 */
module.exports.register = function(appContext, callback) {

	var logger = log4js.getLogger('restak.nedb.job-engine.register'),
		jobTransform = transforms.jobTransform,
		instanceTransform = transforms.jobInstanceTransform;
	
	// Collections
	var jobsCollection = appContext.registerNeDb('restak.nedb.job-engine.JobDb', 'restak.data-dir.jobs'),
		instancesCollection = appContext.registerNeDb('restak.nedb.job-engine.JobInstanceDb', 'restak.data-dir.job-instances');

	// Jobs	
	appContext.registerObject('restak.nedb.job-engine.JobTransform', jobTransform);
	appContext.registerQuery('restak.job-engine.JobQuery', new NeDBQuery(jobsCollection, jobTransform));
	appContext.registerCommand('restak.job-engine.CreateJobCommand', new CreateJobCommand(jobsCollection, jobTransform));
	appContext.registerCommand('restak.job-engine.QueueJobInvocationCommand', new QueueJobInvocationCommand(jobsCollection, instancesCollection, instanceTransform));
	
	// Job Instances	
	appContext.registerObject('restak.nedb.job-engine.JobInstanceTransform', instanceTransform);
	appContext.registerQuery('restak.job-engine.JobInstanceQuery', new NeDBQuery(instancesCollection, instanceTransform));

	// Execution Engine
	appContext.registerCommand('restak.job-engine.MarkJobExecutingCommand', new MarkJobExecutingCommand(instancesCollection, instanceTransform));
	appContext.registerCommand('restak.job-engine.MarkJobExecutedCommand', new MarkJobExecutedCommand(instancesCollection, instanceTransform));

	// Scheduler Commands
	appContext.registerCommand('restak.job-engine.UpdateJobScheduledTimestampCommand', new UpdateJobScheduledTimestampCommand(jobsCollection, jobTransform));
	


	async
		.series([
			function(cb){
				jobsCollection.ensureIndex({
					fieldName: 'commandKey',
					unique: 'true'
				}, cb);
			}
		], callback);
};