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
	var _t = this;
	app.use(function(req, res, next){
		_t.onRequest(req, res, next);
	});
};

/**
 * Any class that extends this should implement this function.
 *
 */
BaseMiddleware.prototype.onRequest = function(req, res, next) {
	next();
};

module.exports = BaseMiddleware;