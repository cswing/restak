'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	DefaultConfig = require('../config');

describe('app-server > config', function() {

	describe('#has', function(){

		it('should return the correct values', function(done){

			var config = new DefaultConfig({
				'test-setting': 'abc'
			});

			expect(config.has('foo')).to.equal(false);
			expect(config.has('test-setting')).to.equal(true);

			done();
		});
	});

	describe('#get', function(){

		it('should return the setting values', function(done){

			var config = new DefaultConfig({
				'test-setting': 'abc'
			});
			expect(config.get('test-setting')).to.equal('abc');

			done();
		});

		it('should return the setting values when it is null', function(done){

			var config = new DefaultConfig({
				'test-setting': null
			});
			expect(config.get('test-setting')).to.be.null;

			done();
		});

		it('should throw when the setting does not exist', function(done){

			var config = new DefaultConfig({});

			var setting;
			try{
				setting = config.get('test-setting');
				done('error expected');
			}catch(err){
				expect(err).to.equal('Undefined setting: test-setting');
			}

			done();
		});

		it('should throw when the setting is undefined', function(done){

			var config = new DefaultConfig({
				'test-setting': undefined
			});
			
			var setting;
			try{
				setting = config.get('test-setting');
				done('error expected');
			}catch(err){
				expect(err).to.equal('Undefined setting: test-setting');
			}

			done();
		});
	});
});