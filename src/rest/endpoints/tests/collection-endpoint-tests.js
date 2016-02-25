'use strict';

var log4js = require('log4js'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	CollectionEndpoint = require('../collection-endpoint');

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
});