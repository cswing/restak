var log4js = global.log4js || require('log4js'),
	util = require('util'),
	BaseCollectionEndpoint = require('../../rest/endpoints/collection-endpoint'),
	BaseResourceGetEndpoint = require('../../rest/endpoints/resource-query-endpoint'),
	BaseResourcePostEndpoint = require('../../rest/endpoints/resource-post-endpoint'),
	jobUtil = require('./job-util'),
	createJobResourceLink = jobUtil.createJobResourceLink,
	createJobStatusCollectionLink = jobUtil.createJobStatusCollectionLink,
	createJobStatusResourceLink = jobUtil.createJobStatusResourceLink;;


var processItem = function(item, context){

	item.links = [
		createJobResourceLink(this, item, context),
		createJobStatusCollectionLink(this, item, context)
	];

	return item;
};

/**
 * Collection endpoint to provide access to jobs.
 *
 * @constructor
 * @memberof namespace restak.job-engine.rest-endpoints.jobs
 * @extends restak.rest.endpoints.CollectionEndpoint
 */
var CollectionEndpoint = function(){
	
	BaseCollectionEndpoint.apply(this, [
		log4js.getLogger('restak.job-engine.jobs.endpoints.CollectionEndpoint'), '/jobs', 'restak.job-engine.JobQuery']);

	this.itemPostProcessor = processItem.bind(this);
};
util.inherits(CollectionEndpoint, BaseCollectionEndpoint);

/** @inheritdoc */
CollectionEndpoint.prototype.postProcessItem = function(item, context){
	return this.itemPostProcessor(item, context);
};

/**
 * Resource endpoint to provide access to a job.
 *
 * @constructor
 * @memberof namespace restak.job-engine.rest-endpoints.jobs
 * @extends restak.rest.endpoints.ResourceQueryEndpoint
 */
var ResourceGetEndpoint = function(){
	BaseResourceGetEndpoint.apply(this, [
		log4js.getLogger('restak.job-engine.jobs.endpoints.ResourceGetEndpoint'), '/jobs/_/:jobId', 'restak.job-engine.JobQuery']);

	this.itemPostProcessor = processItem.bind(this);
};
util.inherits(ResourceGetEndpoint, BaseResourceGetEndpoint);

/** @inheritdoc */
ResourceGetEndpoint.prototype.getFixedFilter = function(req){
	return '_id=\'' + req.params.jobId + '\'';
};

/** @inheritdoc */
ResourceGetEndpoint.prototype.postProcessItem = function(item, context){
	return this.itemPostProcessor(item, context);
};

/**
 * Resource endpoint to invoke a job manually.
 *
 * @constructor
 * @memberof restak.job-engine.rest-endpoints.jobs
 * @extends restak.rest.endpoints.ResourcePostEndpoint
 * @param {restak.commands.Command} command - Command to use to invoke a job
 */
var ResourcePostEndpoint = function(command){
	BaseResourcePostEndpoint.apply(this, [
		log4js.getLogger('restak.job-engine.jobs.endpoints.ResourcePostEndpoint'), '/jobs/_/:jobId', command]);
};
util.inherits(ResourcePostEndpoint, BaseResourcePostEndpoint);

/** @inheritdoc */
ResourcePostEndpoint.prototype.getValidationDefinition = function(){

	var cmdValidation = this.command.validation || {},
		obj = { 
			params: {},
			body: {}
		};

	Object.keys(cmdValidation).forEach(function(key){
		
		if(key === 'jobId') {
			obj.params[key] = cmdValidation[key];

		} else {
			obj.body[key] = cmdValidation[key];

		}
	});

	return obj;
};

/** @inheritdoc */
ResourcePostEndpoint.prototype.buildData = function(req, callback){

	var data = {
		jobId: req.params.jobId,
		params: req.body.params || null
	};

	callback(null, data);
};

/** @inheritdoc */
ResourcePostEndpoint.prototype.buildPayload = function(cmdResult, ctx){
	return createJobStatusResourceLink(this, cmdResult, ctx);
};

// exports
module.exports.CollectionEndpoint = CollectionEndpoint;
module.exports.ResourceGetEndpoint = ResourceGetEndpoint;
module.exports.ResourcePostEndpoint = ResourcePostEndpoint;