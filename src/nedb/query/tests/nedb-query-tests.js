'use strict';

var expect = require('chai').expect,
	assert = require('chai').assert,
	Datastore = require('nedb'),
	NeDBQuery = require('../nedb-query');

describe('nedb > query > nedb-query', function() {

	var db,
		docs = [
			{ _id: 0, foo: 0 },
			{ _id: 1, foo: 1 },
			{ _id: 2, foo: 2 },
			{ _id: 3, foo: 3 },
			{ _id: 4, foo: 4 },
			{ _id: 5, foo: 5 },
			{ _id: 6, foo: 6 },
			{ _id: 7, foo: 7 },
			{ _id: 8, foo: 8 }
		];

	before(function(done){

		db = new Datastore();
		db.loadDatabase(function (err) {
			if(err) return done(err);

			db.insert([docs], function (err, newDocs) {
				if(err) return done(err);
				done();
			});
		});
	});

	describe('#execute', function(){

		it('should work with a null request', function(done) {
			
			var query = new NeDBQuery(db);
			query.execute(null, function(err, qResult){

				expect(err).to.be.null;
				expect(qResult).to.have.property('filter', '');
				expect(qResult).to.have.property('page', 1);
				expect(qResult).to.have.property('pageSize', 25);
				expect(qResult).to.have.property('pageCount', 1);
				expect(qResult).to.have.property('totalCount', 9);
				expect(qResult).to.have.property('items');
				expect(qResult).to.have.deep.property('items.length', 9);
				expect(qResult.items).to.have.deep.members(docs);
	
				done();	
			});
		});

		it('should work with an empty request', function(done) {
			
			var query = new NeDBQuery(db);
			query.execute({}, function(err, qResult){

				expect(err).to.be.null;
				expect(qResult).to.have.property('filter', '');
				expect(qResult).to.have.property('page', 1);
				expect(qResult).to.have.property('pageSize', 25);
				expect(qResult).to.have.property('pageCount', 1);
				expect(qResult).to.have.property('totalCount', 9);
				expect(qResult).to.have.property('items');
				expect(qResult).to.have.deep.property('items.length', 9);
				expect(qResult.items).to.have.deep.members(docs);

				done();	
			});
		});

		it('should return an error with an invalid filter', function(done) {
			
			var query = new NeDBQuery(db),
				request = {
					filter: 'INVALID QUERY'
				};

			query.execute(request, function(err, qResult){
				expect(err).to.not.be.null;
				expect(qResult).to.be.null;
				done();	
			});
		});

		it('should return an error with an invalid sort', function(done) {
			
			var query = new NeDBQuery(db),
				request = {
					sort: 'INVALID,SORT'
				};

			query.execute(request, function(err, qResult){
				expect(err).to.not.be.null;
				expect(qResult).to.be.null;
				done();	
			});
		});

		it('should work with a custom page size', function(done) {
			
			var query = new NeDBQuery(db),
				request = {
					pageSize: 3
				};

			query.execute(request, function(err, qResult){

				expect(err).to.be.null;
				expect(qResult).to.have.property('filter', '');
				expect(qResult).to.have.property('page', 1);
				expect(qResult).to.have.property('pageSize', 3);
				expect(qResult).to.have.property('pageCount', 3);
				expect(qResult).to.have.property('totalCount', 9);
				expect(qResult).to.have.property('items');
				expect(qResult).to.have.deep.property('items.length', 3);
				expect(qResult.items).to.have.deep.members([docs[0], docs[1], docs[2]]);

				done();	
			});
		});

		it('should work with a custom page & page size - I', function(done) {
			
			var query = new NeDBQuery(db),
				request = {
					pageSize: 3,
					page: 2
				};

			query.execute(request, function(err, qResult){

				expect(err).to.be.null;
				expect(qResult).to.have.property('filter', '');
				expect(qResult).to.have.property('page', 2);
				expect(qResult).to.have.property('pageSize', 3);
				expect(qResult).to.have.property('pageCount', 3);
				expect(qResult).to.have.property('totalCount', 9);
				expect(qResult).to.have.property('items');
				expect(qResult).to.have.deep.property('items.length', 3);
				expect(qResult.items).to.have.deep.members([docs[3], docs[4], docs[5]]);

				done();	
			});
		});

		it('should work with a custom page & page size - II', function(done) {
			
			var query = new NeDBQuery(db),
				request = {
					pageSize: 4,
					page: 2
				};

			query.execute(request, function(err, qResult){

				expect(err).to.be.null;
				expect(qResult).to.have.property('filter', '');
				expect(qResult).to.have.property('page', 2);
				expect(qResult).to.have.property('pageSize', 4);
				expect(qResult).to.have.property('pageCount', 3);
				expect(qResult).to.have.property('totalCount', 9);
				expect(qResult).to.have.property('items');
				expect(qResult).to.have.deep.property('items.length', 4);
				expect(qResult.items).to.have.deep.members([docs[4], docs[5], docs[6], docs[7]]);

				done();	
			});
		});

		it('should work with a custom page & page size for the last page - I', function(done) {
			
			var query = new NeDBQuery(db),
				request = {
					pageSize: 3,
					page: 3
				};

			query.execute(request, function(err, qResult){

				expect(err).to.be.null;
				expect(qResult).to.have.property('filter', '');
				expect(qResult).to.have.property('page', 3);
				expect(qResult).to.have.property('pageSize', 3);
				expect(qResult).to.have.property('pageCount', 3);
				expect(qResult).to.have.property('totalCount', 9);
				expect(qResult).to.have.property('items');
				expect(qResult).to.have.deep.property('items.length', 3);
				expect(qResult.items).to.have.deep.members([docs[6], docs[7], docs[8]]);

				done();	
			});
		});

		it('should work with a custom page & page size for the last page - II', function(done) {
			
			var query = new NeDBQuery(db),
				request = {
					pageSize: 4,
					page: 3
				};

			query.execute(request, function(err, qResult){

				expect(err).to.be.null;
				expect(qResult).to.have.property('filter', '');
				expect(qResult).to.have.property('page', 3);
				expect(qResult).to.have.property('pageSize', 4);
				expect(qResult).to.have.property('pageCount', 3);
				expect(qResult).to.have.property('totalCount', 9);
				expect(qResult).to.have.property('items');
				expect(qResult).to.have.deep.property('items.length', 1);
				expect(qResult.items).to.have.deep.members([docs[8]]);

				done();	
			});
		});

		it('should work with a filter', function(done) {
			
			var query = new NeDBQuery(db),
				request = {
					filter: 'foo > 7'
				};

			query.execute(request, function(err, qResult){

				expect(err).to.be.null;
				expect(qResult).to.have.property('filter', 'foo > 7');
				expect(qResult).to.have.property('page', 1);
				expect(qResult).to.have.property('pageSize', 25);
				expect(qResult).to.have.property('pageCount', 1);
				expect(qResult).to.have.property('totalCount', 1);
				expect(qResult).to.have.property('items');
				expect(qResult).to.have.deep.property('items.length', 1);
				expect(qResult.items).to.have.deep.members([docs[8]]);

				done();	
			});
		});

		it('should work with a pageSize = \'ALL\'', function(done) {
			
			var query = new NeDBQuery(db),
				request = {
					pageSize: 'ALL'
				};

			query.execute(request, function(err, qResult){

				expect(err).to.be.null;
				expect(qResult).to.have.property('filter', '');
				expect(qResult).to.have.property('page', 1);
				expect(qResult).to.have.property('pageSize', 9);
				expect(qResult).to.have.property('pageCount', 1);
				expect(qResult).to.have.property('totalCount', 9);
				expect(qResult).to.have.property('items');
				expect(qResult).to.have.deep.property('items.length', 9);
				expect(qResult.items).to.have.deep.members(docs);

				done();	
			});
		});

		it('should use the object transform', function(done){

			var objectTransform = {
					transform: function(itm){
						return { _id: itm._id, foo: itm.foo, bar: 'a' };
					}
				},
				query = new NeDBQuery(db, objectTransform),
				request = {
					filter: 'foo=1'
				};
			
			query.execute(request, function(err, result){

				expect(err).to.be.null;
				expect(result).to.deep.equal({ 
					filter: 'foo=1',
					sort: '',
					pageSize: 25,
					page: 1,
					pageCount: 1,
					totalCount: 1,
					items: [ { _id: 1, foo: 1, bar: 'a' } ] 
				});

				done();
			});
		});

		it('should work with a sort', function(done) {
			
			var query = new NeDBQuery(db),
				request = {
					sort: 'foo,DESC'
				};

			query.execute(request, function(err, qResult){

				expect(err).to.be.null;
				expect(qResult).to.have.property('filter', '');
				expect(qResult).to.have.property('page', 1);
				expect(qResult).to.have.property('pageSize', 25);
				expect(qResult).to.have.property('pageCount', 1);
				expect(qResult).to.have.property('totalCount', 9);
				expect(qResult).to.have.property('items');
				expect(qResult).to.have.deep.property('items.length', 9);
				
				expect(qResult.items[0]).to.deep.equal(docs[8]);
				expect(qResult.items[1]).to.deep.equal(docs[7]);
				expect(qResult.items[2]).to.deep.equal(docs[6]);
				expect(qResult.items[3]).to.deep.equal(docs[5]);
				expect(qResult.items[4]).to.deep.equal(docs[4]);
				expect(qResult.items[5]).to.deep.equal(docs[3]);
				expect(qResult.items[6]).to.deep.equal(docs[2]);
				expect(qResult.items[7]).to.deep.equal(docs[1]);
				expect(qResult.items[8]).to.deep.equal(docs[0]);

				done();	
			});
		});
	});
});