'use strict';

var log4js = require('log4js'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	expectLink = require('../../../tests/test-util').expectLink,
	request = require('supertest'),
	DefaultConfig = require('../../../app-server/config'),
	RestServer = require('../../../rest/server'),
	historyEndpoints = require('../history-endpoints'),
	CollectionEndpoint = historyEndpoints.CollectionEndpoint,
	ResourceGetEndpoint = historyEndpoints.ResourceGetEndpoint;

var logger = log4js.getLogger('test'),
	appDescriptor = {
		name: 'test app',
		version: '1.0'
	},
	serverConfig = new DefaultConfig({
		port: 12000
	});

var instance = {
	instanceId: '1234-0',
	jobId: '1234',
	name: 'Test Job'
};

describe('scheduler > rest-endpoints > history > collection', function() {

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
			var server = new RestServer(appDescriptor, serverConfig, [endpoint]);

			request(server.app)
				.get('/jobs/1234/history')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res){
					expect(err).to.be.null;

					expect(queryFilter).to.equal('jobId=\'1234\' AND (status=\'ERROR\' OR status=\'COMPLETED\')');

					var item = res.body.payload.items[0];
					expect(item).to.have.deep.property('links.length', 3);
					expectLink(item.links[0], 'Test Job', 'job', '/api/jobs/1234');
					expectLink(item.links[1], 'Test Job History', 'job-history', '/api/jobs/1234/history');
					expectLink(item.links[2], 'Test Job History Instance', 'job-history-instance', '/api/jobs/1234/history/1234-0');

					done();
				});
		});
	});
});

describe('scheduler > rest-endpoints > history > resource-get', function() {

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
			var server = new RestServer(appDescriptor, serverConfig, [endpoint]);

			request(server.app)
				.get('/jobs/1234/history/1234-0')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res){
					expect(err).to.be.null;
					
					expect(queryFilter).to.equal('jobId=\'1234\' AND _id=\'1234-0\' AND (status=\'ERROR\' OR status=\'COMPLETED\')');
					
					var item = res.body.payload;
					expect(item).to.have.deep.property('links.length', 3);
					expectLink(item.links[0], 'Test Job', 'job', '/api/jobs/1234');
					expectLink(item.links[1], 'Test Job History', 'job-history', '/api/jobs/1234/history');
					expectLink(item.links[2], 'Test Job History Instance', 'job-history-instance', '/api/jobs/1234/history/1234-0');

					done();
				});
		});

	});
});