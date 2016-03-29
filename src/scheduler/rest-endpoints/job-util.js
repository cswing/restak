'use strict';

module.exports.createJobCollectionLink = function(endpoint, context){
	return endpoint.buildResourceLink(context.req, 'Jobs', 'jobs', '/scheduler/jobs');
};

module.exports.createJobResourceLink = function(endpoint, job, context){
	return endpoint.buildResourceLink(context.req, job.name, 'job', '/scheduler/jobs/' + job.id);
};

module.exports.createJobHistoryCollectionLink = function(endpoint, job, context){
	return endpoint.buildResourceLink(context.req, job.name + ' History', 'job-history', '/scheduler/jobs/' + job.id + '/history');
};

module.exports.createJobHistoryResourceLink = function(endpoint, instance, context){
	return endpoint.buildResourceLink(context.req, instance.name + ' History', 'job-history', '/scheduler/jobs/' + instance.jobId + '/history/' + instance.instanceId);
};