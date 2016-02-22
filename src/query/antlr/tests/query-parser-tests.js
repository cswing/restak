'use strict';

var expect = require('chai').expect,
	assert = require('chai').assert,
	util = require('util'),
	QueryParser = require('../query-parser'),
	QueryVisitor = require('../generated/QueryVisitor').QueryVisitor;


var MockQueryVisitor = function() {
	QueryVisitor.apply(this, arguments);
};
util.inherits(MockQueryVisitor, QueryVisitor);

MockQueryVisitor.prototype.visitParse = function(ctx) {
	
};

MockQueryVisitor.prototype.visitCondition = function(ctx) {
	
};

MockQueryVisitor.prototype.visitPredicate = function(ctx) {
	
};

MockQueryVisitor.prototype.visitExpression = function(ctx) {
	
};

MockQueryVisitor.prototype.visitExpression_list = function(ctx) {
	
};

MockQueryVisitor.prototype.visitComparison_operator = function(ctx) {
	
};


describe('query > antlr > query-parser', function() {
	
	it('should work with a null request', function(done) {

		var visitor = new MockQueryVisitor(),
			parser = new QueryParser(visitor, null);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with minimal request parameters', function(done) {

		var queryRequest = {};

		var visitor = new MockQueryVisitor(),
			parser = new QueryParser(visitor, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with whitespace for a filter', function(done) {

		var queryRequest = {
			filter: '   '
		};

		var visitor = new MockQueryVisitor(),
			parser = new QueryParser(visitor, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should fail with an invalid filter', function(done) {

		var queryRequest = {
			filter: 'INVALID QUERY'
		};

		var visitor = new MockQueryVisitor(),
			parser = new QueryParser(visitor, queryRequest);

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

		var visitor = new MockQueryVisitor(),
			parser = new QueryParser(visitor, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo = 3.5', function(done) {

		var queryRequest = {
			filter: 'foo = 3.5'
		};

		var visitor = new MockQueryVisitor(),
			parser = new QueryParser(visitor, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo > 3.5', function(done) {

		var queryRequest = {
			filter: 'foo > 3.5'
		};

		var visitor = new MockQueryVisitor(),
			parser = new QueryParser(visitor, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo <= 3.5', function(done) {

		var queryRequest = {
			filter: 'foo <= 3.5'
		};

		var visitor = new MockQueryVisitor(),
			parser = new QueryParser(visitor, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo >= 3.5', function(done) {

		var queryRequest = {
			filter: 'foo >= 3.5'
		};

		var visitor = new MockQueryVisitor(),
			parser = new QueryParser(visitor, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo <> 3.5', function(done) {

		var queryRequest = {
			filter: 'foo <> 3.5'
		};

		var visitor = new MockQueryVisitor(),
			parser = new QueryParser(visitor, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo != 3.5', function(done) {

		var queryRequest = {
			filter: 'foo != 3.5'
		};

		var visitor = new MockQueryVisitor(),
			parser = new QueryParser(visitor, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo>3.5', function(done) {

		var queryRequest = {
			filter: 'foo>3.5'
		};

		var visitor = new MockQueryVisitor(),
			parser = new QueryParser(visitor, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo > -3.5', function(done) {

		var queryRequest = {
			filter: 'foo > -3.5'
		};

		var visitor = new MockQueryVisitor(),
			parser = new QueryParser(visitor, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo > 3', function(done) {

		var queryRequest = {
			filter: 'foo > 3'
		};

		var visitor = new MockQueryVisitor(),
			parser = new QueryParser(visitor, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo ~ "test"', function(done) {

		var queryRequest = {
			filter: 'foo ~ "test"'
		};

		var visitor = new MockQueryVisitor(),
			parser = new QueryParser(visitor, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo ~ \'test\'', function(done) {

		var queryRequest = {
			filter: 'foo ~ \'test\''
		};

		var visitor = new MockQueryVisitor(),
			parser = new QueryParser(visitor, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo ~ \'test\\\'s\'', function(done) {

		var queryRequest = {
			filter: 'foo ~ \'test\\\'s\''
		};

		var visitor = new MockQueryVisitor(),
			parser = new QueryParser(visitor, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo ~ "test\\"s"', function(done) {

		var queryRequest = {
			filter: 'foo ~ "test\\"s"'
		};

		var visitor = new MockQueryVisitor(),
			parser = new QueryParser(visitor, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo = \'test with multiple words\'', function(done) {

		var queryRequest = {
			filter: 'foo = \'test with multiple words\''
		};

		var visitor = new MockQueryVisitor(),
			parser = new QueryParser(visitor, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo.bar = \'test\'', function(done) {

		var queryRequest = {
			filter: 'foo.bar = \'test\''
		};

		var visitor = new MockQueryVisitor(),
			parser = new QueryParser(visitor, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo < 3 AND bar > 3', function(done) {

		var queryRequest = {
			filter: 'foo < 3 AND bar > 3'
		};

		var visitor = new MockQueryVisitor(),
			parser = new QueryParser(visitor, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo < 3 AND bar > 3 AND foobar = 5', function(done) {

		var queryRequest = {
			filter: 'foo < 3 AND bar > 3 AND foobar = 5'
		};

		var visitor = new MockQueryVisitor(),
			parser = new QueryParser(visitor, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo < 3 OR bar > 3', function(done) {

		var queryRequest = {
			filter: 'foo < 3 OR bar > 3'
		};

		var visitor = new MockQueryVisitor(),
			parser = new QueryParser(visitor, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo < 3 OR bar > 3 OR foobar = 5', function(done) {

		var queryRequest = {
			filter: 'foo < 3 OR bar > 3 OR foobar = 5'
		};

		var visitor = new MockQueryVisitor(),
			parser = new QueryParser(visitor, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: (foo < 3 OR bar > 3) AND foo.bar = 5', function(done) {

		var queryRequest = {
			filter: '(foo < 3 OR bar > 3) AND foo.bar = 5'
		};

		var visitor = new MockQueryVisitor(),
			parser = new QueryParser(visitor, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: (foo < 3 AND bar > 3) OR foo.bar = 5', function(done) {

		var queryRequest = {
			filter: '(foo < 3 AND bar > 3) OR foo.bar = 5'
		};

		var visitor = new MockQueryVisitor(),
			parser = new QueryParser(visitor, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo.bar = 5 AND (foo < 3 OR bar > 3)', function(done) {

		var queryRequest = {
			filter: 'foo.bar = 5 AND (foo < 3 OR bar > 3)'
		};

		var visitor = new MockQueryVisitor(),
			parser = new QueryParser(visitor, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo.bar = 5 OR (foo < 3 AND bar > 3)', function(done) {

		var queryRequest = {
			filter: 'foo.bar = 5 OR (foo < 3 AND bar > 3)'
		};

		var visitor = new MockQueryVisitor(),
			parser = new QueryParser(visitor, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});

	it('should work with filter: foo.bar = 5 OR ( foo < 3 AND bar > 3 )', function(done) {

		var queryRequest = {
			filter: 'foo.bar = 5 OR ( foo < 3 AND bar > 3 )'
		};

		var visitor = new MockQueryVisitor(),
			parser = new QueryParser(visitor, queryRequest);

		expect(parser.isValid()).to.equal(true);
		expect(parser.getErrorMessages()).to.have.deep.members([]);
		done();
	});
	
});