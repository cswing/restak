'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	Joi = require('joi'),
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

				commandExecutor.executeCommand('test', { test: 'XYZ' }, {}, function(err, result){

					expect(err).to.be.null;
					expect(result).to.deep.equal(cmdResult);

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

			commandExecutor.executeCommand('test', { test: 'XYZ' }, {}, function(err, result){

				expect(err).to.not.be.null;
				expect(err).to.have.property('message', 'Unknown command: test');

				done();
			});
		});

		it('should execute because the data is valid', function(done){

			var cmdResult = { test: 'ABC' },
				cmd = {
					validation: {
						test: Joi.string().required()
					},
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

				commandExecutor.executeCommand('test', { test: 'XYZ' }, {}, function(err, result){

					expect(err).to.be.null;
					expect(result).to.deep.equal(cmdResult);

					done();
				});
		});

		it('should not execute because the data is invalid', function(done){

			var cmdResult = { test: 'ABC' },
				cmd = {
					validation: {
						test: Joi.string().required()
					},
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

			commandExecutor.executeCommand('test', {}, {}, function(err, result){
				expect(err).to.have.deep.members([ 
					{
						message: '"test" is required',
						path: 'test',
						type: 'any.required',
						context: { key: 'test' } 
					} 
    			]);
				expect(result).to.be.null;

				done();
			});
		});

		it('should execute even though the data is invalid because the options say to skip validation', function(done){

			var cmdResult = { test: 'ABC' },
				cmd = {
					validation: {
						test: Joi.string().required()
					},
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

				commandExecutor.executeCommand('test', {}, { skipValidation: true }, function(err, result){

					expect(err).to.be.null;
					expect(result).to.deep.equal(cmdResult);

					done();
				});
		});

	});
});