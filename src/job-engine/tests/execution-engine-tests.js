'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	models = require('../models'),
	JobInstanceStatus = models.JobInstanceStatus,
	ExecutionEngine = require('../execution-engine'),
	CommandExecutorMock = require('./command-executor-mock');

describe('job-engine > execution-engine', function() {

	describe('#execute', function(){

		it('should handle no queued jobs', function(done){

			var queryRequest = null,
				instanceQuery = {
					execute: function(qr, callback){
						queryRequest = qr;
						callback(null, {
							items: []
						});
					}
				},
				engine = new ExecutionEngine(instanceQuery, null, null, null);

				engine.execute(function(err){
					expect(err).to.be.null;
					expect(queryRequest).to.deep.equal({
						pageSize: 100,
						filter: 'status=\'QUEUED\''
					});
					done();
				});
		});

		it('should handle when the query calls back with an error', function(done){

			var instanceQuery = {
					execute: function(qr, callback){
						callback('An error occurred', null);
					}
				},
				engine = new ExecutionEngine(instanceQuery, null, null, null);

				engine.execute(function(err){
					expect(err).to.equal('Unable to find queued jobs: An error occurred');
					done();
				});
		});

		it('should execute the jobs returned from the query', function(done){

			var instances = {
				'1': {
					id: '1',
					name: 'test job a',
					commandKey: 'test.jobA'
				},
				'2': {
					id: '2',
					name: 'test job b',
					commandKey: 'test.jobB'
				},
				'3': {
					id: '3',
					name: 'test job c',
					commandKey: 'test.jobC'					
				}
			};

			var instanceQuery = {
					execute: function(qr, callback){
						callback(null, {
							items: [
								instances['1'],
								instances['2'],
								instances['3']
							]
						});
					}
				},
				markInstanceExecutingCommandData = [],
				markInstanceExecutingCommand = {
					execute: function(instr, callback){
						markInstanceExecutingCommandData.push(instr.data);
						callback(null, instances[instr.data.instanceId]);
					}
				}, 
				markInstanceExecutedCommandData = [],
				markInstanceExecutedCommand = {
					execute: function(instr, callback){
						markInstanceExecutedCommandData.push(instr.data);
						callback(null, instances[instr.data.instanceId]);	
					}
				},
				commandExecutorData = [],
				commandExecutor = {
					executeCommand: function(key, data, context, callback){
						commandExecutorData.push({
							key: key,
							data: data
						});
						callback(null, null);
					}
				},
				engine = new ExecutionEngine(instanceQuery, markInstanceExecutingCommand, markInstanceExecutedCommand, commandExecutor);

				engine.execute(function(err){
					expect(err).to.be.null;
					expect(markInstanceExecutingCommandData).to.have.deep.members([
							{ instanceId: '1' },
							{ instanceId: '2' },
							{ instanceId: '3' }
						]);
					expect(commandExecutorData).to.have.deep.members([
							{ 
								key: 'test.jobA',
								data: null
							},
							{ 
								key: 'test.jobB',
								data: null
							},
							{ 
								key: 'test.jobC',
								data: null
							}
						]);
					
					expect(markInstanceExecutedCommandData).to.have.deep.members([
							{ instanceId: '1', result: null, status: JobInstanceStatus.Completed },
							{ instanceId: '2', result: null, status: JobInstanceStatus.Completed },
							{ instanceId: '3', result: null, status: JobInstanceStatus.Completed }
						]);

					done();
				});
		});

		it('should pass the params from the instance to the command', function(done){

			var instance = {
				id: 'A',
				name: 'test job a',
				commandKey: 'test.jobA',
				params: {
					arg1: 'a',
					arg2: 'b'
				}
			};

			var instanceQuery = {
					execute: function(qr, callback){
						callback(null, {
							items: [ instance ]
						});
					}
				},
				markInstanceExecutingCommand = {
					execute: function(instr, callback){
						callback(null, instance);
					}
				}, 
				markInstanceExecutedCommand = {
					execute: function(instr, callback){
						callback(null, instance);
					}
				},
				commandExecutorData = [],
				commandExecutor = {
					executeCommand: function(key, data, context, callback){
						commandExecutorData.push({
							key: key,
							data: data
						});
						callback(null, null);
					}
				},
				engine = new ExecutionEngine(instanceQuery, markInstanceExecutingCommand, markInstanceExecutedCommand, commandExecutor);

				engine.execute(function(err){
					expect(err).to.be.null;
					expect(commandExecutorData).to.have.deep.members([
							{ 
								key: 'test.jobA',
								data: {
									arg1: 'a',
									arg2: 'b'
								}
							}
						]);
					
					done();
				});
		});

		it('should set the result on the instance when the command succeeds', function(done){

			var instance = {
				id: 'A',
				name: 'test job a',
				commandKey: 'test.jobA'
			};

			var instanceQuery = {
					execute: function(qr, callback){
						callback(null, {
							items: [ instance ]
						});
					}
				},
				markInstanceExecutingCommand = {
					execute: function(instr, callback){
						callback(null, instance);
					}
				}, 
				markInstanceExecutedCommandData = [],
				markInstanceExecutedCommand = {
					execute: function(instr, callback){
						markInstanceExecutedCommandData.push(instr.data);
						callback(null, instance);
					}
				},
				commandExecutor = {
					executeCommand: function(key, data, context, callback){
						callback(null, {
							arg1: 'a',
							arg2: 'b'
						});
					}
				},
				engine = new ExecutionEngine(instanceQuery, markInstanceExecutingCommand, markInstanceExecutedCommand, commandExecutor);

				engine.execute(function(err){
					expect(err).to.be.null;
					expect(markInstanceExecutedCommandData).to.have.deep.members([
							{ 
								instanceId: 'A',
								status: JobInstanceStatus.Completed,
								result: {
									arg1: 'a',
									arg2: 'b'
								}
							}
						]);
					
					done();
				});
		});

		it('should set the error on the instance when the command calls back with an error', function(done){

			var instance = {
				id: 'A',
				name: 'test job a',
				commandKey: 'test.jobA'
			};

			var instanceQuery = {
					execute: function(qr, callback){
						callback(null, {
							items: [ instance ]
						});
					}
				},
				markInstanceExecutingCommand = {
					execute: function(instr, callback){
						callback(null, instance);
					}
				}, 
				markInstanceExecutedCommandData = [],
				markInstanceExecutedCommand = {
					execute: function(instr, callback){
						markInstanceExecutedCommandData.push(instr.data);
						callback(null, instance);
					}
				},
				commandExecutor = {
					executeCommand: function(key, data, context, callback){
						callback('An error occurred', {
							arg1: 'a',
							arg2: 'b'
						});
					}
				},
				engine = new ExecutionEngine(instanceQuery, markInstanceExecutingCommand, markInstanceExecutedCommand, commandExecutor);

				engine.execute(function(err){
					expect(err).to.be.null;
					expect(markInstanceExecutedCommandData).to.have.deep.members([
							{ 
								instanceId: 'A',
								status: JobInstanceStatus.Error,
								result: 'An error occurred'
							}
						]);
					
					done();
				});
		});

		it('should handle when the command throws an unexpected exception', function(done){

			var instance = {
				id: 'A',
				name: 'test job a',
				commandKey: 'test.jobA'
			};

			var instanceQuery = {
					execute: function(qr, callback){
						callback(null, {
							items: [ instance ]
						});
					}
				},
				markInstanceExecutingCommand = {
					execute: function(instr, callback){
						callback(null, instance);
					}
				}, 
				markInstanceExecutedCommandData = [],
				markInstanceExecutedCommand = {
					execute: function(instr, callback){
						markInstanceExecutedCommandData.push(instr.data);
						callback(null, instance);
					}
				},
				commandExecutor = {
					executeCommand: function(key, data, context, callback){
						throw 'An uncaught error';
					}
				},
				engine = new ExecutionEngine(instanceQuery, markInstanceExecutingCommand, markInstanceExecutedCommand, commandExecutor);

				engine.execute(function(err){
					expect(err).to.be.null;
					expect(markInstanceExecutedCommandData).to.have.deep.members([
							{ 
								instanceId: 'A',
								status: JobInstanceStatus.Error,
								result: 'An uncaught error'
							}
						]);
					
					done();
				});
		});

		it.skip('should handle when the an unexpected exception is thrown in a callback with the command', function(done){

			var instance = {
				id: 'A',
				name: 'test job a',
				commandKey: 'test.jobA'
			};

			var instanceQuery = {
					execute: function(qr, callback){
						callback(null, {
							items: [ instance ]
						});
					}
				},
				markInstanceExecutingCommand = {
					execute: function(instr, callback){
						callback(null, instance);
					}
				}, 
				markInstanceExecutedCommandData = [],
				markInstanceExecutedCommand = {
					execute: function(instr, callback){
						markInstanceExecutedCommandData.push(instr.data);
						callback(null, instance);
					}
				},
				subCommand = {
					execute: function(instr, callback){
						setTimeout(callback, 500);
					}
				},
				commandExecutor = {
					executeCommand: function(key, data, context, callback){
						subCommand.execute({}, function(){
							throw new Error('An uncaught error');
						});
					}
				},
				engine = new ExecutionEngine(instanceQuery, markInstanceExecutingCommand, markInstanceExecutedCommand, commandExecutor);

				engine.execute(function(err){
					expect(err).to.be.null;
					expect(markInstanceExecutedCommandData).to.have.deep.members([
							{ 
								instanceId: 'A',
								status: JobInstanceStatus.Error,
								result: 'An uncaught error'
							}
						]);
					
					done();
				});
		});

	});
});