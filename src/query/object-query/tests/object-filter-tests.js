'use strict';

var expect = require('chai').expect,
	assert = require('chai').assert,
	ObjectFilter = require('../object-filter').ObjectFilter;

describe('query > object-query > object-filter', function() {

	describe('quey-request edge cases', function(){

		it('should work with a null request', function(done) {
			
			var objFilter = new ObjectFilter(null);

			expect(objFilter.filter({foo: 3.5 })).to.equal(true);
			expect(objFilter.filter({foo: '3.5' })).to.equal(true);
			
			done();
		});

		it('should work with minimal request parameters', function(done) {

			var objFilter = new ObjectFilter({});

			expect(objFilter.filter({foo: 3.5 })).to.equal(true);
			expect(objFilter.filter({foo: '3.5' })).to.equal(true);
			
			done();
		});

		it('should work with whitespace for a filter', function(done) {

			var queryRequest = {
				filter: '   '
			};

			var objFilter = new ObjectFilter(queryRequest);

			expect(objFilter.filter({foo: 3.5 })).to.equal(true);
			expect(objFilter.filter({foo: '3.5' })).to.equal(true);
			
			done();
		});

		it('should filter everything when the filter is invalid', function(done) {

			var queryRequest = {
				filter: 'INVALID QUERY'
			};

			var objFilter = new ObjectFilter(queryRequest);

			expect(objFilter.filter({foo: 3.5 })).to.equal(false);
			expect(objFilter.filter({foo: '3.5' })).to.equal(false);
			
			done();
		});
	});
	
	describe('equals', function(){
		
		it('should work with filter: foo = 3.5', function(done) {

			var queryRequest = { filter: 'foo = 3.5' },
				objFilter = new ObjectFilter(queryRequest);

			expect(objFilter.filter({foo: 3.4 })).to.equal(false);
			expect(objFilter.filter({foo: 3.5 })).to.equal(true);
			expect(objFilter.filter({foo: '3.4' })).to.equal(false);
			expect(objFilter.filter({foo: '3.5' })).to.equal(false);
			expect(objFilter.filter({foo: 'string value' })).to.equal(false);

			done();
		});

		it('should work with filter: foo = 3 where foo is null on the object', function(done) {

			var queryRequest = { filter: 'foo = 3' },
				objFilter = new ObjectFilter(queryRequest);

			expect(objFilter.filter({})).to.equal(false);

			done();
		});
	});

	describe('less than', function(){

		it('should work with filter: foo < 3.5', function(done) {

			var queryRequest = { filter: 'foo < 3.5' },
				objFilter = new ObjectFilter(queryRequest);

			expect(objFilter.filter({foo: 3.4 })).to.equal(true);
			expect(objFilter.filter({foo: 3.5 })).to.equal(false);
			expect(objFilter.filter({foo: '3.4' })).to.equal(true); //???
			expect(objFilter.filter({foo: '3.5' })).to.equal(false);
			expect(objFilter.filter({foo: 'string value' })).to.equal(false);

			done();
		});

		it('should work with filter: foo < 3 where foo is null on the object', function(done) {

			var queryRequest = { filter: 'foo < 3' },
				objFilter = new ObjectFilter(queryRequest);

			expect(objFilter.filter({})).to.equal(false);

			done();
		});
	});

	describe('greater than', function(){
	
		it('should work with filter: foo > 3.5', function(done) {

			var queryRequest = { filter: 'foo > 3.5' },
				objFilter = new ObjectFilter(queryRequest);

			expect(objFilter.filter({foo: 3.6 })).to.equal(true);
			expect(objFilter.filter({foo: 3.5 })).to.equal(false);
			expect(objFilter.filter({foo: '3.6' })).to.equal(true); //???
			expect(objFilter.filter({foo: '3.5' })).to.equal(false);
			expect(objFilter.filter({foo: 'string value' })).to.equal(false);

			done();
		});

		it('should work with filter: foo>3.5', function(done) {

			var queryRequest = { filter: 'foo>3.5' },
				objFilter = new ObjectFilter(queryRequest);

			expect(objFilter.filter({foo: 3.6 })).to.equal(true);
			expect(objFilter.filter({foo: 3.5 })).to.equal(false);
			expect(objFilter.filter({foo: '3.6' })).to.equal(true);
			expect(objFilter.filter({foo: '3.5' })).to.equal(false);
			expect(objFilter.filter({foo: 'string value' })).to.equal(false);

			done();
		});

		it('should work with filter: foo > -3.5', function(done) {

			var queryRequest = { filter: 'foo > -3.5' },
				objFilter = new ObjectFilter(queryRequest);

			expect(objFilter.filter({foo: -3.4 })).to.equal(true);
			expect(objFilter.filter({foo: -3.5 })).to.equal(false);
			expect(objFilter.filter({foo: '-3.4' })).to.equal(true);
			expect(objFilter.filter({foo: '-3.5' })).to.equal(false);
			expect(objFilter.filter({foo: 'string value' })).to.equal(false);

			done();
		});

		it('should work with filter: foo > 3', function(done) {

			var queryRequest = { filter: 'foo > 3' },
				objFilter = new ObjectFilter(queryRequest);

			expect(objFilter.filter({foo: 4 })).to.equal(true);
			expect(objFilter.filter({foo: 3 })).to.equal(false);
			expect(objFilter.filter({foo: '4' })).to.equal(true);
			expect(objFilter.filter({foo: '3' })).to.equal(false);
			expect(objFilter.filter({foo: 'string value' })).to.equal(false);

			done();
		});

		it('should work with filter: foo > 3 where foo is null on the object', function(done) {

			var queryRequest = { filter: 'foo > 3' },
				objFilter = new ObjectFilter(queryRequest);

			expect(objFilter.filter({})).to.equal(false);

			done();
		});
	});

	describe('less than or equal', function(){
	
		it('should work with filter: foo <= 3.5', function(done) {

			var queryRequest = { filter: 'foo <= 3.5' },
				objFilter = new ObjectFilter(queryRequest);

			expect(objFilter.filter({foo: 3.6 })).to.equal(false);
			expect(objFilter.filter({foo: 3.5 })).to.equal(true);
			expect(objFilter.filter({foo: '3.6' })).to.equal(false);
			expect(objFilter.filter({foo: '3.5' })).to.equal(true); //???
			expect(objFilter.filter({foo: 'string value' })).to.equal(false);

			done();
		});

		it('should work with filter: foo <= 3 where foo is null on the object', function(done) {

			var queryRequest = { filter: 'foo <= 3' },
				objFilter = new ObjectFilter(queryRequest);

			expect(objFilter.filter({})).to.equal(false);

			done();
		});
	});

	describe('greater than or equal', function(){

		it('should work with filter: foo >= 3.5', function(done) {

			var queryRequest = { filter: 'foo >= 3.5' },
				objFilter = new ObjectFilter(queryRequest);

			expect(objFilter.filter({foo: 3.4 })).to.equal(false);
			expect(objFilter.filter({foo: 3.5 })).to.equal(true);
			expect(objFilter.filter({foo: '3.4' })).to.equal(false);
			expect(objFilter.filter({foo: '3.5' })).to.equal(true); // ???
			expect(objFilter.filter({foo: 'string value' })).to.equal(false);

			done();
		});

		it('should work with filter: foo >= 3 where foo is null on the object', function(done) {

			var queryRequest = { filter: 'foo >= 3' },
				objFilter = new ObjectFilter(queryRequest);

			expect(objFilter.filter({})).to.equal(false);

			done();
		});
	});

	describe('not equals', function(){	

		it('should work with filter: foo <> 3.5', function(done) {

			var queryRequest = { filter: 'foo <> 3.5' },
				objFilter = new ObjectFilter(queryRequest);

			expect(objFilter.filter({foo: 3.4 })).to.equal(true);
			expect(objFilter.filter({foo: 3.5 })).to.equal(false);
			expect(objFilter.filter({foo: '3.4' })).to.equal(true);
			expect(objFilter.filter({foo: '3.5' })).to.equal(true);
			expect(objFilter.filter({foo: 'string value' })).to.equal(true);

			done();
		});

		it('should work with filter: foo <> 3 where foo is null on the object', function(done) {

			var queryRequest = { filter: 'foo <> 3' },
				objFilter = new ObjectFilter(queryRequest);

			expect(objFilter.filter({})).to.equal(false);

			done();
		});

		it('should work with filter: foo != 3.5', function(done) {

			var queryRequest = { filter: 'foo != 3.5' },
				objFilter = new ObjectFilter(queryRequest);

			expect(objFilter.filter({foo: 3.4 })).to.equal(true);
			expect(objFilter.filter({foo: 3.5 })).to.equal(false);
			expect(objFilter.filter({foo: '3.4' })).to.equal(true);
			expect(objFilter.filter({foo: '3.5' })).to.equal(true);
			expect(objFilter.filter({foo: 'string value' })).to.equal(true);

			done();
		});

		it('should work with filter: foo != 3 where foo is null on the object', function(done) {

			var queryRequest = { filter: 'foo != 3' },
				objFilter = new ObjectFilter(queryRequest);

			expect(objFilter.filter({})).to.equal(false);

			done();
		});
	});
		
	describe('contains', function(){	
		
		it('should work with filter: foo ~ "test"', function(done) {

			var queryRequest = { filter: 'foo ~ "test"' },
				objFilter = new ObjectFilter(queryRequest);

			expect(objFilter.filter({foo: 'xyztestxyz' })).to.equal(true);
			expect(objFilter.filter({foo: 'xyz test xyz' })).to.equal(true);
			expect(objFilter.filter({foo: 'testxyz' })).to.equal(true);
			expect(objFilter.filter({foo: 'xyztest' })).to.equal(true);
			expect(objFilter.filter({foo: 'test' })).to.equal(true);
			expect(objFilter.filter({foo: 'te st' })).to.equal(false);
			expect(objFilter.filter({foo: 'fadfsd' })).to.equal(false);
			expect(objFilter.filter({foo: 'xyztESt' })).to.equal(true);

			done();
		});

		it('should work with filter: foo ~ \'test\\\'s\'', function(done) {

			var queryRequest = { filter: "foo ~ \'test\'s\'" },
				objFilter = new ObjectFilter(queryRequest);

			expect(objFilter.filter({foo: 'xyztest\'sxyz' })).to.equal(true);
			expect(objFilter.filter({foo: 'xyz test\'s xyz' })).to.equal(true);
			expect(objFilter.filter({foo: 'test\'sxyz' })).to.equal(true);
			expect(objFilter.filter({foo: 'xyztest\'s' })).to.equal(true);
			expect(objFilter.filter({foo: 'test\'s' })).to.equal(true);
			expect(objFilter.filter({foo: 'te st\'s' })).to.equal(false);
			expect(objFilter.filter({foo: 'fadfsd' })).to.equal(false);
			expect(objFilter.filter({foo: 'xyztESt\'s' })).to.equal(true);

			done();
		});

		it('should work with filter: foo ~ "test" where foo is null on the object', function(done) {

			var queryRequest = { filter: 'foo ~ "test"' },
				objFilter = new ObjectFilter(queryRequest);

			expect(objFilter.filter({})).to.equal(false);
			
			done();
		});

	});

	
	/*
	it('should work with filter: foo = \'test with multiple words\'', function(done) {

		var queryRequest = { filter: 'foo = \'test with multiple words\'' },
			objFilter = new ObjectFilter(queryRequest);

		expect(objFilter.filter({foo: 'test with multiple words' })).to.equal(true);
		
		//expect(objFilter.filter({foo: 'test with multiple words not equal' })).to.equal(false);
		//expect(objFilter.filter({foo: 'testwithmultiplewords' })).to.equal(false);

		done();
	});

	it('should work with filter: foo = "test with multiple words"', function(done) {

		var queryRequest = { filter: 'foo = \'test with multiple words\'' },
			objFilter = new ObjectFilter(queryRequest);

		expect(objFilter.filter({foo: 'test with multiple words' })).to.equal(true);
		
		//expect(objFilter.filter({foo: 'test with multiple words not equal' })).to.equal(false);
		//expect(objFilter.filter({foo: 'testwithmultiplewords' })).to.equal(false);

		done();
	});
	*/
	
/*
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
*/

	describe('logic', function(){	

		it('should work with filter: foo > 3 AND bar > 3', function(done) {

			var queryRequest = { filter: 'foo > 3 AND bar > 3' },
				objFilter = new ObjectFilter(queryRequest);

			expect(objFilter.filter({foo: 4, bar: 4 })).to.equal(true);
			expect(objFilter.filter({foo: 3, bar: 3 })).to.equal(false);
			expect(objFilter.filter({foo: 4, bar: 3 })).to.equal(false);
			expect(objFilter.filter({foo: 3, bar: 4 })).to.equal(false);
			
			done();
		});

		it('should work with filter: foo > 3 AND bar > 3 AND xyz > 3', function(done) {

			var queryRequest = { filter: 'foo > 3 AND bar > 3 AND xyz > 3' },
				objFilter = new ObjectFilter(queryRequest);

			expect(objFilter.filter({foo: 4, bar: 4, xyz: 4 })).to.equal(true);
			expect(objFilter.filter({foo: 4, bar: 4, xyz: 3 })).to.equal(false);
			expect(objFilter.filter({foo: 4, bar: 3, xyz: 3 })).to.equal(false);
			expect(objFilter.filter({foo: 4, bar: 3, xyz: 4 })).to.equal(false);
			expect(objFilter.filter({foo: 3, bar: 4, xyz: 4 })).to.equal(false);
			expect(objFilter.filter({foo: 3, bar: 3, xyz: 4 })).to.equal(false);
			expect(objFilter.filter({foo: 3, bar: 4, xyz: 3 })).to.equal(false);
			expect(objFilter.filter({foo: 3, bar: 3, xyz: 3 })).to.equal(false);
			
			done();
		});

		it('should work with filter: foo > 3 OR bar > 3', function(done) {

			var queryRequest = { filter: 'foo > 3 OR bar > 3' },
				objFilter = new ObjectFilter(queryRequest);

			expect(objFilter.filter({foo: 4, bar: 4 })).to.equal(true);
			expect(objFilter.filter({foo: 3, bar: 3 })).to.equal(false);
			expect(objFilter.filter({foo: 4, bar: 3 })).to.equal(true);
			expect(objFilter.filter({foo: 3, bar: 4 })).to.equal(true);
			
			done();
		});

		it('should work with filter: foo > 3 OR bar > 3 OR xyz > 3', function(done) {

			var queryRequest = { filter: 'foo > 3 OR bar > 3 OR xyz > 3' },
				objFilter = new ObjectFilter(queryRequest);

			expect(objFilter.filter({foo: 4, bar: 4, xyz: 4 })).to.equal(true);
			expect(objFilter.filter({foo: 4, bar: 4, xyz: 3 })).to.equal(true);
			expect(objFilter.filter({foo: 4, bar: 3, xyz: 3 })).to.equal(true);
			expect(objFilter.filter({foo: 4, bar: 3, xyz: 4 })).to.equal(true);
			expect(objFilter.filter({foo: 3, bar: 4, xyz: 4 })).to.equal(true);
			expect(objFilter.filter({foo: 3, bar: 3, xyz: 4 })).to.equal(true);
			expect(objFilter.filter({foo: 3, bar: 4, xyz: 3 })).to.equal(true);
			expect(objFilter.filter({foo: 3, bar: 3, xyz: 3 })).to.equal(false);
			
			done();
		});
		
		it('should work with filter: (foo > 3 OR bar > 3) AND xyz > 3', function(done) {

			var queryRequest = { filter: '(foo > 3 OR bar > 3) AND xyz > 3' },
				objFilter = new ObjectFilter(queryRequest);

			expect(objFilter.filter({foo: 4, bar: 4, xyz: 4 })).to.equal(true);
			expect(objFilter.filter({foo: 4, bar: 4, xyz: 3 })).to.equal(false);
			expect(objFilter.filter({foo: 4, bar: 3, xyz: 3 })).to.equal(false);
			expect(objFilter.filter({foo: 4, bar: 3, xyz: 4 })).to.equal(true);
			expect(objFilter.filter({foo: 3, bar: 4, xyz: 4 })).to.equal(true);
			expect(objFilter.filter({foo: 3, bar: 3, xyz: 4 })).to.equal(false);
			expect(objFilter.filter({foo: 3, bar: 4, xyz: 3 })).to.equal(false);
			expect(objFilter.filter({foo: 3, bar: 3, xyz: 3 })).to.equal(false);
			
			done();
		});

		it('should work with filter: foo > 3 AND (bar > 3 OR xyz > 3)', function(done) {

			var queryRequest = { filter: 'foo > 3 AND (bar > 3 OR xyz > 3)' },
				objFilter = new ObjectFilter(queryRequest);

			expect(objFilter.filter({foo: 4, bar: 4, xyz: 4 })).to.equal(true);
			expect(objFilter.filter({foo: 4, bar: 4, xyz: 3 })).to.equal(true);
			expect(objFilter.filter({foo: 4, bar: 3, xyz: 3 })).to.equal(false);
			expect(objFilter.filter({foo: 4, bar: 3, xyz: 4 })).to.equal(true);
			expect(objFilter.filter({foo: 3, bar: 4, xyz: 4 })).to.equal(false);
			expect(objFilter.filter({foo: 3, bar: 3, xyz: 4 })).to.equal(false);
			expect(objFilter.filter({foo: 3, bar: 4, xyz: 3 })).to.equal(false);
			expect(objFilter.filter({foo: 3, bar: 3, xyz: 3 })).to.equal(false);
			
			done();
		});

		it('should work with filter: (foo > 3 AND bar > 3) OR xyz > 3', function(done) {

			var queryRequest = { filter: '(foo > 3 AND bar > 3) OR xyz > 3' },
				objFilter = new ObjectFilter(queryRequest);

			expect(objFilter.filter({foo: 4, bar: 4, xyz: 4 })).to.equal(true);
			expect(objFilter.filter({foo: 4, bar: 4, xyz: 3 })).to.equal(true);
			expect(objFilter.filter({foo: 4, bar: 3, xyz: 3 })).to.equal(false);
			expect(objFilter.filter({foo: 4, bar: 3, xyz: 4 })).to.equal(true);
			expect(objFilter.filter({foo: 3, bar: 4, xyz: 4 })).to.equal(true);
			expect(objFilter.filter({foo: 3, bar: 3, xyz: 4 })).to.equal(true);
			expect(objFilter.filter({foo: 3, bar: 4, xyz: 3 })).to.equal(false);
			expect(objFilter.filter({foo: 3, bar: 3, xyz: 3 })).to.equal(false);
			
			done();
		});

		it('should work with filter: foo > 3 OR (bar > 3 AND xyz > 3)', function(done) {

			var queryRequest = { filter: 'foo > 3 OR (bar > 3 AND xyz > 3)' },
				objFilter = new ObjectFilter(queryRequest);

			expect(objFilter.filter({foo: 4, bar: 4, xyz: 4 })).to.equal(true);
			expect(objFilter.filter({foo: 4, bar: 4, xyz: 3 })).to.equal(true);
			expect(objFilter.filter({foo: 4, bar: 3, xyz: 3 })).to.equal(true);
			expect(objFilter.filter({foo: 4, bar: 3, xyz: 4 })).to.equal(true);
			expect(objFilter.filter({foo: 3, bar: 4, xyz: 4 })).to.equal(true);
			expect(objFilter.filter({foo: 3, bar: 3, xyz: 4 })).to.equal(false);
			expect(objFilter.filter({foo: 3, bar: 4, xyz: 3 })).to.equal(false);
			expect(objFilter.filter({foo: 3, bar: 3, xyz: 3 })).to.equal(false);
			
			done();
		});
	});

});