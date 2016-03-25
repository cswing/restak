'use strict';

var log4js = require('log4js'),
	Datastore = require('nedb'),
	NeDBQuery = require('../../query/nedb/nedb-query'),
	transforms = require('./transforms'),
	ObjectTransform = require('../../util/object-transform').DefaultObjectTransform,
	MarkJobExecutingCommand = require('./mark-job-executing-command'),
	MarkJobExecutedCommand = require('./mark-job-executed-command'),
	UpdateJobScheduledTimestampCommand = require('./update-job-scheduled-timestamp-command');

/**
 * A simple store implementation for {@link restak.scheduler.Scheduler} using NeDB.
 * 
 * @namespace restak.scheduler.nedb
 */

/**
 * Register the necessary objects for the {@link restak.scheduler.nedb} namespace.  These objects provide a file system data store 
 * that can be used by the scheduler
 *
 * @function register
 * @memberof restak.scheduler.nedb
 * @see restak.app-server.register
 */
module.exports.register = function(appContext, opts) {

	var logger = log4js.getLogger('restak.scheduler.nedb.register'),
		jobsFile = appContext.getConfigSetting('restak.data-dir.jobs', false),
		jobInstancesFile = appContext.getConfigSetting('restak.data-dir.job-instances', false),
		jobTransform = transforms.jobTransform,
		jobInstanceTransform = transforms.jobInstanceTransform;
	
	var jobStoreOpts = {};	
	if(jobsFile) {
		logger.info('Initializing jobs store using ' + jobsFile);
		jobStoreOpts.filename = jobsFile;
	} else {
		logger.info('Initializing jobs store using an in memory store');
	}
	var jobDb = new Datastore(jobStoreOpts);
		

	var jobInstanceStoreOpts = {};	
	if(jobInstancesFile) {
		logger.info('Initializing job instances store using ' + jobInstancesFile);
		jobInstanceStoreOpts.filename = jobInstancesFile;
	} else {
		logger.info('Initializing jobs instances store using an in memory store');
	}
	var jobInstanceDb = new Datastore(jobInstanceStoreOpts);


	// Jobs
	appContext.registerObject('restak.scheduler.nedb.JobsDb', jobDb);
	appContext.registerObject('restak.scheduler.nedb.JobTransform', jobTransform);
	appContext.registerQuery('restak.scheduler.JobsQuery', new NeDBQuery(jobDb, jobTransform));

	// Job Instances
	appContext.registerObject('restak.scheduler.nedb.JobInstancesDb', jobInstanceDb);
	appContext.registerObject('restak.scheduler.nedb.JobInstanceTransform', jobInstanceTransform);
	appContext.registerQuery('restak.scheduler.JobInstancessQuery', new NeDBQuery(jobDb, jobInstanceTransform));
	
	// Scheduler Commands
	appContext.registerCommand('restak.scheduler.UpdateJobScheduledTimestampCommand', new UpdateJobScheduledTimestampCommand(jobDb, jobTransform));
	appContext.registerCommand('restak.scheduler.MarkJobExecutingCommand', new MarkJobExecutingCommand(jobDb, jobInstanceDb, jobTransform, jobInstanceTransform));
	appContext.registerCommand('restak.scheduler.MarkJobExecutedCommand', new MarkJobExecutedCommand(jobDb, jobInstanceDb, jobTransform, jobInstanceTransform));
};