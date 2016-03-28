'use strict';

var log4js = global.log4js || require('log4js'),
	util = require('util'),
	BaseCollectionEndpoint = require('../../rest/endpoints/collection-endpoint'),
	BaseResourceGetEndpoint = require('../../rest/endpoints/resource-query-endpoint'),
	jobUtil = require('./job-util'),
	createJobResourceLink = jobUtil.createJobResourceLink,
	createJobInstanceCollectionLink = jobUtil.createJobInstanceCollectionLink,
	createJobInstanceResourceLink = jobUtil.createJobInstanceResourceLink;


var processItem = function(item, context){

	var job = {
		id: item.jobId,
		name: item.name
	};

	item.links = [
		createJobResourceLink(this, job, context),
		createJobInstanceCollectionLink(this, job, context),
		createJobInstanceResourceLink(this, item, context)
	];

	return item;
};

/**
 * Collection endpoint to provide access to job instances.
 *
 * @constructor
 * @memberof namespace restak.scheduler.rest-endpoints.instances
 * @extends restak.rest.endpoints.CollectionEndpoint
 */
var CollectionEndpoint = function(){
	
	BaseCollectionEndpoint.apply(this, [
		log4js.getLogger('restak.scheduler.job-instances.CollectionEndpoint'), '/scheduler/jobs/:jobId/instances', 'restak.scheduler.JobInstanceQuery']);

	this.itemPostProcessor = processItem.bind(this);
};
util.inherits(CollectionEndpoint, BaseCollectionEndpoint);

/** @inheritdoc */
CollectionEndpoint.prototype.getFixedFilter = function(req){
	return 'jobId=\'' + req.params.jobId + '\'';
};

/** @inheritdoc */
CollectionEndpoint.prototype.postProcessItem = function(item, context){
	return this.itemPostProcessor(item, context);
};

module.exports.CollectionEndpoint = CollectionEndpoint;

/**
 * Resource endpoint to provide access to a job instance.
 *
 * @constructor
 * @memberof namespace restak.scheduler.rest-endpoints.instances
 * @extends restak.rest.endpoints.ResourceQueryEndpoint
 */
var ResourceGetEndpoint = function(){
	BaseResourceGetEndpoint.apply(this, [
		log4js.getLogger('nhl-modeling.structures.players.endpoints.ResourceGetEndpoint'), '/scheduler/jobs/:jobId/instances/:instanceId', 'restak.scheduler.JobInstanceQuery']);

	this.itemPostProcessor = processItem.bind(this);
};
util.inherits(ResourceGetEndpoint, BaseResourceGetEndpoint);

/** @inheritdoc */
ResourceGetEndpoint.prototype.getFixedFilter = function(req){
	return 'jobId=\'' + req.params.jobId + '\' AND _id=\'' + req.params.instanceId + '\'';
};

/** @inheritdoc */
ResourceGetEndpoint.prototype.postProcessItem = function(item, context){
	return this.itemPostProcessor(item, context);
};

module.exports.ResourceGetEndpoint = ResourceGetEndpoint;