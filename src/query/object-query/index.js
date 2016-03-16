'use strict';

/**
 * @namespace restak.query.object-query
 */
 
var ofModule = require('./object-filter');
module.exports.ObjectQueryListener = ofModule.ObjectQueryListener;
module.exports.ObjectFilter = ofModule.ObjectFilter;

module.exports.InMemoryObjectQuery = require('./in-memory-object-query');
module.exports.FileSystemObjectQuery = require('./fs-object-query');