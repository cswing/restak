'use strict';

var expect = require('chai').expect,
	assert = require('chai').assert,
	NeDBQueryListener = require('../nedb-query-listener'),
	QueryParser = require('../../../query/antlr/query-parser');

describe('nedb > query > query-listener', function() {

	describe('query-request edge cases', function(){

		it('should be valid with a null request', function(done) {
			
			var request = null,
				listener = new NeDBQueryListener(),
				parser = new QueryParser(listener, request);

			expect(parser.isValid()).to.equal(true);
			
			done();
		});

		it('should be valid with minimal request parameters', function(done) {

			var request = {},
				listener = new NeDBQueryListener(),
				parser = new QueryParser(listener, request);

			expect(parser.isValid()).to.equal(true);
			
			done();
		});

		it('should be valid with whitespace for a filter', function(done) {

			var request = {
					filter: '   '
				},
				listener = new NeDBQueryListener(),
				parser = new QueryParser(listener, request);

			expect(parser.isValid()).to.equal(true);
			
			done();
		});

		it('should be in valid when the filter is invalid', function(done) {

			var request = {
					filter: 'INVALID QUERY'
				},
				listener = new NeDBQueryListener(),
				parser = new QueryParser(listener, request);

			expect(parser.isValid()).to.equal(false);
			
			done();
		});
		
	});

	describe('equals', function(){

		it('should return { foo: 3 }', function(done) {
			
			var request = {
				filter: 'foo=3'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: 3});
			
			done();
		});

		it('should return { foo: 3.5 }', function(done) {
			
			var request = {
				filter: 'foo=3.5'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: 3.5});
			
			done();
		});

		it('should return { foo: -3 }', function(done) {
			
			var request = {
				filter: 'foo=-3'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: -3 });
			
			done();
		});

		it('should return { foo: -3.5 }', function(done) {
			
			var request = {
				filter: 'foo=-3.5'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: -3.5 });
			
			done();
		});

		it('should return { foo: \'a\' } - filter uses \'', function(done) {
			
			var request = {
				filter: 'foo=\'a\''
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: 'a'});
			
			done();
		});
		
		it('should return { foo: \'a\' } - filter uses "', function(done) {
			
			var request = {
				filter: 'foo="a"'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: 'a'});
			
			done();
		});
		
		it('should return { foo: \'a\' } - filter uses no type of quote', function(done) {
			
			var request = {
				filter: 'foo=a'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: 'a'});
			
			done();
		});

		it('should return { foo: \'00f7154ba087285d491bf7bb1c13e80e\' } - filter uses no type of quote', function(done) {
			
			var request = {
				filter: 'foo=00f7154ba087285d491bf7bb1c13e80e'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: '00f7154ba087285d491bf7bb1c13e80e'});
			
			done();
		});

		
	});
	
	describe('less than', function(){

		it('should return { foo: { $lt: 3 }}', function(done) {
			
			var request = {
				filter: 'foo<3'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $lt: 3 }});
			
			done();
		});

		it('should return { foo: { $lt: 3.5 }}', function(done) {
			
			var request = {
				filter: 'foo<3.5'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $lt: 3.5 }});
			
			done();
		});

		it('should return { foo: { $lt: 3.5 }} - spaces in filter', function(done) {
			
			var request = {
				filter: 'foo < 3.5'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $lt: 3.5 }});
			
			done();
		});
		
		it('should return { foo: { $lt: -3 }}', function(done) {
			
			var request = {
				filter: 'foo<-3'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $lt: -3 }});
			
			done();
		});

		it('should return { foo: { $lt: -3.5 }}', function(done) {
			
			var request = {
				filter: 'foo<-3.5'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $lt: -3.5 }});
			
			done();
		});

		it('should return { foo: { $lt: -3.5 }} - spaces in the filter', function(done) {
			
			var request = {
				filter: 'foo < -3.5'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $lt: -3.5 }});
			
			done();
		});

		it('should return { foo: { $lt: \'a\' }} - filter uses \'', function(done) {
			
			var request = {
				filter: 'foo<\'a\''
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: { $lt: 'a' } });
			
			done();
		});
		
		it('should return { foo: { $lt: \'a\' }} - filter uses "', function(done) {
			
			var request = {
				filter: 'foo<"a"'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: { $lt: 'a' } });
			
			done();
		});
		
		it('should return { foo: { $lt: \'a\' }} - filter uses no type of quote', function(done) {
			
			var request = {
				filter: 'foo<a'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: { $lt: 'a' } });
			
			done();
		});

		it('should return { foo: { $lt: \'00f7154ba087285d491bf7bb1c13e80e\' }} - filter uses no type of quote', function(done) {
			
			var request = {
				filter: 'foo<00f7154ba087285d491bf7bb1c13e80e'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: { $lt: '00f7154ba087285d491bf7bb1c13e80e'}});
			
			done();
		});
	});

	describe('less than or equals', function(){

		it('should return { foo: { $lte: 3 }}', function(done) {
			
			var request = {
				filter: 'foo<=3'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $lte: 3 }});
			
			done();
		});

		it('should return { foo: { $lte: 3.5 }}', function(done) {
			
			var request = {
				filter: 'foo<=3.5'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $lte: 3.5 }});
			
			done();
		});

		it('should return { foo: { $lte: 3.5 }} - spaces in filter', function(done) {
			
			var request = {
				filter: 'foo <= 3.5'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $lte: 3.5 }});
			
			done();
		});
		
		it('should return { foo: { $lte: -3 }}', function(done) {
			
			var request = {
				filter: 'foo<=-3'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $lte: -3 }});
			
			done();
		});

		it('should return { foo: { $lte: -3.5 }}', function(done) {
			
			var request = {
				filter: 'foo<=-3.5'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $lte: -3.5 }});
			
			done();
		});

		it('should return { foo: { $lte: -3.5 }} - spaces in the filter', function(done) {
			
			var request = {
				filter: 'foo <= -3.5'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $lte: -3.5 }});
			
			done();
		});

				it('should return { foo: { $lte: \'a\' }} - filter uses \'', function(done) {
			
			var request = {
				filter: 'foo<=\'a\''
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: { $lte: 'a' } });
			
			done();
		});
		
		it('should return { foo: { $lte: \'a\' }} - filter uses "', function(done) {
			
			var request = {
				filter: 'foo<="a"'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: { $lte: 'a' } });
			
			done();
		});
		
		it('should return { foo: { $lte: \'a\' }} - filter uses no type of quote', function(done) {
			
			var request = {
				filter: 'foo<=a'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: { $lte: 'a' } });
			
			done();
		});

		it('should return { foo: { $lte: \'00f7154ba087285d491bf7bb1c13e80e\' }} - filter uses no type of quote', function(done) {
			
			var request = {
				filter: 'foo<=00f7154ba087285d491bf7bb1c13e80e'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: { $lte: '00f7154ba087285d491bf7bb1c13e80e'}});
			
			done();
		});
	});
	
	describe('greater than', function(){

		it('should return { foo: { $gt: 3 }}', function(done) {
			
			var request = {
				filter: 'foo>3'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $gt: 3 }});
			
			done();
		});

		it('should return { foo: { $gt: 3.5 }}', function(done) {
			
			var request = {
				filter: 'foo>3.5'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $gt: 3.5 }});
			
			done();
		});

		it('should return { foo: { $gt: 3.5 }} - spaces in filter', function(done) {
			
			var request = {
				filter: 'foo > 3.5'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $gt: 3.5 }});
			
			done();
		});
		
		it('should return { foo: { $gt: -3 }}', function(done) {
			
			var request = {
				filter: 'foo>-3'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $gt: -3 }});
			
			done();
		});

		it('should return { foo: { $gt: -3.5 }}', function(done) {
			
			var request = {
				filter: 'foo>-3.5'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $gt: -3.5 }});
			
			done();
		});

		it('should return { foo: { $gt: -3.5 }} - spaces in the filter', function(done) {
			
			var request = {
				filter: 'foo > -3.5'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $gt: -3.5 }});
			
			done();
		});

				it('should return { foo: { $gt: \'a\' }} - filter uses \'', function(done) {
			
			var request = {
				filter: 'foo>\'a\''
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: { $gt: 'a' } });
			
			done();
		});
		
		it('should return { foo: { $gt: \'a\' }} - filter uses "', function(done) {
			
			var request = {
				filter: 'foo>"a"'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: { $gt: 'a' } });
			
			done();
		});
		
		it('should return { foo: { $gt: \'a\' }} - filter uses no type of quote', function(done) {
			
			var request = {
				filter: 'foo>a'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: { $gt: 'a' } });
			
			done();
		});

		it('should return { foo: { $gt: \'00f7154ba087285d491bf7bb1c13e80e\' }} - filter uses no type of quote', function(done) {
			
			var request = {
				filter: 'foo>00f7154ba087285d491bf7bb1c13e80e'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: { $gt: '00f7154ba087285d491bf7bb1c13e80e'}});
			
			done();
		});
	});

	describe('greater than or equals', function(){

		it('should return { foo: { $gte: 3 }}', function(done) {
			
			var request = {
				filter: 'foo>=3'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $gte: 3 }});
			
			done();
		});

		it('should return { foo: { $gte: 3.5 }}', function(done) {
			
			var request = {
				filter: 'foo>=3.5'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $gte: 3.5 }});
			
			done();
		});

		it('should return { foo: { $gte: 3.5 }} - spaces in filter', function(done) {
			
			var request = {
				filter: 'foo >= 3.5'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $gte: 3.5 }});
			
			done();
		});
		
		it('should return { foo: { $gte: -3 }}', function(done) {
			
			var request = {
				filter: 'foo>=-3'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $gte: -3 }});
			
			done();
		});

		it('should return { foo: { $gte: -3.5 }}', function(done) {
			
			var request = {
				filter: 'foo>=-3.5'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $gte: -3.5 }});
			
			done();
		});

		it('should return { foo: { $gte: -3.5 }} - spaces in the filter', function(done) {
			
			var request = {
				filter: 'foo >= -3.5'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $gte: -3.5 }});
			
			done();
		});

				it('should return { foo: { $gte: \'a\' }} - filter uses \'', function(done) {
			
			var request = {
				filter: 'foo>=\'a\''
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: { $gte: 'a' } });
			
			done();
		});
		
		it('should return { foo: { $gte: \'a\' }} - filter uses "', function(done) {
			
			var request = {
				filter: 'foo>="a"'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: { $gte: 'a' } });
			
			done();
		});
		
		it('should return { foo: { $gte: \'a\' }} - filter uses no type of quote', function(done) {
			
			var request = {
				filter: 'foo>=a'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: { $gte: 'a' } });
			
			done();
		});

		it('should return { foo: { $gte: \'00f7154ba087285d491bf7bb1c13e80e\' }} - filter uses no type of quote', function(done) {
			
			var request = {
				filter: 'foo>=00f7154ba087285d491bf7bb1c13e80e'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: { $gte: '00f7154ba087285d491bf7bb1c13e80e'}});
			
			done();
		});
	});

	describe('not equals - <=', function(){

		it('should return { foo: { $ne: 3 }}', function(done) {
			
			var request = {
				filter: 'foo<>3'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $ne: 3 }});
			
			done();
		});

		it('should return { foo: { $ne: 3.5 }}', function(done) {
			
			var request = {
				filter: 'foo<>3.5'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $ne: 3.5 }});
			
			done();
		});

		it('should return { foo: { $ne: 3.5 }} - spaces in filter', function(done) {
			
			var request = {
				filter: 'foo <> 3.5'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $ne: 3.5 }});
			
			done();
		});
		
		it('should return { foo: { $ne: -3 }}', function(done) {
			
			var request = {
				filter: 'foo<>-3'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $ne: -3 }});
			
			done();
		});

		it('should return { foo: { $ne: -3.5 }}', function(done) {
			
			var request = {
				filter: 'foo<>-3.5'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $ne: -3.5 }});
			
			done();
		});

		it('should return { foo: { $ne: -3.5 }} - spaces in the filter', function(done) {
			
			var request = {
				filter: 'foo <> -3.5'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $ne: -3.5 }});
			
			done();
		});

				it('should return { foo: { $ne: \'a\' }} - filter uses \'', function(done) {
			
			var request = {
				filter: 'foo<>\'a\''
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: { $ne: 'a' } });
			
			done();
		});
		
		it('should return { foo: { $ne: \'a\' }} - filter uses "', function(done) {
			
			var request = {
				filter: 'foo<>"a"'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: { $ne: 'a' } });
			
			done();
		});
		
		it('should return { foo: { $ne: \'a\' }} - filter uses no type of quote', function(done) {
			
			var request = {
				filter: 'foo<>a'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: { $ne: 'a' } });
			
			done();
		});

		it('should return { foo: { $ne: \'00f7154ba087285d491bf7bb1c13e80e\' }} - filter uses no type of quote', function(done) {
			
			var request = {
				filter: 'foo<>00f7154ba087285d491bf7bb1c13e80e'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: { $ne: '00f7154ba087285d491bf7bb1c13e80e'}});
			
			done();
		});
	});

	describe('not equals - !=', function(){

		it('should return { foo: { $ne: 3 }}', function(done) {
			
			var request = {
				filter: 'foo!=3'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $ne: 3 }});
			
			done();
		});

		it('should return { foo: { $ne: 3.5 }}', function(done) {
			
			var request = {
				filter: 'foo!=3.5'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $ne: 3.5 }});
			
			done();
		});

		it('should return { foo: { $ne: 3.5 }} - spaces in filter', function(done) {
			
			var request = {
				filter: 'foo != 3.5'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $ne: 3.5 }});
			
			done();
		});
		
		it('should return { foo: { $ne: -3 }}', function(done) {
			
			var request = {
				filter: 'foo!=-3'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $ne: -3 }});
			
			done();
		});

		it('should return { foo: { $ne: -3.5 }}', function(done) {
			
			var request = {
				filter: 'foo!=-3.5'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $ne: -3.5 }});
			
			done();
		});

		it('should return { foo: { $ne: -3.5 }} - spaces in the filter', function(done) {
			
			var request = {
				filter: 'foo != -3.5'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: { $ne: -3.5 }});
			
			done();
		});

		it('should return { foo: { $ne: \'a\' }} - filter uses \'', function(done) {
			
			var request = {
				filter: 'foo!=\'a\''
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: { $ne: 'a' } });
			
			done();
		});
		
		it('should return { foo: { $ne: \'a\' }} - filter uses "', function(done) {
			
			var request = {
				filter: 'foo!="a"'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: { $ne: 'a' } });
			
			done();
		});
		
		it('should return { foo: { $ne: \'a\' }} - filter uses no type of quote', function(done) {
			
			var request = {
				filter: 'foo!=a'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: { $ne: 'a' } });
			
			done();
		});

		it('should return { foo: { $ne: \'00f7154ba087285d491bf7bb1c13e80e\' }} - filter uses no type of quote', function(done) {
			
			var request = {
				filter: 'foo!=00f7154ba087285d491bf7bb1c13e80e'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: { $ne: '00f7154ba087285d491bf7bb1c13e80e'}});
			
			done();
		});
	});

	describe('contains', function(){

		it('should return { foo: /3/}', function(done) {
			
			var request = {
				filter: 'foo~3'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: /3/});
			
			done();
		});

		it('should return { foo: /3.5/}', function(done) {
			
			var request = {
				filter: 'foo~3.5'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: /3.5/});
			
			done();
		});

		it('should return { foo: /3.5/} - spaces in filter', function(done) {
			
			var request = {
				filter: 'foo ~ 3.5'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: /3.5/});
			
			done();
		});
		
		it('should return { foo: /-3/}', function(done) {
			
			var request = {
				filter: 'foo~-3'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: /-3/});
			
			done();
		});

		it('should return { foo: /-3.5/}', function(done) {
			
			var request = {
				filter: 'foo~-3.5'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: /-3.5/});
			
			done();
		});

		it('should return { foo: /-3.5/} - spaces in the filter', function(done) {
			
			var request = {
				filter: 'foo ~ -3.5'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ foo: /-3.5/});
			
			done();
		});

		it('should return { foo: /a/} - filter uses \'', function(done) {
			
			var request = {
				filter: 'foo~\'a\''
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: /a/ });
			
			done();
		});
		
		it('should return { foo: /a/} - filter uses "', function(done) {
			
			var request = {
				filter: 'foo~"a"'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: /a/ });
			
			done();
		});
		
		it('should return { foo: /a/} - filter uses no type of quote', function(done) {
			
			var request = {
				filter: 'foo~a'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: /a/ });
			
			done();
		});

		it('should return { foo: /00f7154ba087285d491bf7bb1c13e80e/} - filter uses no type of quote', function(done) {
			
			var request = {
				filter: 'foo~00f7154ba087285d491bf7bb1c13e80e'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({foo: /00f7154ba087285d491bf7bb1c13e80e/ });
			
			done();
		});
	});

	describe('logic', function(){

		it('should work with filter: foo = 3 OR bar = 4', function(done){

			var request = {
				filter: 'foo=3 OR bar = 4'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ $or: [{foo: 3}, {bar: 4}] });
			
			done();
		});

		it('should work with filter: foo = 3 OR bar = 3 OR xyz = 3', function(done) {

			var request = {
				filter: 'foo = 3 OR bar = 3 OR xyz = 3'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ $or: [{foo: 3}, {bar: 3}, {xyz: 3}] });
			
			done();
		});

		it('should work with filter: foo = 3 AND bar = 4', function(done){

			var request = {
				filter: 'foo=3 AND bar = 4'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ $and: [{foo: 3}, {bar: 4}] });
			
			done();
		});

		it('should work with filter: foo = 3 AND bar = 3 AND xyz = 3', function(done) {

			var request = {
				filter: 'foo = 3 AND bar = 3 AND xyz = 3'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ $and: [{foo: 3}, {bar: 3}, {xyz: 3}] });
			
			done();
		});

		it('should work with filter: (foo = 3 OR bar = 3) AND xyz = 3', function(done) {

			var request = {
				filter: '(foo = 3 OR bar = 3) AND xyz = 3'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ $and: [ { $or: [{foo: 3}, {bar: 3}]}, {xyz: 3} ] });
		
			done();
		});

		it('should work with filter: foo = 3 AND (bar = 3 OR xyz = 3)', function(done) {

			var request = {
				filter: 'foo = 3 AND (bar = 3 OR xyz = 3)'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ $and: [{foo: 3}, { $or: [{bar: 3}, {xyz: 3}] }] });
			
			done();
		});

		it('should work with filter: (foo = 3 AND bar = 3) OR xyz = 3', function(done) {

			var request = {
				filter: '(foo = 3 AND bar = 3) OR xyz = 3'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ $or: [{ $and: [{foo: 3}, {bar: 3}] }, {xyz: 3}] });
			
			done();
		});

		it('should work with filter: foo = 3 OR (bar = 3 AND xyz = 3)', function(done) {

			var request = {
				filter: 'foo = 3 OR (bar = 3 AND xyz = 3)'
			},
			listener = new NeDBQueryListener(),
			parser = new QueryParser(listener, request),
			filterObject = parser.tree.filterObject;

			expect(parser.isValid()).to.equal(true);
			expect(filterObject).to.deep.equal({ $or: [{foo: 3}, { $and: [{bar: 3}, {xyz: 3}]}] });
			
			done();
		});

	});
});