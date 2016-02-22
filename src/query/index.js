'use strict';

/**
 * @interface Query
 */

/**
 * Query a data store with a {@link Query~Request|query request} object.
 *
 * @function
 * @name Query#execute
 * @param {Query~Request} request - The query to execute against the set of data.
 * @param {Query~callback} callback - The callback that handles the response.
 */

/**
 * Instructions for executing a query.
 *
 * @typedef Query~Request
 * @type {object}
 * @property {string} filter
 */

/**
 * The result of executing a query.
 * 
 * @typedef Query~Response
 * @type {object}
 * @property {string} filter
 * @property {Array} data
 */

/**
 * @callback Query~callback
 * @param {Object} error - An error if one occurred, otherwise null.
 * @param {Query~Response} response - The result of the query.
 */