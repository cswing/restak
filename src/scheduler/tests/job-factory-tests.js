'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	JobFactory = require('../job-factory').DefaultJobFactory;

var Command = function(key){
	this.key = key;
};
Command.prototype.execute = function(ci, callback){
	callback(null, {});
};

describe('scheduler > job-factory', function() {

	describe('#getCommand', function(){

		it('should find the command', function(done) {

			var cmd = new Command('test'),
				factory = new JobFactory({
					'test': cmd
				}),
				result = factory.getCommand({ command: 'test' });

			expect(result).to.not.be.null;
			expect(result).to.have.property('key', 'test');

			done();
		});

		it('should return null with a null job descriptor', function(done) {

			var factory = new JobFactory({}),
				result = factory.getCommand(null);

			expect(result).to.be.null;

			done();
		});

		it('should return null with a job descriptor without a command', function(done) {

			var factory = new JobFactory({}),
				result = factory.getCommand({});

			expect(result).to.be.null;

			done();
		});

		it('should not find the command', function(done) {

			var cmd = new Command('test'),
				factory = new JobFactory({
					'test': cmd
				}),
				result = factory.getCommand({ command: 'test1' });

			expect(result).to.be.null;

			done();
		});

	});
});