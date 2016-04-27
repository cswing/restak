'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	queryUtil = require('../query-util');

describe('query > query-util', function() {

	describe('#buildResult', function(){

		it('should work with a null request', function(done) {

			var qResult = queryUtil.buildResult(null, 9);

			expect(qResult).to.have.property('filter', '');
			expect(qResult).to.have.property('sort', '');
			expect(qResult).to.have.property('page', 1);
			expect(qResult).to.have.property('pageSize', 25);
			expect(qResult).to.have.property('pageCount', 1);
			expect(qResult).to.have.property('totalCount', 9);
			
			done();
		});

		it('should work with an empty request', function(done) {

			var qResult = queryUtil.buildResult({}, 9);

			expect(qResult).to.have.property('filter', '');
			expect(qResult).to.have.property('sort', '');
			expect(qResult).to.have.property('page', 1);
			expect(qResult).to.have.property('pageSize', 25);
			expect(qResult).to.have.property('pageCount', 1);
			expect(qResult).to.have.property('totalCount', 9);
			
			done();
		});

		it('should work with a custom page size that evenly divides into total size', function(done) {
			
			var request = {
					pageSize: 3
				},
				qResult = queryUtil.buildResult(request, 9);

			expect(qResult).to.have.property('filter', '');
			expect(qResult).to.have.property('sort', '');
			expect(qResult).to.have.property('page', 1);
			expect(qResult).to.have.property('pageSize', 3);
			expect(qResult).to.have.property('pageCount', 3);
			expect(qResult).to.have.property('totalCount', 9);
			
			done();
		});

		it('should work with a custom page size that does not evenly divides into total size', function(done) {
			
			var request = {
					pageSize: 4
				},
				qResult = queryUtil.buildResult(request, 9);

			expect(qResult).to.have.property('filter', '');
			expect(qResult).to.have.property('sort', '');
			expect(qResult).to.have.property('page', 1);
			expect(qResult).to.have.property('pageSize', 4);
			expect(qResult).to.have.property('pageCount', 3);
			expect(qResult).to.have.property('totalCount', 9);
			
			done();
		});

		it('should work with a negative custom page size', function(done) {

			var request = {
					pageSize: -3
				},
				qResult = queryUtil.buildResult(request, 9);

			expect(qResult).to.have.property('filter', '');
			expect(qResult).to.have.property('sort', '');
			expect(qResult).to.have.property('page', 1);
			expect(qResult).to.have.property('pageSize', 25);
			expect(qResult).to.have.property('pageCount', 1);
			expect(qResult).to.have.property('totalCount', 9);
			
			done();
		});

		it('should work with a negative custom page', function(done) {

			var request = {
					page: -3
				},
				qResult = queryUtil.buildResult(request, 9);

			expect(qResult).to.have.property('filter', '');
			expect(qResult).to.have.property('sort', '');
			expect(qResult).to.have.property('page', 1);
			expect(qResult).to.have.property('pageSize', 25);
			expect(qResult).to.have.property('pageCount', 1);
			expect(qResult).to.have.property('totalCount', 9);
			
			done();
		});

		it('should work with a custom page greater than total pages', function(done) {
			
			var request = {
					page: 10
				},
				qResult = queryUtil.buildResult(request, 9);

			expect(qResult).to.have.property('filter', '');
			expect(qResult).to.have.property('sort', '');
			expect(qResult).to.have.property('page', 1);
			expect(qResult).to.have.property('pageSize', 25);
			expect(qResult).to.have.property('pageCount', 1);
			expect(qResult).to.have.property('totalCount', 9);

			done();
		});

		it('should work with a custom page & page size - I', function(done) {
			
			var request = {
					pageSize: 3,
					page: 2
				},
				qResult = queryUtil.buildResult(request, 9);

			expect(qResult).to.have.property('filter', '');
			expect(qResult).to.have.property('sort', '');
			expect(qResult).to.have.property('page', 2);
			expect(qResult).to.have.property('pageSize', 3);
			expect(qResult).to.have.property('pageCount', 3);
			expect(qResult).to.have.property('totalCount', 9);

			done();
		});

		it('should work with a custom page & page size - II', function(done) {
			
			var request = {
					pageSize: 4,
					page: 2
				},
				qResult = queryUtil.buildResult(request, 9);

			expect(qResult).to.have.property('filter', '');
			expect(qResult).to.have.property('sort', '');
			expect(qResult).to.have.property('page', 2);
			expect(qResult).to.have.property('pageSize', 4);
			expect(qResult).to.have.property('pageCount', 3);
			expect(qResult).to.have.property('totalCount', 9);

			done();
		});

		it('should work with a custom page & page size for the last page - I', function(done) {
			
			var request = {
					pageSize: 3,
					page: 3
				},
				qResult = queryUtil.buildResult(request, 9);

			expect(qResult).to.have.property('filter', '');
			expect(qResult).to.have.property('sort', '');
			expect(qResult).to.have.property('page', 3);
			expect(qResult).to.have.property('pageSize', 3);
			expect(qResult).to.have.property('pageCount', 3);
			expect(qResult).to.have.property('totalCount', 9);

			done();
		});

		it('should work with a custom page & page size for the last page - II', function(done) {
			
			var request = {
					pageSize: 4,
					page: 3
				},
				qResult = queryUtil.buildResult(request, 9);

			expect(qResult).to.have.property('filter', '');
			expect(qResult).to.have.property('sort', '');
			expect(qResult).to.have.property('page', 3);
			expect(qResult).to.have.property('pageSize', 4);
			expect(qResult).to.have.property('pageCount', 3);
			expect(qResult).to.have.property('totalCount', 9);

			done();
		});

		it('should work with a filter', function(done) {
			
			var request = {
					filter: 'foo > 7'
				},
				qResult = queryUtil.buildResult(request, 1);

			expect(qResult).to.have.property('filter', 'foo > 7');
			expect(qResult).to.have.property('sort', '');
			expect(qResult).to.have.property('page', 1);
			expect(qResult).to.have.property('pageSize', 25);
			expect(qResult).to.have.property('pageCount', 1);
			expect(qResult).to.have.property('totalCount', 1);

			done();	
		});

		it('should work with a pageSize = \'ALL\'', function(done) {
			
			var request = {
					pageSize: 'ALL'
				},
				qResult = queryUtil.buildResult(request, 9);

			expect(qResult).to.have.property('filter', '');
			expect(qResult).to.have.property('sort', '');
			expect(qResult).to.have.property('page', 1);
			expect(qResult).to.have.property('pageSize', 9);
			expect(qResult).to.have.property('pageCount', 1);
			expect(qResult).to.have.property('totalCount', 9);

			done();	
		});

		it('should work with a sort', function(done) {
			
			var request = {
					sort: 'foo,DESC'
				},
				qResult = queryUtil.buildResult(request, 9);

			expect(qResult).to.have.property('filter', '');
			expect(qResult).to.have.property('sort', 'foo,DESC');
			expect(qResult).to.have.property('page', 1);
			expect(qResult).to.have.property('pageSize', 25);
			expect(qResult).to.have.property('pageCount', 1);
			expect(qResult).to.have.property('totalCount', 9);

			done();	
		});
	});

});