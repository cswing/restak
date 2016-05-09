'use strict';

var log4js = global.log4js || require('log4js'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	util = require('util'),
	urlUtil = require('url'),
	request = require('supertest'),
	DefaultConfig = require('../../../app-server/config'),
	RestServer = require('../../server'),
	CollectionEndpoint = require('../collection-endpoint');

var logger = log4js.getLogger('test'),
	serverConfig = new DefaultConfig({
		port: 12000,
		appName: 'test app',
		appVersion: '1.0'
	});

describe('rest > endpoints > collection-endpoint', function() {

	describe('#buildQueryRequest', function(){

		it('should work with a null request', function(done) {
			
			var ep = new CollectionEndpoint(log4js.getLogger('tests'), '/test', {}),
				qr = ep.buildQueryRequest(null);

			expect(qr).to.deep.equal({filter: '', sort: '', page: 1, pageSize: 25 });

			done();
		});

		it('should default an invalid page', function(done) {
			
			var ep = new CollectionEndpoint(log4js.getLogger('tests'), '/test', {}),
				qr = ep.buildQueryRequest({ url: '/tests?page=INVALID' });

			expect(qr).to.deep.equal({filter: '', sort: '', page: 1, pageSize: 25 });

			done();
		});		

		it('should default an invalid pageSize', function(done) {
			
			var ep = new CollectionEndpoint(log4js.getLogger('tests'), '/test', {}),
				qr = ep.buildQueryRequest({ url: '/tests?pageSize=INVALID' });

			expect(qr).to.deep.equal({filter: '', sort: '', page: 1, pageSize: 25 });

			done();
		});

		it('should apply the correct values', function(done) {
			
			var ep = new CollectionEndpoint(log4js.getLogger('tests'), '/test', {}),
				qr = ep.buildQueryRequest({ url: '/tests?page=2&pageSize=10&filter=foo&sort=foo,DESC' });

			expect(qr).to.deep.equal({filter: 'foo', sort: 'foo,DESC', page: 2, pageSize: 10 });

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

			var server = new RestServer(serverConfig, [endpoint]);

			request(server.app)
				.get('/testpath?filter=test~"foo"')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res){
					expect(err).to.be.null;
					
					var payload = res.body.payload;

					expectLink(payload.links[0], 'First', 'first', '/api/testpath?page=1&pageSize=1&filter=test~%22foo%22&');
					expectLink(payload.links[1], 'Previous', 'prev', '/api/testpath?page=2&pageSize=1&filter=test~%22foo%22&');
					expectLink(payload.links[2], 'Next', 'next', '/api/testpath?page=4&pageSize=1&filter=test~%22foo%22&');
					expectLink(payload.links[3], 'Last', 'last', '/api/testpath?page=5&pageSize=1&filter=test~%22foo%22&');
					
					done();
				});
		});

		it('should provide links with the sort in the url', function(done){

			var queryExecutor = {
				executeQuery: function(qKey, qr, callback) {
					callback(null, { 
						filter: qr.filter,
						sort: qr.sort,
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

			var server = new RestServer(serverConfig, [endpoint]);

			request(server.app)
				.get('/testpath?sort=foo%2CDESC')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res){
					expect(err).to.be.null;
					
					var payload = res.body.payload;

					expectLink(payload.links[0], 'First', 'first', '/api/testpath?page=1&pageSize=1&sort=foo%2CDESC&');
					expectLink(payload.links[1], 'Previous', 'prev', '/api/testpath?page=2&pageSize=1&sort=foo%2CDESC&');
					expectLink(payload.links[2], 'Next', 'next', '/api/testpath?page=4&pageSize=1&sort=foo%2CDESC&');
					expectLink(payload.links[3], 'Last', 'last', '/api/testpath?page=5&pageSize=1&sort=foo%2CDESC&');
					
					done();
				});
		});

		var OverridesCollection = function(fixedFilter, processor){
			CollectionEndpoint.apply(this, [logger, '/testpath', 'test-query']);
			this.fixedFilter = fixedFilter || null;
			this.itemPostProcessor = processor || function(itm) {return itm;};
		};
		util.inherits(OverridesCollection, CollectionEndpoint);

		OverridesCollection.prototype.getFixedFilter = function(req){
			return this.fixedFilter;
		};

		OverridesCollection.prototype.postProcessItem = function(item, context){
			return this.itemPostProcessor(item, context);
		};

		it('should apply the fixed filter to a query without a filter', function(done){

			var queryFilter = null;

			var queryExecutor = {
				executeQuery: function(qKey, qr, callback) {
					
					queryFilter = qr.filter + ''; // create a new string, because the filter property is updated before we test for it.

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

			var endpoint = new OverridesCollection('fixed=1', null);
			endpoint.queryExecutor = queryExecutor;

			var server = new RestServer(serverConfig, [endpoint]);

			request(server.app)
				.get('/testpath')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res){
					expect(err).to.be.null;					
					expect(queryFilter).to.equal('fixed=1');

					var payload = res.body.payload;

					expect(payload.filter).to.equal('');

					done();
				});
		});

		it('should apply the fixed filter to a query with a filter', function(done){

			var queryFilter = null;

			var queryExecutor = {
				executeQuery: function(qKey, qr, callback) {
					
					queryFilter = qr.filter + ''; // create a new string, because the filter property is updated before we test for it.

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

			var endpoint = new OverridesCollection('fixed=1', null);
			endpoint.queryExecutor = queryExecutor;

			var server = new RestServer(serverConfig, [endpoint]);

			request(server.app)
				.get('/testpath?filter=test~"foo"')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res){
					expect(err).to.be.null;
					expect(queryFilter).to.equal('(fixed=1) AND (test~"foo")');

					var payload = res.body.payload;

					expect(payload.filter).to.equal('test~"foo"');

					done();
				});
		});

		it('should use the post processor', function(done){

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

			var itemProcessor = function(itm, ctx){

				itm.foo = {
					bar: 'test'
				};

				return itm;
			};

			var endpoint = new OverridesCollection(null, itemProcessor);
			endpoint.queryExecutor = queryExecutor;

			var server = new RestServer(serverConfig, [endpoint]);

			request(server.app)
				.get('/testpath')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res){
					expect(err).to.be.null;
					
					var payload = res.body.payload,
						item = payload.items[0];

					expect(item).to.not.be.null;
					expect(item).to.have.deep.property('foo.bar', 'test');

					done();
				});
		});

		it('should call the middleware', function(done){

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

			var endpoint = new CollectionEndpoint(logger, '/testpath', 'test-query'),
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