'use strict';

var log4js = global.log4js || require('log4js'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	util = require('util'),
	Joi = require('joi'),
	urlUtil = require('url'),
	request = require('supertest'),
	DefaultConfig = require('../../../app-server/config'),
	RestServer = require('../../server'),
	ResourcePostEndpoint = require('../resource-post-endpoint');

var logger = log4js.getLogger('test'),
	appDescriptor = {
		name: 'test app',
		version: '1.0'
	},
	serverConfig = new DefaultConfig({
		port: 12000
	});

describe('rest > endpoints > resource-post-endpoint', function() {

	describe('#onRequest', function(){

		it('should execute the command and return 201', function(done){

			var response = { data: { x: 'a' } },
				command = {
					execute: function(ci, callback) {
						callback(null, response);
					}
				};

			var server = new RestServer(appDescriptor, serverConfig, [new ResourcePostEndpoint(logger, '/testpath', command)]);

			request(server.app)
				.post('/testpath')
				.expect('Content-Type', /json/)
				.expect(201)
				.end(function(err, res){
					expect(err).to.be.null;
					expect(res.body.payload).to.deep.equal(response);
					done();
				});
		});

		it('should validate if a validation object is provided by the command.', function(done){

			var response = { data: { x: 'a' } },
				command = {
					execute: function(ci, callback) {
						callback(null, response);
					},
					validation: {
						testA: Joi.string().required(),
						testB: Joi.string().required()
					}
				},
				expectedPayload = { 
					'validation-errors': [ 
						{ 
							field: 'testB', 
							location: 'body',
							messages: [ '"testB" is required' ],
       						types: [ 'any.required' ]
       					}
       				] 
       			};

			var server = new RestServer(appDescriptor, serverConfig, [new ResourcePostEndpoint(logger, '/testpath', command)]);

			request(server.app)
				.post('/testpath')
				.send({ testA: 'Here'})
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

describe('rest > endpoints > resource-post-endpoint > impl', function() {

	var ResourcePostEndpointImpl = function(command) {
		ResourcePostEndpoint.apply(this, [logger, '/testpath', command]);
	};
	util.inherits(ResourcePostEndpointImpl, ResourcePostEndpoint);
	
	describe('#onRequest', function(){

		it('should execute the command and return 201', function(done){

			var response = { data: { x: 'a' } },
				command = {
					execute: function(ci, callback) {
						callback(null, response);
					}
				};

			var server = new RestServer(appDescriptor, serverConfig, [new ResourcePostEndpointImpl(command)]);

			request(server.app)
				.post('/testpath')
				.expect('Content-Type', /json/)
				.expect(201)
				.end(function(err, res){
					expect(err).to.be.null;
					expect(res.body.payload).to.deep.equal(response);
					done();
				});
		});

	});
});