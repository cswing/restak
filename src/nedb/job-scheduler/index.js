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
	CreateJobCommand = require('./create-job-command');

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
		jobInstanceTransform = transforms.jobInstanceTransform;
	
	// Jobs
	var jobsCollection = appContext.registerNeDb('restak.nedb.scheduler.JobDb', 'restak.data-dir.jobs');
	appContext.registerObject('restak.nedb.scheduler.JobTransform', jobTransform);
	appContext.registerQuery('restak.scheduler.JobQuery', new NeDBQuery(jobsCollection, jobTransform));
	appContext.registerCommand('restak.scheduler.CreateJobCommand', new CreateJobCommand(jobsCollection, jobTransform));
	
	// Job Instances
	var instanceDb = appContext.registerNeDb('restak.nedb.scheduler.JobInstanceDb', 'restak.data-dir.job-instances');
	appContext.registerObject('restak.nedb.scheduler.JobInstanceTransform', jobInstanceTransform);
	appContext.registerQuery('restak.scheduler.JobInstanceQuery', new NeDBQuery(instanceDb, jobInstanceTransform));

	// Scheduler Commands
	appContext.registerCommand('restak.scheduler.UpdateJobScheduledTimestampCommand', new UpdateJobScheduledTimestampCommand(jobsCollection, jobTransform));
	appContext.registerCommand('restak.scheduler.MarkJobExecutingCommand', new MarkJobExecutingCommand(jobsCollection, instanceDb, jobTransform, jobInstanceTransform));
	appContext.registerCommand('restak.scheduler.MarkJobExecutedCommand', new MarkJobExecutedCommand(jobsCollection, instanceDb, jobTransform, jobInstanceTransform));


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