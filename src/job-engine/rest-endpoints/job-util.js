'use strict';

module.exports.createJobCollectionLink = function(endpoint, context){
	return endpoint.buildResourceLink(context.req, 'Jobs', 'jobs', '/jobs');
};

module.exports.createJobResourceLink = function(endpoint, job, context){
	return endpoint.buildResourceLink(context.req, job.name, 'job', '/jobs/_/' + job.id);
};

module.exports.createJobStatusCollectionLink = function(endpoint, job, context){
	return endpoint.buildResourceLink(context.req, job.name + ' Status Collection', 'job-statuses', '/jobs/status?filter=jobId="' + job.id + '"');
};

module.exports.createJobStatusResourceLink = function(endpoint, instance, context){
	return endpoint.buildResourceLink(context.req, instance.name + ' Status', 'job-status', '/jobs/status/' + instance.id);
};