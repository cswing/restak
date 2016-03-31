'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.security'),
	SecurityMiddleware = require('./security-middleware'),
	AuthenticationEndpoint = require('./endpoints/authentication-endpoint');

/**
 * @namespace restak.security
 */

/**
 * @namespace restak.security.endpoints
 */

/**
 * Register the necessary objects for the {@link restak.security} namespace.  It requires the commands and query to exist in the appContext.
 *
 * @function register
 * @memberof restak.security
 * @see restak.app-server.register
 */
module.exports.register = function(appContext) {
	
	var privateKey = appContext.getConfigSetting('restak.security.token.key'),
		authenticationCommand = appContext.getCommand('restak.security.AuthenticationCommand');

	appContext.registerMiddleware('restak.security.SecurityMiddleware', new SecurityMiddleware(privateKey));
	appContext.registerEndpoint('restak.security.AuthenticationEndpoint', new AuthenticationEndpoint(authenticationCommand));
};

module.exports.AuthenticationCommand = require('./authentication-command');
module.exports.SecurityMiddleware = SecurityMiddleware;