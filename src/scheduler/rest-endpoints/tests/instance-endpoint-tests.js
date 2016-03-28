'use strict';

var log4js = require('log4js'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	expectLink = require('../../../tests/test-util').expectLink,
	request = require('supertest'),
	RestServer = require('../../../rest/server'),
	instanceEndpoints = require('../instance-endpoints'),
	CollectionEndpoint = instanceEndpoints.CollectionEndpoint,
	ResourceGetEndpoint = instanceEndpoints.ResourceGetEndpoint;

var logger = log4js.getLogger('test'),
	serverConfig = {
		port: 12000,
		appName: 'test app',
		appVersion: '1.0'
	};

var instance = {
	instanceId: '1234-0',
	jobId: '1234',
	name: 'Test Job'
};

describe('scheduler > rest-endpoints > instances > collection', function() {

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
							items: [instance]
						});
					}
				};

			var endpoint = new CollectionEndpoint();
			endpoint.queryExecutor = queryExecutor;
			var server = new RestServer([endpoint], serverConfig);

			request(server.app)
				.get('/scheduler/jobs/1234/instances')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res){
					expect(err).to.be.null;

					expect(queryFilter).to.equal('jobId=\'1234\'');

					var item = res.body.payload.items[0];
					expect(item).to.have.deep.property('links.length', 3);
					expectLink(item.links[0], 'Test Job', 'job', '/scheduler/jobs/1234');
					expectLink(item.links[1], 'Test Job Instances', 'job-instances', '/scheduler/jobs/1234/instances');
					expectLink(item.links[2], 'Test Job Instance', 'job-instance', '/scheduler/jobs/1234/instances/1234-0');

					done();
				});
		});
	});
});

describe('scheduler > rest-endpoints > instances > resource-get', function() {

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
						items: [instance]
					});
				}
			};

			var endpoint = new ResourceGetEndpoint();
			endpoint.queryExecutor = queryExecutor;
			var server = new RestServer([endpoint], serverConfig);

			request(server.app)
				.get('/scheduler/jobs/1234/instances/1234-0')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res){
					expect(err).to.be.null;
					
					expect(queryFilter).to.equal('jobId=\'1234\' AND _id=\'1234-0\'');
					
					var item = res.body.payload;
					expect(item).to.have.deep.property('links.length', 3);
					expectLink(item.links[0], 'Test Job', 'job', '/scheduler/jobs/1234');
					expectLink(item.links[1], 'Test Job Instances', 'job-instances', '/scheduler/jobs/1234/instances');
					expectLink(item.links[2], 'Test Job Instance', 'job-instance', '/scheduler/jobs/1234/instances/1234-0');

					done();
				});
		});

	});
});