'use strict';

var log4js = global.log4js || require('log4js'),
	util = require('util'),
	BaseCollectionEndpoint = require('../../rest/endpoints/collection-endpoint'),
	BaseResourceGetEndpoint = require('../../rest/endpoints/resource-query-endpoint'),
	models = require('../models'),
	JobInstanceStatus = models.JobInstanceStatus,
	jobUtil = require('./job-util'),
	createJobResourceLink = jobUtil.createJobResourceLink,
	createJobHistoryCollectionLink = jobUtil.createJobHistoryCollectionLink,
	createJobHistoryResourceLink = jobUtil.createJobHistoryResourceLink;


var processItem = function(item, context){

	var job = {
		id: item.jobId,
		name: item.name
	};

	item.links = [
		createJobResourceLink(this, job, context),
		createJobHistoryCollectionLink(this, job, context),
		createJobHistoryResourceLink(this, item, context)
	];

	return item;
};

/**
 * Collection endpoint to provide access to job history.
 *
 * @constructor
 * @memberof namespace restak.scheduler.rest-endpoints.history
 * @extends restak.rest.endpoints.CollectionEndpoint
 */
var CollectionEndpoint = function(){
	
	BaseCollectionEndpoint.apply(this, [
		log4js.getLogger('restak.scheduler.job-history.CollectionEndpoint'), '/jobs/_/:jobId/history', 'restak.scheduler.JobInstanceQuery']);

	this.itemPostProcessor = processItem.bind(this);
};
util.inherits(CollectionEndpoint, BaseCollectionEndpoint);

/** @inheritdoc */
CollectionEndpoint.prototype.getFixedFilter = function(req){
	return 'jobId=\'' + req.params.jobId + '\' AND (status=\'' + JobInstanceStatus.Error + '\' OR status=\'' + JobInstanceStatus.Completed + '\')';
};

/** @inheritdoc */
CollectionEndpoint.prototype.postProcessItem = function(item, context){
	return this.itemPostProcessor(item, context);
};

module.exports.CollectionEndpoint = CollectionEndpoint;

/**
 * Resource endpoint to provide access to a job history.
 *
 * @constructor
 * @memberof namespace restak.scheduler.rest-endpoints.history
 * @extends restak.rest.endpoints.ResourceQueryEndpoint
 */
var ResourceGetEndpoint = function(){
	BaseResourceGetEndpoint.apply(this, [
		log4js.getLogger('restak.scheduler.job-history.endpoints.ResourceGetEndpoint'), '/jobs/_/:jobId/history/:instanceId', 'restak.scheduler.JobInstanceQuery']);

	this.itemPostProcessor = processItem.bind(this);
};
util.inherits(ResourceGetEndpoint, BaseResourceGetEndpoint);

/** @inheritdoc */
ResourceGetEndpoint.prototype.getFixedFilter = function(req){
	return 'jobId=\'' + req.params.jobId + '\' AND _id=\'' + req.params.instanceId + '\' AND (status=\'' + JobInstanceStatus.Error + '\' OR status=\'' + JobInstanceStatus.Completed + '\')';
};

/** @inheritdoc */
ResourceGetEndpoint.prototype.postProcessItem = function(item, context){
	return this.itemPostProcessor(item, context);
};

module.exports.ResourceGetEndpoint = ResourceGetEndpoint;