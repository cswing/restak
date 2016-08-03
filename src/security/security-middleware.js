'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.security.SecurityMiddleware'),
	util = require('util'),
	jwt = require('jsonwebtoken'),
	BaseMiddleware = require('../rest/middleware/base-middleware');

/**
 * Authorization middleware.
 *
 * @constructor
 * @memberof restak.security
 * @extends restak.rest.middleware.BaseMiddleware
 */
var SecurityMiddleware = function(privateKey){
	BaseMiddleware.apply(this, arguments);
	this.privateKey = privateKey;
};
util.inherits(SecurityMiddleware, BaseMiddleware);

/** @inheritdoc **/
SecurityMiddleware.prototype.onRequest = function(req, res, next) {

	if(!req) {
		logger.warn('Cannot setup security object on request because the request object is null.');
		next();
		return;
	}

	var _t = this,
		token = (req.body || {}).auth || (req.query || {}).auth || (req.headers || {})['x-auth-token'],
		security = {
			isAnonymous: true,
			isAuthenticated: false,
			username: null,
			token: null
		};

	var process = function(){
		_t.populateSecurityDetail(req, security, function(){
			req.security = security;
			next();
		});
	};

	if (token) {
		
		logger.debug('Attempting to deserialize auth token.');

		jwt.verify(token, this.privateKey, function(err, decoded) {

			if(err){
				logger.error('Unable to deserialize token: ' + (err.message || err.toString()));
			} else {
				security.isAnonymous = false;
				security.isAuthenticated = true;
				security.username = decoded;
				security.token = token;
			}

			process();	
		});
	
	} else {
		process();
	}
};

SecurityMiddleware.prototype.populateSecurityDetail = function(req, security, callback) {
	callback();
};

SecurityMiddleware.validateAuthenticatedRequest = function(req, res, next){

	var isAuthenticated = req && req.security && req.security.isAuthenticated;

	if(!isAuthenticated) {
		res.status(401)
			.header('WWW-Authenticate', 'None')
			.send();
		return;
	}

	next();
};

module.exports = SecurityMiddleware;