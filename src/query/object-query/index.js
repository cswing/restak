'use strict';

/**
 * @namespace restak.query.object
 */
 
var ofModule = require('./object-filter');

module.exports.ObjectQueryListener = ofModule.ObjectQueryListener;
module.exports.ObjectFilter = ofModule.ObjectFilter;
module.exports.InMemoryObjectQuery = require('./in-memory-object-query');