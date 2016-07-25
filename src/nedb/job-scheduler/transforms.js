'use strict';

var DefaultObjectTransform = require('../../util').DefaultObjectTransform;

var jobDescriptor = {
	id: 			'_id',
	name: 			null,
	description: 	null,
	commandKey: 	null,

	
	status: 		null,
	schedule: 		null,
	command: 		null,
	nextExecution:  null,
	data: 			null
};

module.exports.jobTransform = new DefaultObjectTransform(jobDescriptor);


var instanceDescriptor = {
	jobId: null,
	name: null,
	instanceId: '_id',
	status: null,
	startTimestamp: null,
	endTimestamp: null,
	data: null,
	result: null
};

module.exports.jobInstanceTransform = new DefaultObjectTransform(instanceDescriptor);