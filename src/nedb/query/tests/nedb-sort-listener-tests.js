'use strict';

var expect = require('chai').expect,
	assert = require('chai').assert,
	NeDBSortListener = require('../nedb-sort-listener'),
	SortParser = require('../../../query/antlr/sort-parser');

describe('nedb > query > sort-listener', function() {

	describe('query-request edge cases', function(){

		it('should be valid with a null request', function(done) {
			
			var request = null,
				listener = new NeDBSortListener(),
				parser = new SortParser(listener, request);

			expect(parser.isValid()).to.equal(true);
			
			done();
		});

		it('should be valid with minimal request parameters', function(done) {

			var request = {},
				listener = new NeDBSortListener(),
				parser = new SortParser(listener, request);

			expect(parser.isValid()).to.equal(true);
			
			done();
		});

		it('should be valid with whitespace for a sort', function(done) {

			var request = {
					sort: '   '
				},
				listener = new NeDBSortListener(),
				parser = new SortParser(listener, request);

			expect(parser.isValid()).to.equal(true);
			
			done();
		});

		it('should be in valid when the sort is invalid', function(done) {

			var request = {
					sort: 'INVALID,SORT'
				},
				listener = new NeDBSortListener(),
				parser = new SortParser(listener, request);

			expect(parser.isValid()).to.equal(false);
			
			done();
		});
		
	});

	describe('asc', function(){

		it('should default to asc sort', function(done) {

			var request = {
					sort: 'name'
				},
				listener = new NeDBSortListener(),
				parser = new SortParser(listener, request),
				sortObject = parser.tree.sortObject;
			
			expect(parser.isValid()).to.equal(true);
			expect(sortObject).to.deep.equal({name: 1});

			done();
		});	

		it('should sort name asc', function(done) {

			var request = {
					sort: 'name,ASC'
				},
				listener = new NeDBSortListener(),
				parser = new SortParser(listener, request),
				sortObject = parser.tree.sortObject;
			
			expect(parser.isValid()).to.equal(true);
			expect(sortObject).to.deep.equal({name: 1});

			done();
		});

		it('should sort name asc - case insensitive on asc', function(done) {

			var request = {
					sort: 'name, asc'
				},
				listener = new NeDBSortListener(),
				parser = new SortParser(listener, request),
				sortObject = parser.tree.sortObject;
			
			expect(parser.isValid()).to.equal(true);
			expect(sortObject).to.deep.equal({name: 1});

			done();
		});

		// it should sort on deep properties foo.bar
	});


	// desc
	describe('desc', function(){

		it('should sort name desc', function(done) {

			var request = {
					sort: 'name,DESC'
				},
				listener = new NeDBSortListener(),
				parser = new SortParser(listener, request),
				sortObject = parser.tree.sortObject;
			
			expect(parser.isValid()).to.equal(true);
			expect(sortObject).to.deep.equal({name: -1});

			done();
		});

		it('should sort name desc - case insensitive on desc', function(done) {

			var request = {
					sort: 'name, desc'
				},
				listener = new NeDBSortListener(),
				parser = new SortParser(listener, request),
				sortObject = parser.tree.sortObject;
			
			expect(parser.isValid()).to.equal(true);
			expect(sortObject).to.deep.equal({name: -1});

			done();
		});

		// it should sort on deep properties foo.bar
	});

	describe('multiple sorts', function(){

		it('should sort 2 properties correctly - pt 1', function(done) {

			var request = {
					sort: 'name,ASC;value,DESC;'
				},
				listener = new NeDBSortListener(),
				parser = new SortParser(listener, request),
				sortObject = parser.tree.sortObject;
			
			expect(parser.isValid()).to.equal(true);
			expect(sortObject).to.deep.equal({name: 1, value: -1});

			// The order of keys is important
			var keys = Object.keys(sortObject);
			expect(keys[0]).to.equal('name');
			expect(keys[1]).to.equal('value');

			done();
		});

		it('should sort 2 properties correctly - pt 2', function(done) {

			var request = {
					sort: 'value,ASC;name,DESC;'
				},
				listener = new NeDBSortListener(),
				parser = new SortParser(listener, request),
				sortObject = parser.tree.sortObject;
			
			expect(parser.isValid()).to.equal(true);
			expect(sortObject).to.deep.equal({name: -1, value: 1});

			// The order of keys is important
			var keys = Object.keys(sortObject);
			expect(keys[0]).to.equal('value');
			expect(keys[1]).to.equal('name');
			
			done();
		});

	});

});