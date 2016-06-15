'use strict';

var log4js = global.log4js || require('log4js'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	util = require('util'),
	urlUtil = require('url'),
	request = require('supertest'),
	DefaultConfig = require('../../../app-server/config'),
	RestServer = require('../../server'),
	CommandEndpoint = require('../command-endpoint');

var CommandEndpointImpl = function(logger, path, command, successHttpStatusCode){
	CommandEndpoint.apply(this, arguments);
};
util.inherits(CommandEndpointImpl, CommandEndpoint);

CommandEndpointImpl.prototype.register = function(app, server) {
	CommandEndpoint.prototype.register.apply(this, arguments);

	var _t = this;
	app.get(this.path, function (req, res) { _t.onRequest(req, res); });
	this.logger.debug('Path registered [GET] ' + this.path);
};

var CommandEndpointOverridesImpl = function(logger, path, command, successHttpStatusCode, data, payload, getSuccessHttpStatusCode){
	CommandEndpointImpl.apply(this, arguments);
	this.data = data;
	this.payload = payload;
	this._getSuccessHttpStatusCode = getSuccessHttpStatusCode;
};
util.inherits(CommandEndpointOverridesImpl, CommandEndpointImpl);

CommandEndpointOverridesImpl.prototype.buildData = function(req, callback){
	callback(null, this.data);
};

CommandEndpointOverridesImpl.prototype.buildPayload = function(cmdResult){
	return this.payload;
};

CommandEndpointOverridesImpl.prototype.getSuccessHttpStatusCode = function(cmdResult){

	if(this._getSuccessHttpStatusCode)
		return this._getSuccessHttpStatusCode(cmdResult);

	return CommandEndpointImpl.prototype.getSuccessHttpStatusCode.apply(this, arguments);
};

var logger = log4js.getLogger('test'),
	appDescriptor = {
		name: 'test app',
		version: '1.0'
	},
	serverConfig = {
		port: 12000
	};

describe('rest > endpoints > command-endpoint', function() {

	describe('#onRequest', function(){

		it('should execute the command and return 200', function(done){

			var response = { data: { x: 'a' } },
				command = {
					execute: function(ci, callback) {
						callback(null, response);
					}
				};

			var server = new RestServer(appDescriptor, serverConfig, [new CommandEndpointImpl(logger, '/testpath', command)]);

			request(server.app)
				.get('/testpath')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res){
					expect(err).to.be.null;
					expect(res.body.payload).to.deep.equal(response);
					done();
				});
		});

		it('should execute the command and return 201', function(done){

			var response = { data: { x: 'a' } },
				command = {
					execute: function(ci, callback) {
						callback(null, response);
					}
				};

			var server = new RestServer(appDescriptor, serverConfig, [new CommandEndpointImpl(logger, '/testpath', command, 201)]);

			request(server.app)
				.get('/testpath')
				.expect('Content-Type', /json/)
				.expect(201)
				.end(function(err, res){
					expect(err).to.be.null;
					expect(res.body.payload).to.deep.equal(response);
					done();
				});
		});

		it('should execute the command and return 400', function(done){

			var response = { data: { x: 'a' } },
				data = { x: 1 },
				command = {
					execute: function(ci, callback) {
						callback(null, response);
					}
				};

			var server = new RestServer(appDescriptor, serverConfig, [new CommandEndpointOverridesImpl(logger, '/testpath', command, 201, data, data, function() { return 400; })]);

			request(server.app)
				.get('/testpath')
				.expect('Content-Type', /json/)
				.expect(400)
				.end(function(err, res){
					expect(err).to.be.null;
					expect(res.body.payload).to.not.be.null;
					done();
				});
		});

		it('should execute the command and return the modified payload', function(done){

			var response = { data: { x: 'a' } },
				data = { x: 1 },
				modified = { x: 2 },
				command = {
					execute: function(ci, callback) {
						expect(ci.data).to.deep.equal(data);
						callback(null, response);
					}
				};

			var server = new RestServer(appDescriptor, serverConfig, [new CommandEndpointOverridesImpl(logger, '/testpath', command, 200, data, modified)]);

			request(server.app)
				.get('/testpath')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res){
					expect(err).to.be.null;
					expect(res.body.payload).to.deep.equal(modified);
					done();
				});
		});

	});
});