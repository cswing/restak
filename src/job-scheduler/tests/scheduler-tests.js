'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	models = require('../models'),
	JobDescriptorStatus = models.JobDescriptorStatus,
	JobInstanceStatus = models.JobInstanceStatus,
	Scheduler = require('../scheduler'),
	CommandExecutorMock = require('./command-executor-mock');

describe('scheduler', function() {

	describe('#initialize', function(){

		it('should register the job', function(done) {

			var jobs = [{
				id: '132132',
				name: 'test job',
				status: JobDescriptorStatus.Scheduled,
				schedule: '42 * * * *',
				command: 'test.Command'
			}];
			var query = {
				execute: function(qr, cb){
					cb(null, {
						filter: qr.filter,
						pageSize: jobs.length,
						pageCount: 1,
						totalCount: jobs.length,
						page: 1,
						items: jobs
					});
				}
			},
			executor = {
				commandFactory: {
					hasCommand: function(key) {
						return true;
					}
				},
				executeCommand: function(cmdKey, data, cb){
					cb(null, {});
				}
			};

			var scheduler = new Scheduler(query, executor);

			scheduler.initialize(function(err){

				expect(err).to.be.null;

				var jobRegistration = scheduler.jobStore['132132'];
				expect(jobRegistration).to.not.be.null;
				expect(jobRegistration).to.have.property('name', 'test job');

				done();
			});
		});

		it('it should only initialize one job if the job query returns 2 jobs with the same id', function(done) {

			var jobs = [
				{
					id: '132132',
					name: 'test job',
					status: JobDescriptorStatus.Scheduled,
					schedule: '42 * * * *',
					command: 'test.Command'
				},{
					id: '132132',
					name: 'another test job',
					status: JobDescriptorStatus.Scheduled,
					schedule: '42 * * * *',
					command: 'test.Command'
				}];
			var query = {
				execute: function(qr, cb){
					cb(null, {
						filter: qr.filter,
						pageSize: jobs.length,
						pageCount: 1,
						totalCount: jobs.length,
						page: 1,
						items: jobs
					});
				}
			},
			executor = {
				commandFactory: {
					hasCommand: function(key) {
						return true;
					}
				},
				executeCommand: function(cmdKey, data, cb){
					cb(null, {});
				}
			};

			var scheduler = new Scheduler(query, executor);

			scheduler.initialize(function(err){

				expect(err).to.be.null;

				var jobRegistration = scheduler.jobStore['132132'];
				expect(jobRegistration).to.not.be.null;
				expect(jobRegistration).to.have.property('name', 'test job');

				done();
			});
		});

		it('it should handle one-time jobs that do not have a schedule attribute', function(done) {

			var jobs = [{
					id: '132132',
					name: 'test job',
					status: JobDescriptorStatus.Scheduled,
					command: 'test.Command'
				}];
			var query = {
				execute: function(qr, cb){
					cb(null, {
						filter: qr.filter,
						pageSize: jobs.length,
						pageCount: 1,
						totalCount: jobs.length,
						page: 1,
						items: jobs
					});
				}
			},
			executor = {
				commandFactory: {
					hasCommand: function(key) {
						return true;
					}
				},
				executeCommand: function(cmdKey, data, cb){
					cb(null, {});
				}
			};

			var scheduler = new Scheduler(query, executor);

			scheduler.initialize(function(err){
				expect(err).to.be.null;

				var jobRegistration = scheduler.jobStore['132132'];
				expect(jobRegistration).to.not.be.null;
				expect(jobRegistration).to.have.property('name', 'test job');

				done();
			});
		});

		it('it should handle a bad schedule', function(done) {

			var jobs = [{
					id: '132132',
					name: 'test job',
					status: JobDescriptorStatus.Scheduled,
					schedule: 'XXXHJFKSDAHF',
					command: 'test.Command'
				}];
			var query = {
				execute: function(qr, cb){
					cb(null, {
						filter: qr.filter,
						pageSize: jobs.length,
						pageCount: 1,
						totalCount: jobs.length,
						page: 1,
						items: jobs
					});
				}
			},
			executor = {
				commandFactory: {
					hasCommand: function(key) {
						return true;
					}
				},
				executeCommand: function(cmdKey, data, cb){
					cb(null, {});
				}
			};

			var scheduler = new Scheduler(query, executor);

			scheduler.initialize(function(err){
				expect(err).to.be.null;

				var jobRegistration = scheduler.jobStore['132132'];
				expect(jobRegistration).to.be.null;

				done();
			});
		});
		
		it('it should handle when a command is not found', function(done) {

			var jobs = [{
					id: '132132',
					name: 'test job',
					status: JobDescriptorStatus.Scheduled,
					schedule: '42 * * * *',
					command: 'test.Command'
				}];
			var query = {
				execute: function(qr, cb){
					cb(null, {
						filter: qr.filter,
						pageSize: jobs.length,
						pageCount: 1,
						totalCount: jobs.length,
						page: 1,
						items: jobs
					});
				}
			},
			executor = {
				commandFactory: {
					hasCommand: function(key) {
						return false;
					}
				},
				executeCommand: function(cmdKey, data, cb){
					cb(null, {});
				}
			};

			var scheduler = new Scheduler(query, executor);

			scheduler.initialize(function(err){
				expect(err).to.be.null;

				var jobRegistration = scheduler.jobStore['132132'];
				expect(jobRegistration).to.be.null;

				done();
			});
		});
	});

	describe('#invokeJobCommand', function(){

		it('it should invoke an execution object', function(done) {

			var query = null,
				commandExecutor = new CommandExecutorMock(function(data, cb){
					cb(null, { resultData: 'ABC' });
				});

			var scheduler = new Scheduler(query, commandExecutor),
				context = {
					job: {
						id: '0123456',
						name: 'test job',
						data: {
							test: '1a'
						},
						command: 'test.job',
						schedule: '* * * * *'
					},
					scheduler: scheduler
				};

			scheduler.invokeJobCommand.bind(context)();
			
			commandExecutor.expect('0123456', 'test job', { test: '1a' }, { resultData: 'ABC' },
				JobDescriptorStatus.Scheduled, JobInstanceStatus.Completed);

			done();
		});

	});
});