'use strict';

var expect = require('chai').expect,
	assert = require('chai').assert,
	util = require('util'),
	FilterParser = require('../filter-parser'),
	FilterListener = require('../generated/FilterListener').FilterListener;


var MockFilterListener = function() {
	FilterListener.apply(this, arguments);
};
util.inherits(MockFilterListener, FilterListener);


describe('filter > antlr > filter-parser', function() {
	
	it('should work with a null request', function(done) {

		var listener = new MockFilterListener(),
			parser = new FilterParser(listener, null);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with minimal request parameters', function(done) {

		var filterRequest = {};

		var listener = new MockFilterListener(),
			parser = new FilterParser(listener, filterRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with whitespace for a filter', function(done) {

		var filterRequest = {
			filter: '   '
		};

		var listener = new MockFilterListener(),
			parser = new FilterParser(listener, filterRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should fail with an invalid filter', function(done) {

		var filterRequest = {
			filter: 'INVALID QUERY'
		};

		var listener = new MockFilterListener(),
			parser = new FilterParser(listener, filterRequest);

		expect(parser.isValid()).to.equal(false);
		expect(parser.getErrorMessages()).to.have.deep.members([
			'line 1:8 missing {\'=\', \'>\', \'<\', \'<=\', \'>=\', \'<>\', \'!=\', \'~\'} at \'QUERY\''
		]);
		
		done();
	});

	it('should work with filter: foo < 3.5', function(done) {

		var filterRequest = {
			filter: 'foo < 3.5'
		};

		var listener = new MockFilterListener(),
			parser = new FilterParser(listener, filterRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo = 3.5', function(done) {

		var filterRequest = {
			filter: 'foo = 3.5'
		};

		var listener = new MockFilterListener(),
			parser = new FilterParser(listener, filterRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo > 3.5', function(done) {

		var filterRequest = {
			filter: 'foo > 3.5'
		};

		var listener = new MockFilterListener(),
			parser = new FilterParser(listener, filterRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo <= 3.5', function(done) {

		var filterRequest = {
			filter: 'foo <= 3.5'
		};

		var listener = new MockFilterListener(),
			parser = new FilterParser(listener, filterRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo >= 3.5', function(done) {

		var filterRequest = {
			filter: 'foo >= 3.5'
		};

		var listener = new MockFilterListener(),
			parser = new FilterParser(listener, filterRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo <> 3.5', function(done) {

		var filterRequest = {
			filter: 'foo <> 3.5'
		};

		var listener = new MockFilterListener(),
			parser = new FilterParser(listener, filterRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo != 3.5', function(done) {

		var filterRequest = {
			filter: 'foo != 3.5'
		};

		var listener = new MockFilterListener(),
			parser = new FilterParser(listener, filterRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo>3.5', function(done) {

		var filterRequest = {
			filter: 'foo>3.5'
		};

		var listener = new MockFilterListener(),
			parser = new FilterParser(listener, filterRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo > -3.5', function(done) {

		var filterRequest = {
			filter: 'foo > -3.5'
		};

		var listener = new MockFilterListener(),
			parser = new FilterParser(listener, filterRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo > 3', function(done) {

		var filterRequest = {
			filter: 'foo > 3'
		};

		var listener = new MockFilterListener(),
			parser = new FilterParser(listener, filterRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo ~ "test"', function(done) {

		var filterRequest = {
			filter: 'foo ~ "test"'
		};

		var listener = new MockFilterListener(),
			parser = new FilterParser(listener, filterRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo ~ \'test\'', function(done) {

		var filterRequest = {
			filter: 'foo ~ \'test\''
		};

		var listener = new MockFilterListener(),
			parser = new FilterParser(listener, filterRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo ~ \'test\\\'s\'', function(done) {

		var filterRequest = {
			filter: 'foo ~ \'test\\\'s\''
		};

		var listener = new MockFilterListener(),
			parser = new FilterParser(listener, filterRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo ~ "test\\"s"', function(done) {

		var filterRequest = {
			filter: 'foo ~ "test\\"s"'
		};

		var listener = new MockFilterListener(),
			parser = new FilterParser(listener, filterRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo = \'test with multiple words\'', function(done) {

		var filterRequest = {
			filter: 'foo = \'test with multiple words\''
		};

		var listener = new MockFilterListener(),
			parser = new FilterParser(listener, filterRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo.bar = \'test\'', function(done) {

		var filterRequest = {
			filter: 'foo.bar = \'test\''
		};

		var listener = new MockFilterListener(),
			parser = new FilterParser(listener, filterRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo < 3 AND bar > 3', function(done) {

		var filterRequest = {
			filter: 'foo < 3 AND bar > 3'
		};

		var listener = new MockFilterListener(),
			parser = new FilterParser(listener, filterRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo < 3 AND bar > 3 AND foobar = 5', function(done) {

		var filterRequest = {
			filter: 'foo < 3 AND bar > 3 AND foobar = 5'
		};

		var listener = new MockFilterListener(),
			parser = new FilterParser(listener, filterRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo < 3 OR bar > 3', function(done) {

		var filterRequest = {
			filter: 'foo < 3 OR bar > 3'
		};

		var listener = new MockFilterListener(),
			parser = new FilterParser(listener, filterRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo < 3 OR bar > 3 OR foobar = 5', function(done) {

		var filterRequest = {
			filter: 'foo < 3 OR bar > 3 OR foobar = 5'
		};

		var listener = new MockFilterListener(),
			parser = new FilterParser(listener, filterRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: (foo < 3 OR bar > 3) AND foo.bar = 5', function(done) {

		var filterRequest = {
			filter: '(foo < 3 OR bar > 3) AND foo.bar = 5'
		};

		var listener = new MockFilterListener(),
			parser = new FilterParser(listener, filterRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: (foo < 3 AND bar > 3) OR foo.bar = 5', function(done) {

		var filterRequest = {
			filter: '(foo < 3 AND bar > 3) OR foo.bar = 5'
		};

		var listener = new MockFilterListener(),
			parser = new FilterParser(listener, filterRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo.bar = 5 AND (foo < 3 OR bar > 3)', function(done) {

		var filterRequest = {
			filter: 'foo.bar = 5 AND (foo < 3 OR bar > 3)'
		};

		var listener = new MockFilterListener(),
			parser = new FilterParser(listener, filterRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo.bar = 5 OR (foo < 3 AND bar > 3)', function(done) {

		var filterRequest = {
			filter: 'foo.bar = 5 OR (foo < 3 AND bar > 3)'
		};

		var listener = new MockFilterListener(),
			parser = new FilterParser(listener, filterRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo.bar = 5 OR ( foo < 3 AND bar > 3 )', function(done) {

		var filterRequest = {
			filter: 'foo.bar = 5 OR ( foo < 3 AND bar > 3 )'
		};

		var listener = new MockFilterListener(),
			parser = new FilterParser(listener, filterRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});
	
});