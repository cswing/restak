'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.domain-events.record-event-command');

/**
 * Record a domain event in the system and propogate the event to all listeners.
 *
 * @constructor
 * @implements restak.command.Command
 * @memberof restak.domain-events
 * @param {Object} collection - The collection to record the event in.
 * @param {EventEmitter} emitter - The event emitter to notify other parts of the system of the new event.
 * @param {string} entityKey - The key of the entity.
 * @param {string} eventKey - The key of the event.
 * @param {object} eventValidation - A validation object that can be used to validate the event to record.
 */
var RecordEventCommand = function(collection, emitter, entityKey, eventKey, eventValidation){

	/**
	 * The collection to record the event in.
	 *
	 * @protected
	 * @type Object
	 */
	this.collection = collection;

	/**
	 * The event emitter to notify other parts of the system of the new event.
	 *
	 * @protected
	 * @type EventEmitter
	 */
	this.emitter = emitter;

	/**
	 * The key of the entity.
	 *
	 * @protected
	 * @type string
	 */
	this.entityKey = entityKey;

	/**
	 * The key of the event.
	 *
	 * @protected
	 * @type string
	 */
	this.eventKey = eventKey;

	/**
	 * A validation object that can be used to validate the event to record.
	 *
	 * @protected
	 * @type Object
	 */
	this.validation = eventValidation;
};

/** @inheritdoc */
RecordEventCommand.prototype.execute = function(instr, callback){

	var emitter = this.emitter,
		entityKey = this.entityKey,
		eventKey = this.eventKey,
		eventString = this.entityKey + ' -> ' + this.eventKey,
		data = instr.data,
		doc = {};

	Object.keys(this.validation).forEach(function(key){
		doc[key] = data[key];
	});

	if(logger.isDebugEnabled()) {
		logger.debug('Recording event [' + eventString + ']: ' + JSON.stringify(doc));
	}

	this.collection.insert(doc, function(err, result){
		if(err) return callback(err, null);

		var evt = result.doc;

		if(logger.isInfoEnabled()) {
			logger.info('Event recorded [' + eventString + ']: ' + JSON.stringify(evt));
		}

		emitter.emit(eventKey, evt);

		callback(null, evt);
	});
};

module.exports = RecordEventCommand;