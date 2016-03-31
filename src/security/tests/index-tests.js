'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	ApplicationContext = require('../../app-server/application-context'),
	DefaultConfig =  require('../../app-server/config'),
	register = require('../index').register;

describe('security', function() {

	describe('#register', function(){

		var expectObjects = function(appContext) {
			expect(appContext.getMiddleware('restak.security.SecurityMiddleware')).to.not.be.null;
			expect(appContext.getEndpoint('restak.security.AuthenticationEndpoint')).to.not.be.null;
		};

		it('should register security objects', function(done){

			var config = new DefaultConfig({
					'restak.security.token.key': 'TEST'
				}),
				appContext = new ApplicationContext(config);

			appContext.registerCommand('restak.security.AuthenticationCommand', {});
			register(appContext);

			expectObjects(appContext);

			done();
		});

	});
});