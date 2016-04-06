'use strict';

var log4js = global.log4js || require('log4js'),
	util = require('util'),
	BaseResourcePostEndpoint = require('../../rest/endpoints/resource-post-endpoint');

/**
 * Endpoint that provides basic username/password quthentication. 
 *
 * @constructor
 * @memberof restak.security.endpoints
 */
var AuthenticationEndpoint = function(command){
	BaseResourcePostEndpoint.apply(this, [
		log4js.getLogger('restak.security.endpoints.AuthenticationEndpoint'), '/security/authentication', command]);
};
util.inherits(AuthenticationEndpoint, BaseResourcePostEndpoint);

/** @inheritdoc */
AuthenticationEndpoint.prototype.buildData = function(req, callback){

	var data = {
		username: req.body.username,
		password: req.body.password
	};

	callback(null, data);
};

/** @inheritdoc */
AuthenticationEndpoint.prototype.buildPayload = function(cmdResult, ctx){
	var authenticationResult = cmdResult;

	var payload = {
		success: authenticationResult.success,
		token: null,
		username: null
	};

	if(payload.success) {
		payload.token = authenticationResult.token;
		payload.username = authenticationResult.username;
	}

	return payload;
};

/** @inheritdoc */
AuthenticationEndpoint.prototype.getSuccessHttpStatusCode = function(cmdResult){
	var authenticationResult = cmdResult;

	if(authenticationResult.success)
		return 200;

	return 400;
};

module.exports = AuthenticationEndpoint;