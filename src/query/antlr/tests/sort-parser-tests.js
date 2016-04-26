'use strict';

var expect = require('chai').expect,
	assert = require('chai').assert,
	util = require('util'),
	SortParser = require('../sort-parser'),
	SortListener = require('../generated/SortListener').SortListener;


var MockSortListener = function() {
	SortListener.apply(this, arguments);
};
util.inherits(MockSortListener, SortListener);


describe.only('sort > antlr > sort-parser', function() {
	
	it('should work with a null request', function(done) {

		var listener = new MockSortListener(),
			parser = new SortParser(listener, null);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with minimal request parameters', function(done) {

		var sortRequest = {};

		var listener = new MockSortListener(),
			parser = new SortParser(listener, sortRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with whitespace for a sort', function(done) {

		var sortRequest = {
			sort: '   '
		};

		var listener = new MockSortListener(),
			parser = new SortParser(listener, sortRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should fail with an invalid direction', function(done) {

		var sortRequest = {
			sort: 'INVALID,SORT'
		};

		var listener = new MockSortListener(),
			parser = new SortParser(listener, sortRequest);

		expect(parser.isValid()).to.equal(false);
		expect(parser.getErrorMessages()).to.have.deep.members([
			'line 1:8 mismatched input \'SORT\' expecting {null, null}'
		]);
		
		done();
	});

	it('should work with sort: name', function(done) {

		var sortRequest = {
			sort: 'name'
		};

		var listener = new MockSortListener(),
			parser = new SortParser(listener, sortRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with sort: name;', function(done) {

		var sortRequest = {
			sort: 'name;'
		};

		var listener = new MockSortListener(),
			parser = new SortParser(listener, sortRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with sort: name,ASC', function(done) {

		var sortRequest = {
			sort: 'name,ASC'
		};

		var listener = new MockSortListener(),
			parser = new SortParser(listener, sortRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with sort: name,ASC;', function(done) {

		var sortRequest = {
			sort: 'name,ASC;'
		};

		var listener = new MockSortListener(),
			parser = new SortParser(listener, sortRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with sort: name, ASC', function(done) {

		var sortRequest = {
			sort: 'name, ASC'
		};

		var listener = new MockSortListener(),
			parser = new SortParser(listener, sortRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with sort: name,DESC', function(done) {

		var sortRequest = {
			sort: 'name,DESC'
		};

		var listener = new MockSortListener(),
			parser = new SortParser(listener, sortRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with sort: name, DESC', function(done) {

		var sortRequest = {
			sort: 'name, DESC'
		};

		var listener = new MockSortListener(),
			parser = new SortParser(listener, sortRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with sort: name;description', function(done) {

		var sortRequest = {
			sort: 'name;description'
		};

		var listener = new MockSortListener(),
			parser = new SortParser(listener, sortRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with sort: name,ASC; description, DESC', function(done) {

		var sortRequest = {
			sort: 'name,ASC; description, DESC'
		};

		var listener = new MockSortListener(),
			parser = new SortParser(listener, sortRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with sort: name,ASC; description, DESC;', function(done) {

		var sortRequest = {
			sort: 'name,ASC; description, DESC;'
		};

		var listener = new MockSortListener(),
			parser = new SortParser(listener, sortRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});
});