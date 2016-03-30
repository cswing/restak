'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.security.AuthenticationCommand'),
	jwt = require('jsonwebtoken'),
	DEFUALT_EXPIRES_IN = '1d';

/**
 *
 * @constructor
 * @abstract
 * @memberof restak.security
 * @param {string} privateKey - the private key to use when generating the token.
 * @param {string} expiresIn - expressed in seconds or a string describing a time span rauchg/ms
 */
var AuthenticationCommand = function(privateKey, expiresIn){
	this.privateKey = privateKey;
	this.expiresIn = expiresIn || DEFUALT_EXPIRES_IN;
};

AuthenticationCommand.prototype.execute = function(ci, callback) {

	var _t = this,
		username = ci.data.username,
		password = ci.data.password;

	this.authenticate(username, password, function(err, isValidCredentials){

		if(!isValidCredentials) {
			return callback(null, { success: false, token: null });
		}

		var token = jwt.sign(username, _t.privateKey, {
			expiresInMinutes: _t.minutesValid
		});
		
		_t.persistToken(username, token, function(err){
			if(err){
				logger.error(err);
			}

			callback(null, { success: true, token: token });
		});
	});
};

AuthenticationCommand.prototype.authenticate = function(username, password, callback){
	callback(null, false);
};

AuthenticationCommand.prototype.persistToken = function(username, token, callback){
	callback(null);
};

module.exports = AuthenticationCommand;