'use strict';

var log4js = global.log4js || require('log4js'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	util = require('util'),
	request = require('supertest'),
	RestServer = require('../../server'),
	ResourceQueryEndpoint = require('../resource-query-endpoint');

var logger = log4js.getLogger('test'),
	serverConfig = {
		port: 12000,
		appName: 'test app',
		appVersion: '1.0'
	};

describe('rest > endpoints > resource-query-endpoint', function() {

	describe('#onRequest', function(){

		it('should return what the query returns', function(done) {

			var queryExecutor = {
				executeQuery: function(qKey, qr, callback) {
					callback(null, { 
						filter: '',
						pageSize: 10,
						pageCount: 1,
						page: 1,
						totalCount: 1,
						items: [{ x: 'a' }]
					});
				}
			};

			var endpoint = new ResourceQueryEndpoint(logger, '/testpath', 'test-query');
			endpoint.queryExecutor = queryExecutor;

			var server = new RestServer(serverConfig, [endpoint]);

			request(server.app)
				.get('/testpath')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res){
					expect(err).to.be.null;
					expect(res.body).to.deep.equal({
						application: { appName: 'test app', appVersion: '1.0' },
						payload: { x: 'a' },
						messages: []
					});
					done();
				});
		});

		it('should return an error if the query returns an error', function(done) {

			var queryExecutor = {
				executeQuery: function(qKey, qr, callback) {
					callback('An error occurred in the query');
				}
			};

			var endpoint = new ResourceQueryEndpoint(logger, '/testpath', 'test-query');
			endpoint.queryExecutor = queryExecutor;

			var server = new RestServer(serverConfig, [endpoint]);

			request(server.app)
				.get('/testpath')
				.expect('Content-Type', /json/)
				.expect(500)
				.end(function(err, res){
					expect(err).to.be.null;
					expect(res.body).to.deep.equal({ 
						application: { appName: 'test app', appVersion: '1.0' },
						payload: null,
						messages: [ { type: 'error', message: 'An error occurred in the query' } ] 
  					});
					done();
				});
		});

		it('should return a 404 if the query returns no items', function(done) {

			var queryExecutor = {
				executeQuery: function(qKey, qr, callback) {
					callback(null, { 
						filter: '',
						pageSize: 10,
						pageCount: 1,
						page: 1,
						totalCount: 0,
						items: []
					});
				}
			};

			var endpoint = new ResourceQueryEndpoint(logger, '/testpath', 'test-query');
			endpoint.queryExecutor = queryExecutor;

			var server = new RestServer(serverConfig, [endpoint]);

			request(server.app)
				.get('/testpath')
				.expect(404)
				.end(function(err, res){
					expect(err).to.be.null;
					done();
				});
		});

		it('should still work if the query returns multiple items', function(done) {

			var queryExecutor = {
				executeQuery: function(qKey, qr, callback) {
					callback(null, { 
						filter: '',
						pageSize: 10,
						pageCount: 1,
						page: 1,
						totalCount: 2,
						items: [{ x: 'a' }, { x: 'b' }]
					});
				}
			};

			var endpoint = new ResourceQueryEndpoint(logger, '/testpath', 'test-query');
			endpoint.queryExecutor = queryExecutor;

			var server = new RestServer(serverConfig, [endpoint]);

			request(server.app)
				.get('/testpath')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res){
					expect(err).to.be.null;
					expect(res.body).to.deep.equal({
						application: { appName: 'test app', appVersion: '1.0' },
						payload: { x: 'a' },
						messages: []
					});
					done();
				});
		});

		it('should call the middleware', function(done){

			var queryExecutor = {
				executeQuery: function(qKey, qr, callback) {
					callback(null, { 
						filter: '',
						pageSize: 10,
						pageCount: 1,
						page: 1,
						totalCount: 1,
						items: [{ x: 'a' }]
					});
				}
			};

			var endpoint = new ResourceQueryEndpoint(logger, '/testpath', 'test-query'),
				middlewareCalled = false;
			endpoint.registerMiddleware(function(req, res, next){
				middlewareCalled = true;
				next();
			});
			endpoint.queryExecutor = queryExecutor;

			var server = new RestServer(serverConfig, [endpoint]);

			request(server.app)
				.get('/testpath')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res){
					expect(err).to.be.null;
					expect(middlewareCalled).to.equal(true);
					done();
				});

		});
	});

});