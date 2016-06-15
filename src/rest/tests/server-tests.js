'use strict';

var log4js = global.log4js || require('log4js'),
	util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	express = require('express'),
	request = require('supertest'),
	DefaultConfig = require('../../app-server/config'),
	validation = require('express-validation'),
	CommandValidationError = require('../../command/validation-error'),
	RestServer = require('../server'),
	ResourceEndpoint = require('../endpoints/resource-endpoint');

var appDescriptor = {
		name: 'Test server',
		version: '0.1.0-TEST'
	},
	config = new DefaultConfig({
		'http.port': 21314
	});

describe('restak > rest > server', function() {

	describe('#handleError', function(){

		it('should handle a express-validation error', function(done) {

			var server = new RestServer(appDescriptor, config, [], []),
				error = new validation.ValidationError([{
					field: 'field',
					location: 'body',
					messages: ['An error message'],
					types: ['any.required']
				}], { status: 400 }),
				req = null,
				res = {},
				nextCalled = 0,
				next = function(){ nextCalled++; };

			res.status = function(code){
				res._status = code;
				return res;
			};
			res.json = function(json){
				res._content = json;
				return res;
			};
			res.send = function(content){
				res._content = content;
				return res;
			};

			server.handleError(error, req, res, next);

			// err, req, res, next

			expect(res._status).to.equal(400);

			var payload = res._content.payload;
			expect(payload).to.not.be.null;
			expect(payload['validation-errors']).to.have.deep.members([{ 
				field: 'field',
				location: 'body',
				messages: [ 'An error message' ],
				types: [ 'any.required' ] 
			}]);

			done();
		});

		it('should handle a CommandValidationError', function(done) {

			var server = new RestServer(appDescriptor, config, [], []),
				error = new CommandValidationError('any.error', 'An error message', 'field'),
				req = null,
				res = {},
				nextCalled = 0,
				next = function(){ nextCalled++; };

			res.status = function(code){
				res._status = code;
				return res;
			};
			res.json = function(json){
				res._content = json;
				return res;
			};
			res.send = function(content){
				res._content = content;
				return res;
			};

			server.handleError(error, req, res, next);

			expect(res._status).to.equal(400);

			var payload = res._content.payload;
			expect(payload).to.not.be.null;
			expect(payload['validation-errors']).to.have.deep.members([{ 
				field: 'field',
				messages: [ 'An error message' ],
				types: [ 'any.error' ] 
			}]);

			done();
		});
	});

	describe('#registerApp', function(){

		var TestEndpoint = function(){
			ResourceEndpoint.apply(this, [log4js.getLogger('test'), '/testpath']);
			this.path = '/testpath';
		};
		util.inherits(TestEndpoint, ResourceEndpoint);

		TestEndpoint.prototype.getPayload = function(req, callback){
			callback(null, {});
		};

		it('should register the server at the default /api', function(done) {

			var server = new RestServer(appDescriptor, config, [new TestEndpoint()], []);

			var rootApp = express();
			server.registerApp(rootApp);

			request(rootApp)
				.get('/api/testpath')
				.expect(200)
				.end(function(err, res){
					done(err);
				});
		});

		it('should register the server at the custom /custom-api', function(done) {

			var cfg = new DefaultConfig({
				'http.port': 21314,
				'urlPrefix': '/custom-api'
			});

			var server = new RestServer(appDescriptor, cfg, [new TestEndpoint()], []);

			var rootApp = express();
			server.registerApp(rootApp);

			request(rootApp)
				.get('/custom-api/testpath')
				.expect(200)
				.end(function(err, res){
					done(err);
				});
		});

	});

	describe('#buildResourceLink', function(){

		it('should return a link with the default /api', function(done){

			var server = new RestServer(appDescriptor, config, [], []),
				req = {
					protocol: 'https',
					headers: {
						host: 'www.test.com'
					}
				},
				link = server.buildResourceLink(req, 'Link name', 'Link rel', '/testpath');

			expect(link).to.not.be.null;
			expect(link).to.have.property('name', 'Link name');
			expect(link).to.have.property('rel', 'Link rel');
			expect(link).to.have.property('url', 'https://www.test.com/api/testpath');

			done();
		});

		it('should return a link with the custom /custom-api', function(done){

			var cfg = new DefaultConfig({
					'urlPrefix': '/custom-api'
				}),
				server = new RestServer(appDescriptor, cfg, [], []),
				req = {
					protocol: 'https',
					headers: {
						host: 'www.test.com'
					}
				},
				link = server.buildResourceLink(req, 'Link name', 'Link rel', '/testpath');

			expect(link).to.not.be.null;
			expect(link).to.have.property('name', 'Link name');
			expect(link).to.have.property('rel', 'Link rel');
			expect(link).to.have.property('url', 'https://www.test.com/custom-api/testpath');

			done();
		});

	});
});