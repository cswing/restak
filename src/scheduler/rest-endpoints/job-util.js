'use strict';

module.exports.createJobCollectionLink = function(endpoint, context){
	return endpoint.buildResourceLink(context.req, 'Jobs', 'jobs', '/scheduler/jobs');
};

module.exports.createJobResourceLink = function(endpoint, job, context){
	return endpoint.buildResourceLink(context.req, job.name, 'job', '/scheduler/jobs/' + job.id);
};

module.exports.createJobInstanceCollectionLink = function(endpoint, job, context){
	return endpoint.buildResourceLink(context.req, job.name + ' Instances', 'job-instances', '/scheduler/jobs/' + job.id + '/instances');
};

module.exports.createJobInstanceResourceLink = function(endpoint, instance, context){
	return endpoint.buildResourceLink(context.req, instance.name + ' Instance', 'job-instance', '/scheduler/jobs/' + instance.jobId + '/instances/' + instance.instanceId);
};