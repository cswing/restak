'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	CommandExecutor = require('../command-executor'),
	CommandNotFoundError = require('../index').CommandNotFoundError;

describe('command > command-executor', function() {

	describe('#execute', function(){

		it('should execute the command and return the data in result', function(done){

			var cmdResult = { test: 'ABC' },
				cmd = {
					execute: function(ci, cb){
						cb(null, cmdResult);
					}
				},
				commandFactory = {
					getCommand: function(key){
						return cmd;
					}
				},
				commandExecutor = new CommandExecutor(commandFactory);

				commandExecutor.executeCommand('test', { test: 'XYZ' }, function(err, result){

					expect(err).to.be.null;
					expect(result).to.not.be.null;
					expect(result.data).to.deep.equal(cmdResult);

					done();
				});
		});

		it('should return a CommandNotFoundError', function(done){

			var commandFactory = {
					getCommand: function(key){
						throw new CommandNotFoundError(key);
					}
				},
				commandExecutor = new CommandExecutor(commandFactory);

				commandExecutor.executeCommand('test', { test: 'XYZ' }, function(err, result){

					expect(err).to.not.be.null;
					expect(err).to.have.property('message', 'Unknown command: test');

					done();
				});
		});

	});
});