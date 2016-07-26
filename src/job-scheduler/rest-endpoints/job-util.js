'use strict';

module.exports.createJobCollectionLink = function(endpoint, context){
	return endpoint.buildResourceLink(context.req, 'Jobs', 'jobs', '/jobs');
};

module.exports.createJobResourceLink = function(endpoint, job, context){
	return endpoint.buildResourceLink(context.req, job.name, 'job', '/jobs/_/' + job.id);
};

module.exports.createJobStatusesResourceLink = function(endpoint, job, context){
	return endpoint.buildResourceLink(context.req, job.name + ' Status Collection', 'job-statuses', '/jobs/status?filter=jobId="' + job.id + '"');
};

module.exports.createJobStatusResourceLink = function(endpoint, instance, context){
	return endpoint.buildResourceLink(context.req, instance.name + ' Status', 'job-status', '/jobs/status?filter=id="' + instance.id + '"');
};

module.exports.createJobHistoryCollectionLink = function(endpoint, job, context){
	return endpoint.buildResourceLink(context.req, job.name + ' History', 'job-history', '/jobs/' + job.id + '/history');
};

module.exports.createJobHistoryResourceLink = function(endpoint, instance, context){
	return endpoint.buildResourceLink(context.req, instance.name + ' History Instance', 'job-history-instance', '/jobs/' + instance.jobId + '/history/' + instance.instanceId);
};