'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	QueryExecutor = require('../query-executor'),
	QueryNotFoundError = require('../index').QueryNotFoundError;

describe.only('query > query-executor', function() {

	describe('#execute', function(){

		it('should execute the query and return the data in result', function(done){

			var qryResult = { filter: 'foo=1', page: 1, totalCount: 10 },
				qry = {
					execute: function(ci, cb){
						cb(null, qryResult);
					}
				},
				queryFactory = {
					getQuery: function(key){
						return qry;
					}
				},
				queryExecutor = new QueryExecutor(queryFactory);

				queryExecutor.executeQuery('test', { filter: 'foo=1' }, function(err, result){
					expect(err).to.be.null;
					expect(result).to.not.be.null;
					expect(result).to.deep.equal(qryResult);

					done();
				});
		});

		it('should return a QueryNotFoundError', function(done){

			var queryFactory = {
					getQuery: function(key){
						throw new QueryNotFoundError(key);
					}
				},
				queryExecutor = new QueryExecutor(queryFactory);

			queryExecutor.executeQuery('test', { filter: 'foo=1' }, function(err, result){

				expect(err).to.not.be.null;
				expect(err).to.have.property('message', 'Unknown query: test');

				done();
			});
		});

		it('should handle an error returned by the query', function(done){

			var qryResult = { filter: 'foo=1', page: 1, totalCount: 10 },
				qry = {
					execute: function(ci, cb){
						cb('An unexpected error', null);
					}
				},
				queryFactory = {
					getQuery: function(key){
						return qry;
					}
				},
				queryExecutor = new QueryExecutor(queryFactory);

			queryExecutor.executeQuery('test', { filter: 'foo=1' }, function(err, result){

				expect(err).to.equal('An unexpected error');
				expect(result).to.be.null;

				done();
			});
		});

	});
});