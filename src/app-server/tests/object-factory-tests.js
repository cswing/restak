'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	ObjectFactory = require('../object-factory').DefaultObjectFactory;


describe('app-server > object-factory', function() {

	describe('#register', function(){

		it('should register the object', function(done) {

			var obj = {
				test: 1
			},
			factory = new ObjectFactory(),
			result = factory.register('test', obj);

			expect(result).to.equal(true);
			expect(factory).to.have.deep.property('objects.test', obj);
			
			done();
		});
		
		it('should not register a duplicate key', function(done) {

			var obj = {
				test: 1
			},
			factory = new ObjectFactory();

			factory.register('test', obj);
			var result = factory.register('test', { test: 'ABC' });

			expect(result).to.equal(false);
			expect(factory).to.have.deep.property('objects.test', obj);
			
			done();
		});

		it('should not register a null key', function(done) {

			var obj = {
				test: 1
			},
			factory = new ObjectFactory(),
			result = factory.register(null, obj);

			expect(result).to.equal(false);
			
			done();
		});

		it('should not register an undefined key', function(done) {

			var obj = {
				test: 1
			},
			factory = new ObjectFactory(),
			result = factory.register(undefined, obj);

			expect(result).to.equal(false);
			
			done();
		});	
	});

	describe('#ctor', function(){

		it('should register the initial objects', function(done) {

			var obj = {
				test: 1
			},
			factory = new ObjectFactory({'test': obj});
			
			expect(factory).to.have.deep.property('objects.test', obj);
			
			done();
		});

	});

	describe('#get', function(){

		it('should find the object', function(done) {

			var obj = {
					test: 1
				},
				factory = new ObjectFactory({
					'test': obj
				}),
				result = factory.get('test');

			expect(result).to.not.be.null;
			expect(result).to.equal(obj);

			done();
		});

		it('should return null with a null key', function(done) {

			var factory = new ObjectFactory({}),
				result = factory.get(null);

			expect(result).to.be.null;

			done();
		});

		it('should return null with an undefined key', function(done) {

			var factory = new ObjectFactory({}),
				result = factory.get(undefined);

			expect(result).to.be.null;

			done();
		});

		it('should not find the command', function(done) {

			var obj = {
					test: 1
				},
				factory = new ObjectFactory({
					'test': obj
				}),
				result = factory.get({ command: 'test1' });

			expect(result).to.be.null;

			done();
		});
	});

});