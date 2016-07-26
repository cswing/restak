'use strict';

var DefaultObjectTransform = require('../../util').DefaultObjectTransform;

var jobDescriptor = {
	id: '_id',
	name: null,
	description: null,
	commandKey: null,

	// legacy
	status: 		null,
	schedule: 		null,
	command: 		null,
	nextExecution:  null,
	data: 			null
};

module.exports.jobTransform = new DefaultObjectTransform(jobDescriptor);


var instanceDescriptor = {
	id: '_id',
	jobId: null,
	name: null,
	description: null,
	commandKey: null,
	queuedTimestamp: null,
	queuedUts: null,
	executionStartTimestamp: null, 
	executionStartUts: null, 
	executionEndTimestamp: null, 
	executionEndUts: null, 	
	status: null,
	params: null,

	//legacy
	instanceId: '_id'
};

module.exports.jobInstanceTransform = new DefaultObjectTransform(instanceDescriptor);