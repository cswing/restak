'use strict';

module.exports.createJobLink = function(endpoint, job, context){
	return endpoint.buildResourceLink(context.req, job.name, 'job', '/scheduler/jobs/' + job.id);
};