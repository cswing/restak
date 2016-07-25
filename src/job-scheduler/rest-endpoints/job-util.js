'use strict';

module.exports.createJobCollectionLink = function(endpoint, context){
	return endpoint.buildResourceLink(context.req, 'Jobs', 'jobs', '/jobs');
};

module.exports.createJobResourceLink = function(endpoint, job, context){
	return endpoint.buildResourceLink(context.req, job.name, 'job', '/jobs/' + job.id);
};

module.exports.createJobHistoryCollectionLink = function(endpoint, job, context){
	return endpoint.buildResourceLink(context.req, job.name + ' History', 'job-history', '/jobs/' + job.id + '/history');
};

module.exports.createJobHistoryResourceLink = function(endpoint, instance, context){
	return endpoint.buildResourceLink(context.req, instance.name + ' History Instance', 'job-history-instance', '/jobs/' + instance.jobId + '/history/' + instance.instanceId);
};