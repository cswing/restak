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
	
	if(item == undefined || item == null)
		return null;

	var propertiesObject = this.propertiesObject,
		transformedItem = {};

	Object.keys(propertiesObject).forEach(function(key){
		
		var propValue = propertiesObject[key];

		if (typeof(propValue) == 'function') {
			var fn = propValue;
			transformedItem[key] = fn(item);
		
		} else if(propValue != null) {
			transformedItem[key] = item[propValue];

		} else {
			transformedItem[key] = item[key];
		}
	});
	return transformedItem;
};

module.exports.DefaultObjectTransform = DefaultObjectTransform;