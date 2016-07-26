'use strict';

var log4js = require('log4js'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	expectLink = require('../../../tests/test-util').expectLink,
	request = require('supertest'),
	DefaultConfig = require('../../../app-server/config'),
	RestServer = require('../../../rest/server'),
	jobEndpoints = require('../job-endpoints'),
	CollectionEndpoint = jobEndpoints.CollectionEndpoint,
	ResourceGetEndpoint = jobEndpoints.ResourceGetEndpoint,
	ResourcePostEndpoint = jobEndpoints.ResourcePostEndpoint;

var logger = log4js.getLogger('test'),
	appDescriptor = {
		name: 'test app',
		version: '1.0'
	},
	serverConfig = new DefaultConfig({
		port: 12000
	});

var job = {
	id: '1234',
	name: 'Test Job'
};

describe('scheduler > rest-endpoints > jobs > collection', function() {

	describe('#onRequest', function(){

		it('should return a 200 with the correct links', function(done){

			var queryExecutor = {
					executeQuery: function(qKey, qr, callback) {

						callback(null, { 
							filter: qr.filter,
							pageSize: qr.pageSize,
							pageCount: 1,
							page: 1,
							totalCount: 1,
							items: [job]
						});
					}
				};

			var endpoint = new CollectionEndpoint();
			endpoint.queryExecutor = queryExecutor;
			var server = new RestServer(appDescriptor, serverConfig, [endpoint]);

			request(server.app)
				.get('/jobs')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res){
					expect(err).to.be.null;

					var item = res.body.payload.items[0];
					expect(item).to.have.deep.property('links.length', 2);
					expectLink(item.links[0], 'Test Job', 'job', '/api/jobs/1234');
					expectLink(item.links[1], 'Test Job Status Collection', 'job-statuses', '/api/jobs/status?filter=jobId=%221234%22');

					done();
				});
		});
	});
});

describe('scheduler > rest-endpoints > jobs > resource-get', function() {

	describe('#onRequest', function(){

		it('should return a 200 with the correct links', function(done){

			var queryFilter = null,
				queryExecutor = {
				executeQuery: function(qKey, qr, callback) {

					queryFilter = qr.filter + '';

					callback(null, { 
						filter: qr.filter,
						pageSize: qr.pageSize,
						pageCount: 1,
						page: 1,
						totalCount: 1,
						items: [job]
					});
				}
			};

			var endpoint = new ResourceGetEndpoint();
			endpoint.queryExecutor = queryExecutor;
			var server = new RestServer(appDescriptor, serverConfig, [endpoint]);

			request(server.app)
				.get('/jobs/1234')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res){
					expect(err).to.be.null;
					
					expect(queryFilter).to.equal('_id=\'1234\'');
					
					var item = res.body.payload;
					expect(item).to.have.deep.property('links.length', 2);
					expectLink(item.links[0], 'Test Job', 'job', '/api/jobs/1234');
					expectLink(item.links[1], 'Test Job Status Collection', 'job-statuses', '/api/jobs/status?filter=jobId=%221234%22');
					
					done();
				});
		});

	});
});

describe('scheduler > rest-endpoints > jobs > resource-post', function() {

	describe('#onRequest', function(){

		it('should return a 201 with the correct link', function(done){

			var data = null,
				command = {
					validation: {},
					execute: function(instr, callback){
						data = instr.data;
						callback(null, { 
							id: '1234-1',
							jobId: '1234',
							name: 'Test Job'
						});
					}
				};

			var endpoint = new ResourcePostEndpoint(command),
				server = new RestServer(appDescriptor, serverConfig, [endpoint]);

			request(server.app)
				.post('/jobs/1234')
				.expect('Content-Type', /json/)
				.expect(201)
				.end(function(err, res){
					expect(err).to.be.null;
					
					expect(data).to.deep.equal({
						jobId: '1234',
						params: null
					});
					
					var item = res.body.payload;
					expectLink(item, 'Test Job Status', 'job-status', '/api/jobs/status?filter=id=%221234-1%22');

					done();
				});
		});

		it('should pass the parameters object', function(done){

			var requestData = {
					params: {
						arg0: 'a',
						arg1: 'b'
					}
				},
				data = null,
				command = {
					validation: {},
					execute: function(instr, callback){
						data = instr.data;
						callback(null, { 
							id: '1234-1',
							jobId: '1234',
							name: 'Test Job'
						});
					}
				};

			var endpoint = new ResourcePostEndpoint(command),
				server = new RestServer(appDescriptor, serverConfig, [endpoint]);

			request(server.app)
				.post('/jobs/1234')
				.expect('Content-Type', /json/)
				.expect(201)
				.send(requestData)
				.end(function(err, res){
					expect(err).to.be.null;
					
					expect(data).to.deep.equal({
						jobId: '1234',
						params: {
							arg0: 'a',
							arg1: 'b'
						}
					});
					
					var item = res.body.payload;
					expectLink(item, 'Test Job Status', 'job-status', '/api/jobs/status?filter=id=%221234-1%22');

					done();
				});
		});

	});
});