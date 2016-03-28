'use strict';

var log4js = global.log4js || require('log4js'),
	Datastore = require('nedb'),
	NeDBQuery = require('../query/nedb-query'),
	transforms = require('./transforms'),
	ObjectTransform = require('../../util/object-transform').DefaultObjectTransform,
	MarkJobExecutingCommand = require('./mark-job-executing-command'),
	MarkJobExecutedCommand = require('./mark-job-executed-command'),
	UpdateJobScheduledTimestampCommand = require('./update-job-scheduled-timestamp-command');

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
module.exports.register = function(appContext, opts) {

	var logger = log4js.getLogger('restak.nedb.scheduler.register'),
		jobTransform = transforms.jobTransform,
		jobInstanceTransform = transforms.jobInstanceTransform;
	
	// Jobs
	var jobDb = appContext.registerNeDb('restak.nedb.scheduler.JobDb', 'restak.data-dir.jobs');
	appContext.registerObject('restak.nedb.scheduler.JobTransform', jobTransform);
	appContext.registerQuery('restak.scheduler.JobQuery', new NeDBQuery(jobDb, jobTransform));

	// Job Instances
	var instanceDb = appContext.registerNeDb('restak.nedb.scheduler.JobInstanceStore', 'restak.data-dir.job-instances');
	appContext.registerObject('restak.nedb.scheduler.JobInstanceTransform', jobInstanceTransform);
	appContext.registerQuery('restak.scheduler.JobInstanceQuery', new NeDBQuery(instanceDb, jobInstanceTransform));

	// Scheduler Commands
	appContext.registerCommand('restak.scheduler.UpdateJobScheduledTimestampCommand', new UpdateJobScheduledTimestampCommand(jobDb, jobTransform));
	appContext.registerCommand('restak.scheduler.MarkJobExecutingCommand', new MarkJobExecutingCommand(jobDb, instanceDb, jobTransform, jobInstanceTransform));
	appContext.registerCommand('restak.scheduler.MarkJobExecutedCommand', new MarkJobExecutedCommand(jobDb, instanceDb, jobTransform, jobInstanceTransform));
};