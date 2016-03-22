var log4js = require('log4js'),
	util = require('util'),
	BaseCollectionEndpoint = require('../../rest/endpoints/collection-endpoint'),
	BaseResourceGetEndpoint = require('../../rest/endpoints/resource-query-endpoint'),
	BaseResourcePostEndpoint = require('../../rest/endpoints/resource-post-endpoint'),
	jobUtil = require('./job-util'),
	createJobLink = jobUtil.createJobLink;


var processItem = function(item, context){

	item.links = [
		createJobLink(this, item, context)
	];

	return item;
};

/**
 * Collection endpoint to provide access to jobs.
 *
 * @constructor
 * @memberof namespace restak.scheduler.rest-endpoints
 * @extends restak.rest.endpoints.CollectionEndpoint
 */
var CollectionEndpoint = function(){
	
	BaseCollectionEndpoint.apply(this, [
		log4js.getLogger('restak.scheduler.jobs.CollectionEndpoint'), '/scheduler/jobs', 'restak.scheduler.JobsQuery']);

	this.itemPostProcessor = processItem.bind(this);
};
util.inherits(CollectionEndpoint, BaseCollectionEndpoint);

/** @inheritdoc */
CollectionEndpoint.prototype.postProcessItem = function(item, context){
	return this.itemPostProcessor(item, context);
};

module.exports.CollectionEndpoint = CollectionEndpoint;