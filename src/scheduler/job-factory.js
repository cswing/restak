'use strict';

var JobFactory = function(){

};

JobFactory.prototype.getCommand = function(jobDescriptor) {

	return null;
};

// Events from job
// invocation.job.emit('scheduled', invocation.fireDate);
// job.emit('run');
// invocation.job.emit('canceled', invocation.fireDate);

/*
	Job
	- status:   Scheduled, Cancelled, Completed
	- is recurring
	- next schedule
	- id
	- created

 * @property {string} filter - The filter to apply when querying the data
 * @property {Number} pageSize - The number of items to return
 * @property {Number} page - The page of the filtered dataset to return
*/

/*
	Job Instance
	- job id
	- execution date
	- status
*/

/*
	create job instance
	update job status
	execute command
	update job instance
*/

/*
	schedule job
	modify schedule
	cancel job
	execute now
	re-run
*/

// Scheduler#invokeJobCommand
// it should handle when the command doesn't impl Command
// it should handle when the command dies (heartbeat)