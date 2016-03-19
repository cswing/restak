'use strict';

var log4js = require('log4js'),
	logger = log4js.getLogger('restak.app-server.DefaultObjectFactory');

/**
 * @interface ObjectFactory
 * @memberof restak.app-server
 */

/**
 * Register an object for the given key.
 *
 * @function
 * @name restak.app-server.ObjectFactory#register
 * @param {string} key - The key that identifies the command.
 * @param {object} obj - The object.
 * @return {boolean} true if the object was registered, otherwise false.
 */

/**
 * Given a key return the corresponding object.
 *
 * @function
 * @name restak.app-server.ObjectFactory#get
 * @param {string} key - The key that identifies the command.
 * @return {object} The object.
 */

/**
 * Default implementation of {@link restak.app-server.ObjectFactory}.
 *
 * @constructor
 * @implements restak.app-server.ObjectFactory
 * @memberof restak.app-server
 * @param {Object} objectMap - an inital map of objects to register;
 */
var DefaultObjectFactory = function(objectMap) {

	this.objects = {};

	if(objectMap) {
		var _t = this;
		Object.keys(objectMap).forEach(function(key){
			_t.register(key, objectMap[key]);
		});
	}
};

/** @inheritdoc */
DefaultObjectFactory.prototype.register = function(key, obj) {

	if(key===null || key===undefined) {
		logger.warn('Invalid key: ' + key + '; will not register: ' + obj);
		return false;
	}

	if(this.objects[key]){
		logger.warn('Duplicate key: ' + key + '; will not register: ' + obj);
		return false;
	}

	this.objects[key] = obj;
	logger.debug('Registered: ' + key + '; ' + obj);

	return true;
};

/** @inheritdoc */
DefaultObjectFactory.prototype.get = function(key) {

	var cmdKey = key;

	if(cmdKey && this.objects[cmdKey]){
		return this.objects[cmdKey];
	}

	logger.warn('Unknown key: ' + key);
	return null;
};

module.exports.DefaultObjectFactory = DefaultObjectFactory;