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
 * A simple store implementation for {@link restak.scheduler.Scheduler} using NeDB.
 * 
 * @namespace restak.nedb.scheduler
 */

/**
 * Register the necessary objects for the {@link restak.nedb.scheduler} namespace.  These objects provide a file system data store 
 * that can be used by the scheduler
 *
 * @function register
 * @memberof restak.nedb.scheduler
 * @see restak.app-server.register
 */
module.exports.register = function(appContext, callback) {

	var logger = log4js.getLogger('restak.nedb.scheduler.register'),
		jobTransform = transforms.jobTransform,
		instanceTransform = transforms.jobInstanceTransform;
	
	// Collections
	var jobsCollection = appContext.registerNeDb('restak.nedb.scheduler.JobDb', 'restak.data-dir.jobs'),
		instancesCollection = appContext.registerNeDb('restak.nedb.scheduler.JobInstanceDb', 'restak.data-dir.job-instances');

	// Jobs	
	appContext.registerObject('restak.nedb.scheduler.JobTransform', jobTransform);
	appContext.registerQuery('restak.scheduler.JobQuery', new NeDBQuery(jobsCollection, jobTransform));
	appContext.registerCommand('restak.scheduler.CreateJobCommand', new CreateJobCommand(jobsCollection, jobTransform));
	appContext.registerCommand('restak.scheduler.QueueJobInvocationCommand', new QueueJobInvocationCommand(jobsCollection, instancesCollection, instanceTransform));
	
	// Job Instances	
	appContext.registerObject('restak.nedb.scheduler.JobInstanceTransform', instanceTransform);
	appContext.registerQuery('restak.scheduler.JobInstanceQuery', new NeDBQuery(instancesCollection, instanceTransform));

	// Scheduler Commands
	appContext.registerCommand('restak.scheduler.UpdateJobScheduledTimestampCommand', new UpdateJobScheduledTimestampCommand(jobsCollection, jobTransform));
	appContext.registerCommand('restak.scheduler.MarkJobExecutingCommand', new MarkJobExecutingCommand(jobsCollection, instancesCollection, jobTransform, instanceTransform));
	appContext.registerCommand('restak.scheduler.MarkJobExecutedCommand', new MarkJobExecutedCommand(jobsCollection, instancesCollection, jobTransform, instanceTransform));


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