'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	models = require('../models'),
	JobDescriptorStatus = models.JobDescriptorStatus,
	JobInstanceStatus = models.JobInstanceStatus,
	Execution = require('../execution'),
	CommandExecutorMock = require('./command-executor-mock');

describe('scheduler > execution', function() {

	describe('#invoke', function(){

		it('should execute a recurring command', function(done) {

			var jobDescriptor = {
					id: '0123456',
					name: 'test job',
					data: {
						test: '1a'
					},
					command: 'test.job',
					schedule: '* * * * *'
				},
				commandExecutor = new CommandExecutorMock(function(data, callback){
					callback(null, { resultData: 'ABC' });
				}),
				execution = new Execution(commandExecutor, jobDescriptor);

			execution.invoke();

			commandExecutor.expect('0123456', 'test job', { test: '1a' }, { resultData: 'ABC' },
				JobDescriptorStatus.Scheduled, JobInstanceStatus.Completed);

			done();
		});

		it('should execute a one time command', function(done) {

			var jobDescriptor = {
					id: '0123456',
					name: 'test job',
					data: {
						test: '1a'
					},
					command: 'test.job'
				},
				commandExecutor = new CommandExecutorMock(function(data, callback){
					callback(null, { resultData: 'ABC' });
				}),
				execution = new Execution(commandExecutor, jobDescriptor);

			execution.invoke();

			commandExecutor.expect('0123456', 'test job', { test: '1a' }, { resultData: 'ABC' },
				JobDescriptorStatus.Completed, JobInstanceStatus.Completed);

			done();
		});

		it('should handle when the command calls back with an error', function(done){

			var jobDescriptor = {
					id: '0123456',
					name: 'test job',
					data: {
						test: '1a'
					},
					command: 'test.job',
					schedule: '* * * * *'
				},
				commandExecutor = new CommandExecutorMock(function(data, callback){
					callback('An error occurred', null);
				}),
				execution = new Execution(commandExecutor, jobDescriptor);

			execution.invoke();

			commandExecutor.expect('0123456', 'test job', { test: '1a' }, 'An error occurred',
				JobDescriptorStatus.Scheduled, JobInstanceStatus.Error);

			done();
		});

		it('should handle when the command throws a string error', function(done){

			var jobDescriptor = {
					id: '0123456',
					name: 'test job',
					data: {
						test: '1a'
					},
					command: 'test.job',
					schedule: '* * * * *'
				},
				commandExecutor = new CommandExecutorMock(function(data, callback){
					throw 'An error occurred';
				}),
				execution = new Execution(commandExecutor, jobDescriptor);

			execution.invoke();

			commandExecutor.expect('0123456', 'test job', { test: '1a' }, 'An error occurred',
				JobDescriptorStatus.Scheduled, JobInstanceStatus.Error);

			done();
		});

		it('should handle when the command throws an error object', function(done){

			var jobDescriptor = {
					id: '0123456',
					name: 'test job',
					data: {
						test: '1a'
					},
					command: 'test.job',
					schedule: '* * * * *'
				},
				commandExecutor = new CommandExecutorMock(function(data, callback){
					throw new Error('An error occurred');
				}),
				execution = new Execution(commandExecutor, jobDescriptor);

			execution.invoke();

			commandExecutor.expect('0123456', 'test job', { test: '1a' }, 'An error occurred',
				JobDescriptorStatus.Scheduled, JobInstanceStatus.Error);

			done();
		});

		it('should handle when the command throws a null error', function(done){

			var jobDescriptor = {
					id: '0123456',
					name: 'test job',
					data: {
						test: '1a'
					},
					command: 'test.job',
					schedule: '* * * * *'
				},
				commandExecutor = new CommandExecutorMock(function(data, callback){
					throw null;
				}),
				execution = new Execution(commandExecutor, jobDescriptor);

			execution.invoke();

			commandExecutor.expect('0123456', 'test job', { test: '1a' }, 'An error occurred',
				JobDescriptorStatus.Scheduled, JobInstanceStatus.Error);

			done();
		});
	});
});