'use strict';

var expect = require('chai').expect,
	assert = require('chai').assert,
	InMemoryObjectQuery = require('../in-memory-object-query');

var data = [
	{ foo: 0 },
	{ foo: 1 },
	{ foo: 2 },
	{ foo: 3 },
	{ foo: 4 },
	{ foo: 5 },
	{ foo: 6 },
	{ foo: 7 },
	{ foo: 8 }
];

describe('query > object-query > in-memory-query', function() {

	describe('#execute', function(){

		it('should work with a null request', function(done) {
			
			var query = new InMemoryObjectQuery(data);
			query.execute(null, function(err, qResult){

				expect(err).to.be.null;
				expect(qResult).to.have.property('filter', '');
				expect(qResult).to.have.property('sort', '');
				expect(qResult).to.have.property('page', 1);
				expect(qResult).to.have.property('pageSize', 25);
				expect(qResult).to.have.property('pageCount', 1);
				expect(qResult).to.have.property('totalCount', 9);
				expect(qResult).to.have.property('items');
				expect(qResult).to.have.deep.property('items.length', 9);
				expect(qResult.items).to.have.deep.members(data);
	
				done();	
			});
		});

		it('should work with an empty request', function(done) {
			
			var query = new InMemoryObjectQuery(data);
			query.execute({}, function(err, qResult){

				expect(err).to.be.null;
				expect(qResult).to.have.property('filter', '');
				expect(qResult).to.have.property('sort', '');
				expect(qResult).to.have.property('page', 1);
				expect(qResult).to.have.property('pageSize', 25);
				expect(qResult).to.have.property('pageCount', 1);
				expect(qResult).to.have.property('totalCount', 9);
				expect(qResult).to.have.property('items');
				expect(qResult).to.have.deep.property('items.length', 9);
				expect(qResult.items).to.have.deep.members(data);

				done();	
			});
		});

		it('should return an error with an invalid filter', function(done) {
			
			var query = new InMemoryObjectQuery(data),
				request = {
					filter: 'INVALID QUERY'
				};

			query.execute(request, function(err, qResult){
				expect(err).to.not.be.null;
				expect(qResult).to.be.null;
				done();	
			});
		});

		it('should work with a custom page size', function(done) {
			
			var query = new InMemoryObjectQuery(data),
				request = {
					pageSize: 3
				};

			query.execute(request, function(err, qResult){

				expect(err).to.be.null;
				expect(qResult).to.have.property('filter', '');
				expect(qResult).to.have.property('sort', '');
				expect(qResult).to.have.property('page', 1);
				expect(qResult).to.have.property('pageSize', 3);
				expect(qResult).to.have.property('pageCount', 3);
				expect(qResult).to.have.property('totalCount', 9);
				expect(qResult).to.have.property('items');
				expect(qResult).to.have.deep.property('items.length', 3);
				expect(qResult.items).to.have.deep.members([data[0], data[1], data[2]]);

				done();	
			});
		});

		it('should work with a custom page & page size - I', function(done) {
			
			var query = new InMemoryObjectQuery(data),
				request = {
					pageSize: 3,
					page: 2
				};

			query.execute(request, function(err, qResult){

				expect(err).to.be.null;
				expect(qResult).to.have.property('filter', '');
				expect(qResult).to.have.property('sort', '');
				expect(qResult).to.have.property('page', 2);
				expect(qResult).to.have.property('pageSize', 3);
				expect(qResult).to.have.property('pageCount', 3);
				expect(qResult).to.have.property('totalCount', 9);
				expect(qResult).to.have.property('items');
				expect(qResult).to.have.deep.property('items.length', 3);
				expect(qResult.items).to.have.deep.members([data[3], data[4], data[5]]);

				done();	
			});
		});

		it('should work with a custom page & page size - II', function(done) {
			
			var query = new InMemoryObjectQuery(data),
				request = {
					pageSize: 4,
					page: 2
				};

			query.execute(request, function(err, qResult){

				expect(err).to.be.null;
				expect(qResult).to.have.property('filter', '');
				expect(qResult).to.have.property('sort', '');
				expect(qResult).to.have.property('page', 2);
				expect(qResult).to.have.property('pageSize', 4);
				expect(qResult).to.have.property('pageCount', 3);
				expect(qResult).to.have.property('totalCount', 9);
				expect(qResult).to.have.property('items');
				expect(qResult).to.have.deep.property('items.length', 4);
				expect(qResult.items).to.have.deep.members([data[4], data[5], data[6], data[7]]);

				done();	
			});
		});

		it('should work with a custom page & page size for the last page - I', function(done) {
			
			var query = new InMemoryObjectQuery(data),
				request = {
					pageSize: 3,
					page: 3
				};

			query.execute(request, function(err, qResult){

				expect(err).to.be.null;
				expect(qResult).to.have.property('filter', '');
				expect(qResult).to.have.property('sort', '');
				expect(qResult).to.have.property('page', 3);
				expect(qResult).to.have.property('pageSize', 3);
				expect(qResult).to.have.property('pageCount', 3);
				expect(qResult).to.have.property('totalCount', 9);
				expect(qResult).to.have.property('items');
				expect(qResult).to.have.deep.property('items.length', 3);
				expect(qResult.items).to.have.deep.members([data[6], data[7], data[8]]);

				done();	
			});
		});

		it('should work with a custom page & page size for the last page - II', function(done) {
			
			var query = new InMemoryObjectQuery(data),
				request = {
					pageSize: 4,
					page: 3
				};

			query.execute(request, function(err, qResult){

				expect(err).to.be.null;
				expect(qResult).to.have.property('filter', '');
				expect(qResult).to.have.property('sort', '');
				expect(qResult).to.have.property('page', 3);
				expect(qResult).to.have.property('pageSize', 4);
				expect(qResult).to.have.property('pageCount', 3);
				expect(qResult).to.have.property('totalCount', 9);
				expect(qResult).to.have.property('items');
				expect(qResult).to.have.deep.property('items.length', 1);
				expect(qResult.items).to.have.deep.members([data[8]]);

				done();	
			});
		});

		it('should work with a filter', function(done) {
			
			var query = new InMemoryObjectQuery(data),
				request = {
					filter: 'foo > 7'
				};

			query.execute(request, function(err, qResult){

				expect(err).to.be.null;
				expect(qResult).to.have.property('filter', 'foo > 7');
				expect(qResult).to.have.property('sort', '');
				expect(qResult).to.have.property('page', 1);
				expect(qResult).to.have.property('pageSize', 25);
				expect(qResult).to.have.property('pageCount', 1);
				expect(qResult).to.have.property('totalCount', 1);
				expect(qResult).to.have.property('items');
				expect(qResult).to.have.deep.property('items.length', 1);
				expect(qResult.items).to.have.deep.members([data[8]]);

				done();	
			});
		});

		it('should work with a pageSize = \'ALL\'', function(done) {
			
			var query = new InMemoryObjectQuery(data),
				request = {
					pageSize: 'ALL'
				};

			query.execute(request, function(err, qResult){

				expect(err).to.be.null;
				expect(qResult).to.have.property('filter', '');
				expect(qResult).to.have.property('sort', '');
				expect(qResult).to.have.property('page', 1);
				expect(qResult).to.have.property('pageSize', 9);
				expect(qResult).to.have.property('pageCount', 1);
				expect(qResult).to.have.property('totalCount', 9);
				expect(qResult).to.have.property('items');
				expect(qResult).to.have.deep.property('items.length', 9);
				expect(qResult.items).to.have.deep.members(data);

				done();	
			});
		});

		it('should work with a sort', function(done) {
			
			var query = new InMemoryObjectQuery(data),
				request = {
					sort: 'foo,DESC'
				};

			query.execute(request, function(err, qResult){

				expect(err).to.be.null;
				expect(qResult).to.have.property('filter', '');
				expect(qResult).to.have.property('sort', 'foo,DESC');
				expect(qResult).to.have.property('page', 1);
				expect(qResult).to.have.property('pageSize', 25);
				expect(qResult).to.have.property('pageCount', 1);
				expect(qResult).to.have.property('totalCount', 9);
				expect(qResult).to.have.property('items');
				expect(qResult).to.have.deep.property('items.length', 9);
				
				expect(qResult.items[0]).to.deep.equal(data[8]);
				expect(qResult.items[1]).to.deep.equal(data[7]);
				expect(qResult.items[2]).to.deep.equal(data[6]);
				expect(qResult.items[3]).to.deep.equal(data[5]);
				expect(qResult.items[4]).to.deep.equal(data[4]);
				expect(qResult.items[5]).to.deep.equal(data[3]);
				expect(qResult.items[6]).to.deep.equal(data[2]);
				expect(qResult.items[7]).to.deep.equal(data[1]);
				expect(qResult.items[8]).to.deep.equal(data[0]);

				done();	
			});
		});
	});
});