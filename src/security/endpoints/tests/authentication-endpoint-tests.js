'use strict';

var log4js = global.log4js || require('log4js'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	urlUtil = require('url'),
	request = require('supertest'),
	RestServer = require('../../../rest/server'),
	AuthenticationEndpoint = require('../authentication-endpoint');

var MockCommand = function(success, token){
	this.success = success;
	this.token = token;
};

MockCommand.prototype.execute = function(instr, callback){
	callback(null, { data: {
		success: this.success,
		token: this.token
	}});
};

var serverConfig = {
	port: 12000,
	appName: 'test app',
	appVersion: '1.0'
};

describe('security > endpoints > authentication-endpoint', function() {

	describe('#onRequest', function(){

		it('should execute the command and return 200', function(done){

			var cmd = new MockCommand(true, '0123456'),
				endpoint = new AuthenticationEndpoint(cmd),
				server = new RestServer([endpoint], serverConfig),
				expectedPayload = {
					success: true,
					token: '0123456'
				};

			request(server.app)
				.post('/security/authentication')
				.type('form')
				.send({
					username: 'user',
					password: 'password'
				})
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res){
					expect(err).to.be.null;
					expect(res.body.payload).to.deep.equal(expectedPayload);
					done();
				});
		});

		it('should execute the command and return 400', function(done){

			var cmd = new MockCommand(false, '0123456'),
				endpoint = new AuthenticationEndpoint(cmd),
				server = new RestServer([endpoint], serverConfig),
				expectedPayload = {
					success: false,
					token: null
				};

			request(server.app)
				.post('/security/authentication')
				.type('form')
				.send({
					username: 'user',
					password: 'password'
				})
				.expect('Content-Type', /json/)
				.expect(400)
				.end(function(err, res){
					expect(err).to.be.null;
					expect(res.body.payload).to.deep.equal(expectedPayload);
					done();
				});

		});
	});

});