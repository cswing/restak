'use strict';

var expect = require('chai').expect,
	assert = require('chai').assert,
	ObjectSort = require('../object-sort').ObjectSort;

describe('query > object-query > object-sort', function() {

	var data = [
		{
			name: 'a name',
			value: 300
		},
		{
			name: 'b name',
			value: 0
		},
		{
			name: 'd name',
			value: 25.5
		},
		{
			name: 'c name',
			value: 10
		}
	];

	describe('quey-request edge cases', function(){

		it('should work with a null request', function(done) {
			
			var objSort = new ObjectSort(),
				result = objSort.sort(null, data);

			expect(result).to.have.deep.members(data);
			[0,1,2,3].forEach(function(idx){
				expect(result[idx]).to.deep.equal(data[idx]);
			});

			done();
		});

		it('should work with minimal request parameters', function(done) {

			var objSort = new ObjectSort(),
				result = objSort.sort({}, data);
				
			expect(result).to.have.deep.members(data);
			[0,1,2,3].forEach(function(idx){
				expect(result[idx]).to.deep.equal(data[idx]);
			});

			done();
		});

		it('should work with whitespace for a sort', function(done) {

			var queryRequest = {
					sort: '   '
				},
				objSort = new ObjectSort(),
				result = objSort.sort(queryRequest, data);
				
			expect(result).to.have.deep.members(data);
			[0,1,2,3].forEach(function(idx){
				expect(result[idx]).to.deep.equal(data[idx]);
			});

			done();
		});

		it('should not sort when the sort is invalid', function(done) {

			var queryRequest = {
					sort: 'INVALID QUERY'
				},
				objSort = new ObjectSort(),
				result = objSort.sort(queryRequest, data);

			expect(result).to.have.deep.members(data);
			[0,1,2,3].forEach(function(idx){
				expect(result[idx]).to.deep.equal(data[idx]);
			});
			
			done();
		});
	});

	describe('asc', function(){

		it('should default to asc sort', function(done) {

			var queryRequest = {
					sort: 'name'
				},
				objSort = new ObjectSort(),
				result = objSort.sort(queryRequest, data);

			expect(result).to.have.deep.members(data);

			expect(result[0]).to.deep.equal(data[0]);
			expect(result[1]).to.deep.equal(data[1]);
			expect(result[2]).to.deep.equal(data[3]);
			expect(result[3]).to.deep.equal(data[2]);
			
			done();
		});	

		it('should sort name asc', function(done) {

			var queryRequest = {
					sort: 'name,ASC'
				},
				objSort = new ObjectSort(),
				result = objSort.sort(queryRequest, data);

			expect(result).to.have.deep.members(data);

			expect(result[0]).to.deep.equal(data[0]);
			expect(result[1]).to.deep.equal(data[1]);
			expect(result[2]).to.deep.equal(data[3]);
			expect(result[3]).to.deep.equal(data[2]);
			
			done();
		});

		it('should sort name asc - case insensitive on asc', function(done) {

			var queryRequest = {
					sort: 'name, asc'
				},
				objSort = new ObjectSort(),
				result = objSort.sort(queryRequest, data);

			expect(result).to.have.deep.members(data);

			expect(result[0]).to.deep.equal(data[0]);
			expect(result[1]).to.deep.equal(data[1]);
			expect(result[2]).to.deep.equal(data[3]);
			expect(result[3]).to.deep.equal(data[2]);
			
			done();
		});

		it('should sort value asc', function(done) {

			var queryRequest = {
					sort: 'value,ASC'
				},
				objSort = new ObjectSort(),
				result = objSort.sort(queryRequest, data);

			expect(result).to.have.deep.members(data);

			expect(result[0]).to.deep.equal(data[1]);
			expect(result[1]).to.deep.equal(data[3]);
			expect(result[2]).to.deep.equal(data[2]);
			expect(result[3]).to.deep.equal(data[0]);
			
			done();
		});

		// it should sort on deep properties foo.bar
		// mixed strings and numbers
		// objects
	});

	// desc
	describe('desc', function(){

		it('should sort name desc', function(done) {

			var queryRequest = {
					sort: 'name, DESC'
				},
				objSort = new ObjectSort(),
				result = objSort.sort(queryRequest, data);

			expect(result).to.have.deep.members(data);

			expect(result[0]).to.deep.equal(data[2]);
			expect(result[1]).to.deep.equal(data[3]);
			expect(result[2]).to.deep.equal(data[1]);
			expect(result[3]).to.deep.equal(data[0]);
			
			done();
		});

		it('should sort name desc - case insensitive on desc', function(done) {

			var queryRequest = {
					sort: 'name, desc'
				},
				objSort = new ObjectSort(),
				result = objSort.sort(queryRequest, data);

			expect(result).to.have.deep.members(data);

			expect(result[0]).to.deep.equal(data[2]);
			expect(result[1]).to.deep.equal(data[3]);
			expect(result[2]).to.deep.equal(data[1]);
			expect(result[3]).to.deep.equal(data[0]);
			
			done();
		});	

		it('should sort value desc', function(done) {

			var queryRequest = {
					sort: 'value,DESC'
				},
				objSort = new ObjectSort(),
				result = objSort.sort(queryRequest, data);

			expect(result).to.have.deep.members(data);

			expect(result[0]).to.deep.equal(data[0]);
			expect(result[1]).to.deep.equal(data[2]);
			expect(result[2]).to.deep.equal(data[3]);
			expect(result[3]).to.deep.equal(data[1]);
			
			done();
		});

		// it should sort on deep properties foo.bar
	});


});