'use strict';

/**
 * @interface Config
 * @memberof restak.app-server
 */

/**
 * Provide access to configuration settings.
 *
 * @function
 * @name restak.app-server.Config#get
 * @param {string} key - The key that identifies the setting.
 * @returns {string} The setting value.
 * @throws if the key is undefined.
 */

/**
 * Whether or not the the configuration setting is defined.
 *
 * @function
 * @name restak.app-server.Config#has
 * @param {string} key - The key that identifies the setting.
 * @returns {boolean} Whether or not the setting exists
 */

/**
 * Provides a default implemnetation of {@link restak.app-server.config} using no third party dependancies.
 *
 * @implements restak.app-server.Config
 */
var DefaultConfig = function(settings) {
	this.settings = settings;
};

/** @inheritdoc */
DefaultConfig.prototype.get = function(key){
	
	if(this.has(key)){
		return this.settings[key];	
	}
	
	throw 'Undefined setting: ' + key;
};

/** @inheritdoc */
DefaultConfig.prototype.has = function(key){
	return this.settings[key] !== undefined;
};

module.exports = DefaultConfig;