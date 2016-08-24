'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.domain-events'),
	EventEmitter = require('events').EventEmitter,
	ApplicationContext = require('../app-server/application-context'),
	RecordEventCommand = require('./record-event-command'),
	NoSqlShim = require('../util').NoSqlShim;

var buildKey = function(entityKey, objectKey){
	return 'domain.entity[' + entityKey + '].' + objectKey;
};

var buildUnknownEntityError = function(entityKey) {
	return new Error('Unknown entity: ' + entityKey);
};

/**
 * Register a domain entity in the system.
 * 
 * @param {string} entityKey - the key to use to identify the entity.
 * @param {object} eventCollection - a NoSql database to store the events in. The collection must be supported by NoSqlShim.
 */
ApplicationContext.prototype.registerDomainEntity = function(entityKey, eventCollection){

	var appContext = this,
		emitter = new EventEmitter();

	appContext.registerObject(buildKey(entityKey, 'event-collection'), new NoSqlShim(eventCollection));
	appContext.registerObject(buildKey(entityKey, 'event-emitter'), emitter);

	logger.debug('Domain entity registered: ' + entityKey);
};

/**
 * Register a domain event in the system.
 *
 * @param {string} entityKey - the key to use to identify the entity.
 * @param {string} eventKey - the key to use to identify the entity.
 * @param {object} eventValidation - the key to use to identify the entity.
 */
ApplicationContext.prototype.registerDomainEvent = function(entityKey, eventKey, eventValidation){

	var appContext = this,
		collection = appContext.getObject(buildKey(entityKey, 'event-collection')),
		emitter = appContext.getObject(buildKey(entityKey, 'event-emitter'));

	if(collection == null || emitter == null){
		throw buildUnknownEntityError(entityKey);
	}

	var recordEventCommand = new RecordEventCommand(collection, emitter, entityKey, eventKey, eventValidation);
	
	appContext.registerCommand(buildKey(entityKey, 'record-event-command'), recordEventCommand);

	logger.debug('Domain event registered: ' + entityKey + '[' + eventKey + ']');
};

/**
 * Register a listener for a domain event in the system.
 *
 * @param {string} entityKey - the key to use to identify the entity.
 * @param {string} eventKey - the key to use to identify the entity.
 * @param {Function} listener - the listener to call when the event occurs.
 */
ApplicationContext.prototype.registerDomainEventListener = function(entityKey, eventKey, listener){

	var appContext = this,
		emitter = appContext.getObject(buildKey(entityKey, 'event-emitter'));

	if(emitter == null){
		throw buildUnknownEntityError(entityKey);
	}

	emitter.on(eventKey, listener);

	logger.debug('Domain listener registered: ' + entityKey + '[' + eventKey + '] -> ' + listener);
};

module.exports.ApplicationContext = ApplicationContext;