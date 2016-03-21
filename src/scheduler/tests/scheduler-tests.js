'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	models = require('../models'),
	JobDescriptorStatus = models.JobDescriptorStatus,
	JobInstanceStatus = models.JobInstanceStatus,
	Scheduler = require('../scheduler');

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
				}
			};

			var scheduler = new Scheduler(query, executor);

			scheduler.initialize(function(err){
				expect(err).to.not.be.null;

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
				}
			};

			var scheduler = new Scheduler(query, executor);

			scheduler.initialize(function(err){
				expect(err).to.not.be.null;

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
				}
			};

			var scheduler = new Scheduler(query, executor);

			scheduler.initialize(function(err){
				expect(err).to.not.be.null;

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
				}
			};

			var scheduler = new Scheduler(query, executor);

			scheduler.initialize(function(err){
				expect(err).to.not.be.null;

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
				}
			};

			var scheduler = new Scheduler(query, executor);

			scheduler.initialize(function(err){
				expect(err).to.not.be.null;

				var jobRegistration = scheduler.jobStore['132132'];
				expect(jobRegistration).to.be.null;

				done();
			});
		});
	});

	describe('#invokeJobCommand', function(){

		it('it should execute a command', function(done) {

			var jobInstance_pre = null,
				jobInstance_post = null,
				query = null,
				commandExecutor = {
					executeCommand: function(key, data, cb){
						if(key == 'restak.scheduler.MarkJobExecutingCommand') {
							jobInstance_pre = JSON.parse(JSON.stringify(data.instance));
							data.instance.instanceId = '0123456-0'
							cb(null, data);
							return;
						}

						if(key == 'restak.scheduler.MarkJobExecutedCommand') {
							jobInstance_post = data.instance;
							cb(null, data);
							return;
						}

						throw 'Bad key: ' + key;
					},
					_execute: function(key, ci, cb){
						if(key == 'test.job') {
							cb(null, { data: { test: '2a' }});
							return;
						}

						throw 'Bad key: ' + key;
					}
				};

			var scheduler = new Scheduler(query, commandExecutor),
				context = {
					job: {
						id: '0123456',
						name: 'test job',
						data: {
							test: '1a'
						},
						command: 'test.job'
					},
					scheduler: scheduler
				};

			scheduler.invokeJobCommand.bind(context)();
			
			// Before execution
			expect(jobInstance_pre).to.have.property('jobId', '0123456');
			expect(jobInstance_pre).to.have.property('name', 'test job');
			expect(jobInstance_pre).to.have.property('instanceId');
			expect(jobInstance_pre.instanceId).to.be.null;
			expect(jobInstance_pre).to.have.property('status', JobInstanceStatus.Executing);
			expect(jobInstance_pre).to.have.deep.property('user.id', 'SYSTEM');
			expect(jobInstance_pre).to.have.deep.property('user.name', 'System');
			expect(jobInstance_pre).to.have.deep.property('data.test', '1a');

			// After execution
			expect(jobInstance_post).to.have.property('jobId', '0123456');
			expect(jobInstance_post).to.have.property('name', 'test job');
			expect(jobInstance_post).to.have.property('instanceId', '0123456-0');
			expect(jobInstance_post).to.have.property('status', JobInstanceStatus.Completed);
			expect(jobInstance_post).to.have.deep.property('user.id', 'SYSTEM');
			expect(jobInstance_post).to.have.deep.property('user.name', 'System');
			expect(jobInstance_post).to.have.deep.property('data.test', '1a');
			expect(jobInstance_post).to.have.deep.property('result.test', '2a');

			done();
		});

		it('it should handle without error when the command does not return a result', function(done) {

			var jobInstance_pre = null,
				jobInstance_post = null,
				query = null,
				commandExecutor = {
					executeCommand: function(key, data, cb){
						if(key == 'restak.scheduler.MarkJobExecutingCommand') {
							jobInstance_pre = JSON.parse(JSON.stringify(data.instance));
							data.instance.instanceId = '0123456-0'
							cb(null, data);
							return;
						}

						if(key == 'restak.scheduler.MarkJobExecutedCommand') {
							jobInstance_post = data.instance;
							cb(null, data);
							return;
						}

						throw 'Bad key: ' + key;
					},
					_execute: function(key, ci, cb){
						if(key == 'test.job') {
							cb(null, null);
							return;
						}

						throw 'Bad key: ' + key;
					}
				};

			var scheduler = new Scheduler(query, commandExecutor),
				context = {
					job: {
						id: '0123456',
						name: 'test job',
						data: {
							test: '1a'
						},
						command: 'test.job'
					},
					scheduler: scheduler
				};

			scheduler.invokeJobCommand.bind(context)();

			// Before execution
			expect(jobInstance_pre).to.have.property('jobId', '0123456');
			expect(jobInstance_pre).to.have.property('name', 'test job');
			expect(jobInstance_pre).to.have.property('instanceId');
			expect(jobInstance_pre.instanceId).to.be.null;
			expect(jobInstance_pre).to.have.property('status', JobInstanceStatus.Executing);
			expect(jobInstance_pre).to.have.deep.property('user.id', 'SYSTEM');
			expect(jobInstance_pre).to.have.deep.property('user.name', 'System');
			expect(jobInstance_pre).to.have.deep.property('data.test', '1a');

			// After execution
			expect(jobInstance_post).to.have.property('jobId', '0123456');
			expect(jobInstance_post).to.have.property('name', 'test job');
			expect(jobInstance_post).to.have.property('instanceId', '0123456-0');
			expect(jobInstance_post).to.have.property('status', JobInstanceStatus.Completed);
			expect(jobInstance_post).to.have.deep.property('user.id', 'SYSTEM');
			expect(jobInstance_post).to.have.deep.property('user.name', 'System');
			expect(jobInstance_post).to.have.deep.property('data.test', '1a');
			expect(jobInstance_post).to.have.deep.property('result', null);

			done();
		});

		it('it should handle without error when the command does not return data property on the result', function(done) {

			var jobInstance_pre = null,
				jobInstance_post = null,
				query = null,
				commandExecutor = {
					executeCommand: function(key, data, cb){
						if(key == 'restak.scheduler.MarkJobExecutingCommand') {
							jobInstance_pre = JSON.parse(JSON.stringify(data.instance));
							data.instance.instanceId = '0123456-0'
							cb(null, data);
							return;
						}

						if(key == 'restak.scheduler.MarkJobExecutedCommand') {
							jobInstance_post = data.instance;
							cb(null, data);
							return;
						}

						throw 'Bad key: ' + key;
					},
					_execute: function(key, ci, cb){
						if(key == 'test.job') {
							cb(null, {});
							return;
						}

						throw 'Bad key: ' + key;
					}
				};

			var scheduler = new Scheduler(query, commandExecutor),
				context = {
					job: {
						id: '0123456',
						name: 'test job',
						data: {
							test: '1a'
						},
						command: 'test.job'
					},
					scheduler: scheduler
				};

			scheduler.invokeJobCommand.bind(context)();

			// Before execution
			expect(jobInstance_pre).to.have.property('jobId', '0123456');
			expect(jobInstance_pre).to.have.property('name', 'test job');
			expect(jobInstance_pre).to.have.property('instanceId');
			expect(jobInstance_pre.instanceId).to.be.null;
			expect(jobInstance_pre).to.have.property('status', JobInstanceStatus.Executing);
			expect(jobInstance_pre).to.have.deep.property('user.id', 'SYSTEM');
			expect(jobInstance_pre).to.have.deep.property('user.name', 'System');
			expect(jobInstance_pre).to.have.deep.property('data.test', '1a');

			// After execution
			expect(jobInstance_post).to.have.property('jobId', '0123456');
			expect(jobInstance_post).to.have.property('name', 'test job');
			expect(jobInstance_post).to.have.property('instanceId', '0123456-0');
			expect(jobInstance_post).to.have.property('status', JobInstanceStatus.Completed);
			expect(jobInstance_post).to.have.deep.property('user.id', 'SYSTEM');
			expect(jobInstance_post).to.have.deep.property('user.name', 'System');
			expect(jobInstance_post).to.have.deep.property('data.test', '1a');
			expect(jobInstance_post).to.have.deep.property('result', null);

			done();
		});

		it('it should mark the instance in error when the callback returns an error', function(done) {

			var jobInstance_pre = null,
				jobInstance_post = null,
				query = null,
				commandExecutor = {
					executeCommand: function(key, data, cb){
						if(key == 'restak.scheduler.MarkJobExecutingCommand') {
							jobInstance_pre = JSON.parse(JSON.stringify(data.instance));
							data.instance.instanceId = '0123456-0'
							cb(null, data);
							return;
						}

						if(key == 'restak.scheduler.MarkJobExecutedCommand') {
							jobInstance_post = data.instance;
							cb(null, data);
							return;
						}

						throw 'Bad key: ' + key;
					},
					_execute: function(key, ci, cb){
						if(key == 'test.job') {
							cb('An error occurred', null);
							return;
						}

						throw 'Bad key: ' + key;
					}
				};

			var scheduler = new Scheduler(query, commandExecutor),
				context = {
					job: {
						id: '0123456',
						name: 'test job',
						data: {
							test: '1a'
						},
						command: 'test.job'
					},
					scheduler: scheduler
				};

			scheduler.invokeJobCommand.bind(context)();

			// Before execution
			expect(jobInstance_pre).to.have.property('jobId', '0123456');
			expect(jobInstance_pre).to.have.property('name', 'test job');
			expect(jobInstance_pre).to.have.property('instanceId');
			expect(jobInstance_pre.instanceId).to.be.null;
			expect(jobInstance_pre).to.have.property('status', JobInstanceStatus.Executing);
			expect(jobInstance_pre).to.have.deep.property('user.id', 'SYSTEM');
			expect(jobInstance_pre).to.have.deep.property('user.name', 'System');
			expect(jobInstance_pre).to.have.deep.property('data.test', '1a');

			// After execution
			expect(jobInstance_post).to.have.property('jobId', '0123456');
			expect(jobInstance_post).to.have.property('name', 'test job');
			expect(jobInstance_post).to.have.property('instanceId', '0123456-0');
			expect(jobInstance_post).to.have.property('status', JobInstanceStatus.Error);
			expect(jobInstance_post).to.have.deep.property('user.id', 'SYSTEM');
			expect(jobInstance_post).to.have.deep.property('user.name', 'System');
			expect(jobInstance_post).to.have.deep.property('data.test', '1a');
			expect(jobInstance_post).to.have.deep.property('result', 'An error occurred');

			done();
		});

		it('it should mark the instance in error when the command throws a string error', function(done) {

			var jobInstance_pre = null,
				jobInstance_post = null,
				query = null,
				commandExecutor = {
					executeCommand: function(key, data, cb){
						if(key == 'restak.scheduler.MarkJobExecutingCommand') {
							jobInstance_pre = JSON.parse(JSON.stringify(data.instance));
							data.instance.instanceId = '0123456-0'
							cb(null, data);
							return;
						}

						if(key == 'restak.scheduler.MarkJobExecutedCommand') {
							jobInstance_post = data.instance;
							cb(null, data);
							return;
						}

						throw 'Bad key: ' + key;
					},
					_execute: function(key, ci, cb){
						if(key == 'test.job') {
							throw 'An error occurred';
						}

						throw 'Bad key: ' + key;
					}
				};

			var scheduler = new Scheduler(query, commandExecutor),
				context = {
					job: {
						id: '0123456',
						name: 'test job',
						data: {
							test: '1a'
						},
						command: 'test.job'
					},
					scheduler: scheduler
				};

			scheduler.invokeJobCommand.bind(context)();

			// Before execution
			expect(jobInstance_pre).to.have.property('jobId', '0123456');
			expect(jobInstance_pre).to.have.property('name', 'test job');
			expect(jobInstance_pre).to.have.property('instanceId');
			expect(jobInstance_pre.instanceId).to.be.null;
			expect(jobInstance_pre).to.have.property('status', JobInstanceStatus.Executing);
			expect(jobInstance_pre).to.have.deep.property('user.id', 'SYSTEM');
			expect(jobInstance_pre).to.have.deep.property('user.name', 'System');
			expect(jobInstance_pre).to.have.deep.property('data.test', '1a');

			// After execution
			expect(jobInstance_post).to.have.property('jobId', '0123456');
			expect(jobInstance_post).to.have.property('name', 'test job');
			expect(jobInstance_post).to.have.property('instanceId', '0123456-0');
			expect(jobInstance_post).to.have.property('status', JobInstanceStatus.Error);
			expect(jobInstance_post).to.have.deep.property('user.id', 'SYSTEM');
			expect(jobInstance_post).to.have.deep.property('user.name', 'System');
			expect(jobInstance_post).to.have.deep.property('data.test', '1a');
			expect(jobInstance_post).to.have.deep.property('result', 'An error occurred');

			done();
		});

		it('it should mark the instance in error when the command throws a error object', function(done) {

			var jobInstance_pre = null,
				jobInstance_post = null,
				query = null,
				commandExecutor = {
					executeCommand: function(key, data, cb){
						if(key == 'restak.scheduler.MarkJobExecutingCommand') {
							jobInstance_pre = JSON.parse(JSON.stringify(data.instance));
							data.instance.instanceId = '0123456-0'
							cb(null, data);
							return;
						}

						if(key == 'restak.scheduler.MarkJobExecutedCommand') {
							jobInstance_post = data.instance;
							cb(null, data);
							return;
						}

						throw 'Bad key: ' + key;
					},
					_execute: function(key, ci, cb){
						if(key == 'test.job') {
							throw new Error("An error occurred");
						}

						throw 'Bad key: ' + key;
					}
				};

			var scheduler = new Scheduler(query, commandExecutor),
				context = {
					job: {
						id: '0123456',
						name: 'test job',
						data: {
							test: '1a'
						},
						command: 'test.job'
					},
					scheduler: scheduler
				};

			scheduler.invokeJobCommand.bind(context)();

			// Before execution
			expect(jobInstance_pre).to.have.property('jobId', '0123456');
			expect(jobInstance_pre).to.have.property('name', 'test job');
			expect(jobInstance_pre).to.have.property('instanceId');
			expect(jobInstance_pre.instanceId).to.be.null;
			expect(jobInstance_pre).to.have.property('status', JobInstanceStatus.Executing);
			expect(jobInstance_pre).to.have.deep.property('user.id', 'SYSTEM');
			expect(jobInstance_pre).to.have.deep.property('user.name', 'System');
			expect(jobInstance_pre).to.have.deep.property('data.test', '1a');

			// After execution
			expect(jobInstance_post).to.have.property('jobId', '0123456');
			expect(jobInstance_post).to.have.property('name', 'test job');
			expect(jobInstance_post).to.have.property('instanceId', '0123456-0');
			expect(jobInstance_post).to.have.property('status', JobInstanceStatus.Error);
			expect(jobInstance_post).to.have.deep.property('user.id', 'SYSTEM');
			expect(jobInstance_post).to.have.deep.property('user.name', 'System');
			expect(jobInstance_post).to.have.deep.property('data.test', '1a');
			expect(jobInstance_post).to.have.deep.property('result', 'An error occurred');

			done();
		});

		it('it should mark the instance in error when the command throws a null object', function(done) {

			var jobInstance_pre = null,
				jobInstance_post = null,
				query = null,
				commandExecutor = {
					executeCommand: function(key, data, cb){
						if(key == 'restak.scheduler.MarkJobExecutingCommand') {
							jobInstance_pre = JSON.parse(JSON.stringify(data.instance));
							data.instance.instanceId = '0123456-0'
							cb(null, data);
							return;
						}

						if(key == 'restak.scheduler.MarkJobExecutedCommand') {
							jobInstance_post = data.instance;
							cb(null, data);
							return;
						}

						throw 'Bad key: ' + key;
					},
					_execute: function(key, ci, cb){
						if(key == 'test.job') {
							throw null;
						}

						throw 'Bad key: ' + key;
					}
				};

			var scheduler = new Scheduler(query, commandExecutor),
				context = {
					job: {
						id: '0123456',
						name: 'test job',
						data: {
							test: '1a'
						},
						command: 'test.job'
					},
					scheduler: scheduler
				};

			scheduler.invokeJobCommand.bind(context)();

			// Before execution
			expect(jobInstance_pre).to.have.property('jobId', '0123456');
			expect(jobInstance_pre).to.have.property('name', 'test job');
			expect(jobInstance_pre).to.have.property('instanceId');
			expect(jobInstance_pre.instanceId).to.be.null;
			expect(jobInstance_pre).to.have.property('status', JobInstanceStatus.Executing);
			expect(jobInstance_pre).to.have.deep.property('user.id', 'SYSTEM');
			expect(jobInstance_pre).to.have.deep.property('user.name', 'System');
			expect(jobInstance_pre).to.have.deep.property('data.test', '1a');

			// After execution
			expect(jobInstance_post).to.have.property('jobId', '0123456');
			expect(jobInstance_post).to.have.property('name', 'test job');
			expect(jobInstance_post).to.have.property('instanceId', '0123456-0');
			expect(jobInstance_post).to.have.property('status', JobInstanceStatus.Error);
			expect(jobInstance_post).to.have.deep.property('user.id', 'SYSTEM');
			expect(jobInstance_post).to.have.deep.property('user.name', 'System');
			expect(jobInstance_post).to.have.deep.property('data.test', '1a');
			expect(jobInstance_post).to.have.deep.property('result', 'An error occurred');

			done();
		});
	});

});