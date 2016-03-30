'use strict';

/**
 * @namespace restak.rest.middleware
 */

/**
 * Any implementation of this interface is designed to install middleware into an express server that is part of {@link restak.rest.RestServer}.
 *
 * @interface Middleware
 * @memberof restak.rest.middleware
 */

/**
 * Install middleware.
 *
 * @function
 * @name restak.rest.middleware.Middleware#install
 * @param {expressjs.app} app - The expressjs app.
 */

 module.exports.BaseMiddleware = require('./base-middleware');