'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	jwt = require('jsonwebtoken'),
	BaseAuthenticationCommand = require('../authentication-command');

var AuthenticationCommand = function(privateKey, validAuthenticate, persistError){
	BaseAuthenticationCommand.apply(this, arguments);
	this.validAuthenticate = validAuthenticate;
	this.persistError = persistError;
};
util.inherits(AuthenticationCommand, BaseAuthenticationCommand);

AuthenticationCommand.prototype.authenticate = function(username, password, callback){
	callback(null, this.validAuthenticate);
};

AuthenticationCommand.prototype.persistToken = function(username, token, callback){
	callback(this.persistError || null);
};


describe('security > authentication-command', function() {

	describe('#execute', function(){

		it('should return a token when the command provides a successful result', function(done){

			var privateKey = 'TEST123',
				cmd = new AuthenticationCommand(privateKey, true);

			cmd.execute({ data: {
				username: 'john.doe',
				password: 'pw'
			}}, function(err, result){

				if(err) {
					done(err);
					return;
				}

				expect(result.success).to.equal(true);
				expect(result.token).to.not.be.null;
				expect(result.username).to.equal('john.doe');

				jwt.verify(result.token, privateKey, function(err, decoded) {

					if(err){
						done(err);
						return;
					}

					expect(decoded).to.be.equal('john.doe');

					done();
				});

			});
		});

		it('should not return a token when the command provides an unsuccessful result', function(done){

			var privateKey = 'TEST123',
				cmd = new AuthenticationCommand(privateKey, false);

			cmd.execute({ data: {
				username: 'john.doe',
				password: 'pw'
			}}, function(err, result){

				if(err) {
					done(err);
					return;
				}

				expect(result.success).to.equal(false);
				expect(result.token).to.be.null;
				expect(result.username).to.be.null;

				done();
			});
		});

	});
});