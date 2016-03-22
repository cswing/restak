'use strict';

var log4js = require('log4js'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	urlUtil = require('url'),
	request = require('supertest'),
	RestServer = require('../../server'),
	CollectionEndpoint = require('../collection-endpoint');

var logger = log4js.getLogger('test'),
	serverConfig = {
		port: 12000,
		appName: 'test app',
		appVersion: '1.0'
	};

describe('rest > endpoints > collection-endpoint', function() {

	describe('#buildQueryRequest', function(){

		it('should work with a null request', function(done) {
			
			var ep = new CollectionEndpoint(log4js.getLogger('tests'), '/test', {}),
				qr = ep.buildQueryRequest(null);

			expect(qr).to.deep.equal({filter: '', page: 1, pageSize: 25 });

			done();
		});

		it('should default an invalid page', function(done) {
			
			var ep = new CollectionEndpoint(log4js.getLogger('tests'), '/test', {}),
				qr = ep.buildQueryRequest({ url: '/tests?page=INVALID' });

			expect(qr).to.deep.equal({filter: '', page: 1, pageSize: 25 });

			done();
		});		

		it('should default an invalid pageSize', function(done) {
			
			var ep = new CollectionEndpoint(log4js.getLogger('tests'), '/test', {}),
				qr = ep.buildQueryRequest({ url: '/tests?pageSize=INVALID' });

			expect(qr).to.deep.equal({filter: '', page: 1, pageSize: 25 });

			done();
		});

		it('should apply the correct values', function(done) {
			
			var ep = new CollectionEndpoint(log4js.getLogger('tests'), '/test', {}),
				qr = ep.buildQueryRequest({ url: '/tests?page=2&pageSize=10&filter=foo' });

			expect(qr).to.deep.equal({filter: 'foo', page: 2, pageSize: 10 });

			done();
		});
	});

	describe('#onRequest', function(){

		//it('should provide first, next... links')

		var expectLink = function(link, name, rel, path){
			expect(link).to.not.be.null;
			expect(link).to.have.deep.property('name', name);
			expect(link).to.have.deep.property('rel', rel);

			var parsedUrl = urlUtil.parse(link.url);
			expect(parsedUrl.path).to.equal(path);
		};

		it('should provide links with the filter in the url', function(done){

			var queryExecutor = {
				executeQuery: function(qKey, qr, callback) {
					callback(null, { 
						filter: qr.filter,
						pageSize: 1,
						pageCount: 5,
						page: 3,
						totalCount: 5,
						items: [{ x: 'a' }]
					});
				}
			};

			var endpoint = new CollectionEndpoint(logger, '/testpath', 'test-query');
			endpoint.queryExecutor = queryExecutor;

			var server = new RestServer([endpoint], serverConfig);

			request(server.app)
				.get('/testpath?filter=test~"foo"')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res){
					expect(err).to.be.null;
					
					var payload = res.body.payload;

					expectLink(payload.links[0], 'First', 'first', '/testpath?page=1&pageSize=1&filter=test~%22foo%22&');
					expectLink(payload.links[1], 'Previous', 'prev', '/testpath?page=2&pageSize=1&filter=test~%22foo%22&');
					expectLink(payload.links[2], 'Next', 'next', '/testpath?page=4&pageSize=1&filter=test~%22foo%22&');
					expectLink(payload.links[3], 'Last', 'last', '/testpath?page=5&pageSize=1&filter=test~%22foo%22&');
					
					done();
				});
		});

	});
});