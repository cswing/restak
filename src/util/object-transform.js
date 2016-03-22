'use strict';

/**
 * @interface ObjectTransform
 * @memberof restak.util
 */

/**
 * Transform an object to another object
 *
 * @function
 * @name restak.util.ObjectTransform#transform
 * @param {Object} item - The item to transform.
 * @return {Object} The transformed item.
 */

/**
 * A default implementation of {@link restak.util.ObjectTransform}
 *
 * @implements restak.util.ObjectTransform
 * @constructor
 * @param {object} - propertiesObject
 */
var DefaultObjectTransform = function(propertiesObject){
	this.propertiesObject = propertiesObject;
};

/** @inheritdoc */
DefaultObjectTransform.prototype.transform = function(item){
	
	var propertiesObject = this.propertiesObject,
		transformedItem = {};

	Object.keys(propertiesObject).forEach(function(key){
		
		var fn = propertiesObject[key];
		
		if(fn) {
			transformedItem[key] = fn(item);
		} else {
			transformedItem[key] = item[key];
		}
	});
	return transformedItem;
};

module.exports.DefaultObjectTransform = DefaultObjectTransform;