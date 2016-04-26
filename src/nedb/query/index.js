'use strict';

/**
 * Provides a {@link restak.query.Query} implementation using NeDB as the backing datastore.
 *
 * @namespace restak.nedb.query
 */

module.exports.NeDBFilterListener = require('./nedb-filter-listener.js');
module.exports.NeDBQuery = require('./nedb-query.js');