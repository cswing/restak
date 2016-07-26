var log4js = global.log4js || require('log4js'),
	util = require('util'),
	BaseCollectionEndpoint = require('../../rest/endpoints/collection-endpoint'),
	BaseResourceGetEndpoint = require('../../rest/endpoints/resource-query-endpoint'),
	BaseResourcePostEndpoint = require('../../rest/endpoints/resource-post-endpoint'),
	jobUtil = require('./job-util'),
	createJobResourceLink = jobUtil.createJobResourceLink,
	createJobHistoryCollectionLink = jobUtil.createJobHistoryCollectionLink;


var processItem = function(item, context){

	item.links = [
		createJobResourceLink(this, item, context),
		createJobHistoryCollectionLink(this, item, context)
	];

	return item;
};

/**
 * Collection endpoint to provide access to jobs.
 *
 * @constructor
 * @memberof namespace restak.scheduler.rest-endpoints.jobs
 * @extends restak.rest.endpoints.CollectionEndpoint
 */
var CollectionEndpoint = function(){
	
	BaseCollectionEndpoint.apply(this, [
		log4js.getLogger('restak.scheduler.jobs.endpoints.CollectionEndpoint'), '/jobs', 'restak.scheduler.JobQuery']);

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
 * @memberof namespace restak.scheduler.rest-endpoints.jobs
 * @extends restak.rest.endpoints.ResourceQueryEndpoint
 */
var ResourceGetEndpoint = function(){
	BaseResourceGetEndpoint.apply(this, [
		log4js.getLogger('restak.scheduler.jobs.endpoints.ResourceGetEndpoint'), '/jobs/:jobId', 'restak.scheduler.JobQuery']);

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
 * @memberof restak.scheduler.rest-endpoints.jobs
 * @extends restak.rest.endpoints.ResourcePostEndpoint
 * @param {restak.commands.Command} command - Command to use to invoke a job
 */
var ResourcePostEndpoint = function(command){
	BaseResourcePostEndpoint.apply(this, [
		log4js.getLogger('restak.scheduler.jobs.endpoints.ResourcePostEndpoint'), '/jobs/:jobId', command]);
};
util.inherits(ResourcePostEndpoint, BaseResourcePostEndpoint);

/** @inheritdoc */
ResourcePostEndpoint.prototype.buildData = function(req, callback){

	var data = {
		playerName: req.body.playerName,
		team: req.body.team, 
		position: req.body.position, 
		asOf: req.body.asOf
	};

	callback(null, data);
};

/** @inheritdoc */
ResourcePostEndpoint.prototype.buildPayload = function(cmdResult, ctx){
	return createJobResourceLink(this, cmdResult.data, ctx); // TODO link this to status
};

// exports
module.exports.CollectionEndpoint = CollectionEndpoint;
module.exports.ResourceGetEndpoint = ResourceGetEndpoint;
module.exports.ResourcePostEndpoint = ResourcePostEndpoint;