'use strict';

module.exports.createJobCollectionLink = function(endpoint, context){
	return endpoint.buildResourceLink(context.req, 'Jobs', 'jobs', '/scheduler/jobs');
};

module.exports.createJobLink = function(endpoint, job, context){
	return endpoint.buildResourceLink(context.req, job.name, 'job', '/scheduler/jobs/' + job.id);
};