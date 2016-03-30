'use strict';

/**
 * A default implementation of {@link restak.rest.middleware.Middleware}. 
 *
 * @constructor
 * @abstract
 * @memberof restak.rest.middleware
 * @implements restak.rest.middleware.Middleware
 */
var BaseMiddleware = function(){};

/** @inheritdoc **/
BaseMiddleware.prototype.install = function(app) {
	app.use(BaseMiddleware.prototype.onRequest.bind(this));
};

/**
 * Any class that extends this should implement this function.
 *
 */
BaseMiddleware.prototype.onRequest = function(req, res, next) {
	next();
};

module.exports = BaseMiddleware;