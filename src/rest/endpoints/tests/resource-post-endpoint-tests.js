'use strict';

var log4js = global.log4js || require('log4js'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	async = require('async'),
	util = require('util'),
	validate = require('express-validation'),
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

	describe('#onRequest', function(){

		var ResourcePostEndpointImpl = function(command) {
			ResourcePostEndpoint.apply(this, [logger, '/testpath', command]);
		};
		util.inherits(ResourcePostEndpointImpl, ResourcePostEndpoint);

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

	describe('#registerValidationMiddleware', function(){

		var ResourcePostEndpointImpl = function(command) {
			ResourcePostEndpoint.apply(this, [logger, '/testpath', command]);
		};
		util.inherits(ResourcePostEndpointImpl, ResourcePostEndpoint);

		ResourcePostEndpointImpl.prototype.registerValidationMiddleware = function(){
			var _t = this;
			this.registerMiddleware(function(req, res, next){
				var fn = validate(_t.getValidationDefinition(req));
				fn(req, res, next);
			});
		};

		ResourcePostEndpointImpl.prototype.getValidationDefinition = function(req){

			if(req.body.validationParam == 'A') {
				return { body: this.command.validationA };				
			}

			return { body: this.command.validation };
		};

		it('should support building a validation object dynamically based on the request', function(done){

			var command = {
					validationA: {
						paramA: Joi.string().required()
					},
					execute: function(ci, callback) {
						callback(null, {});
					}
				},
				endpoint = new ResourcePostEndpointImpl(command);

			var server = new RestServer(appDescriptor, serverConfig, [new ResourcePostEndpointImpl(command)]),
				tasks = [];

			tasks.push(function(cb){
				request(server.app)
					.post('/testpath')
					.type('form')
					.send({
						validationParam: 'A'
					})
					.expect('Content-Type', /json/)
					.expect(400)
					.end(function(err, res){
						expect(err).to.be.null;
						cb();
					});
			});
			
			tasks.push(function(cb){
				request(server.app)
					.post('/testpath')
					.type('form')
					.send({
						validationParam: 'B'
					})
					.expect('Content-Type', /json/)
					.expect(201)
					.end(function(err, res){
						expect(err).to.be.null;
						cb();
					});
			});
			
			async.parallel(tasks, done);
		});
	});
});