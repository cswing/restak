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
		log4js.getLogger('restak.scheduler.jobs.CollectionEndpoint'), '/jobs', 'restak.scheduler.JobQuery']);

	this.itemPostProcessor = processItem.bind(this);
};
util.inherits(CollectionEndpoint, BaseCollectionEndpoint);

/** @inheritdoc */
CollectionEndpoint.prototype.postProcessItem = function(item, context){
	return this.itemPostProcessor(item, context);
};

module.exports.CollectionEndpoint = CollectionEndpoint;

/**
 * Resource endpoint to provide access to a job.
 *
 * @constructor
 * @memberof namespace restak.scheduler.rest-endpoints.jobs
 * @extends restak.rest.endpoints.ResourceQueryEndpoint
 */
var ResourceGetEndpoint = function(){
	BaseResourceGetEndpoint.apply(this, [
		log4js.getLogger('nhl-modeling.structures.players.endpoints.ResourceGetEndpoint'), '/jobs/:jobId', 'restak.scheduler.JobQuery']);

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

module.exports.ResourceGetEndpoint = ResourceGetEndpoint;