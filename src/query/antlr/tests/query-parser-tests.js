'use strict';

var expect = require('chai').expect,
	assert = require('chai').assert,
	util = require('util'),
	QueryParser = require('../query-parser'),
	QueryListener = require('../generated/QueryListener').QueryListener;


var MockQueryListener = function() {
	QueryListener.apply(this, arguments);
};
util.inherits(MockQueryListener, QueryListener);


describe('query > antlr > query-parser', function() {
	
	it('should work with a null request', function(done) {

		var listener = new MockQueryListener(),
			parser = new QueryParser(listener, null);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with minimal request parameters', function(done) {

		var queryRequest = {};

		var listener = new MockQueryListener(),
			parser = new QueryParser(listener, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with whitespace for a filter', function(done) {

		var queryRequest = {
			filter: '   '
		};

		var listener = new MockQueryListener(),
			parser = new QueryParser(listener, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should fail with an invalid filter', function(done) {

		var queryRequest = {
			filter: 'INVALID QUERY'
		};

		var listener = new MockQueryListener(),
			parser = new QueryParser(listener, queryRequest);

		expect(parser.isValid()).to.equal(false);
		expect(parser.getErrorMessages()).to.have.deep.members([
			'line 1:8 missing {\'=\', \'>\', \'<\', \'<=\', \'>=\', \'<>\', \'!=\', \'~\'} at \'QUERY\''
		]);
		
		done();
	});

	it('should work with filter: foo < 3.5', function(done) {

		var queryRequest = {
			filter: 'foo < 3.5'
		};

		var listener = new MockQueryListener(),
			parser = new QueryParser(listener, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo = 3.5', function(done) {

		var queryRequest = {
			filter: 'foo = 3.5'
		};

		var listener = new MockQueryListener(),
			parser = new QueryParser(listener, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo > 3.5', function(done) {

		var queryRequest = {
			filter: 'foo > 3.5'
		};

		var listener = new MockQueryListener(),
			parser = new QueryParser(listener, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo <= 3.5', function(done) {

		var queryRequest = {
			filter: 'foo <= 3.5'
		};

		var listener = new MockQueryListener(),
			parser = new QueryParser(listener, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo >= 3.5', function(done) {

		var queryRequest = {
			filter: 'foo >= 3.5'
		};

		var listener = new MockQueryListener(),
			parser = new QueryParser(listener, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo <> 3.5', function(done) {

		var queryRequest = {
			filter: 'foo <> 3.5'
		};

		var listener = new MockQueryListener(),
			parser = new QueryParser(listener, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo != 3.5', function(done) {

		var queryRequest = {
			filter: 'foo != 3.5'
		};

		var listener = new MockQueryListener(),
			parser = new QueryParser(listener, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo>3.5', function(done) {

		var queryRequest = {
			filter: 'foo>3.5'
		};

		var listener = new MockQueryListener(),
			parser = new QueryParser(listener, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo > -3.5', function(done) {

		var queryRequest = {
			filter: 'foo > -3.5'
		};

		var listener = new MockQueryListener(),
			parser = new QueryParser(listener, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo > 3', function(done) {

		var queryRequest = {
			filter: 'foo > 3'
		};

		var listener = new MockQueryListener(),
			parser = new QueryParser(listener, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo ~ "test"', function(done) {

		var queryRequest = {
			filter: 'foo ~ "test"'
		};

		var listener = new MockQueryListener(),
			parser = new QueryParser(listener, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo ~ \'test\'', function(done) {

		var queryRequest = {
			filter: 'foo ~ \'test\''
		};

		var listener = new MockQueryListener(),
			parser = new QueryParser(listener, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo ~ \'test\\\'s\'', function(done) {

		var queryRequest = {
			filter: 'foo ~ \'test\\\'s\''
		};

		var listener = new MockQueryListener(),
			parser = new QueryParser(listener, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo ~ "test\\"s"', function(done) {

		var queryRequest = {
			filter: 'foo ~ "test\\"s"'
		};

		var listener = new MockQueryListener(),
			parser = new QueryParser(listener, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo = \'test with multiple words\'', function(done) {

		var queryRequest = {
			filter: 'foo = \'test with multiple words\''
		};

		var listener = new MockQueryListener(),
			parser = new QueryParser(listener, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo.bar = \'test\'', function(done) {

		var queryRequest = {
			filter: 'foo.bar = \'test\''
		};

		var listener = new MockQueryListener(),
			parser = new QueryParser(listener, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo < 3 AND bar > 3', function(done) {

		var queryRequest = {
			filter: 'foo < 3 AND bar > 3'
		};

		var listener = new MockQueryListener(),
			parser = new QueryParser(listener, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo < 3 AND bar > 3 AND foobar = 5', function(done) {

		var queryRequest = {
			filter: 'foo < 3 AND bar > 3 AND foobar = 5'
		};

		var listener = new MockQueryListener(),
			parser = new QueryParser(listener, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo < 3 OR bar > 3', function(done) {

		var queryRequest = {
			filter: 'foo < 3 OR bar > 3'
		};

		var listener = new MockQueryListener(),
			parser = new QueryParser(listener, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo < 3 OR bar > 3 OR foobar = 5', function(done) {

		var queryRequest = {
			filter: 'foo < 3 OR bar > 3 OR foobar = 5'
		};

		var listener = new MockQueryListener(),
			parser = new QueryParser(listener, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: (foo < 3 OR bar > 3) AND foo.bar = 5', function(done) {

		var queryRequest = {
			filter: '(foo < 3 OR bar > 3) AND foo.bar = 5'
		};

		var listener = new MockQueryListener(),
			parser = new QueryParser(listener, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: (foo < 3 AND bar > 3) OR foo.bar = 5', function(done) {

		var queryRequest = {
			filter: '(foo < 3 AND bar > 3) OR foo.bar = 5'
		};

		var listener = new MockQueryListener(),
			parser = new QueryParser(listener, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo.bar = 5 AND (foo < 3 OR bar > 3)', function(done) {

		var queryRequest = {
			filter: 'foo.bar = 5 AND (foo < 3 OR bar > 3)'
		};

		var listener = new MockQueryListener(),
			parser = new QueryParser(listener, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo.bar = 5 OR (foo < 3 AND bar > 3)', function(done) {

		var queryRequest = {
			filter: 'foo.bar = 5 OR (foo < 3 AND bar > 3)'
		};

		var listener = new MockQueryListener(),
			parser = new QueryParser(listener, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo.bar = 5 OR ( foo < 3 AND bar > 3 )', function(done) {

		var queryRequest = {
			filter: 'foo.bar = 5 OR ( foo < 3 AND bar > 3 )'
		};

		var listener = new MockQueryListener(),
			parser = new QueryParser(listener, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});
	
});