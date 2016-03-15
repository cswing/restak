'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	models = require('../models'),
	JobDescriptorStatus = models.JobDescriptorStatus,
	Scheduler = require('../scheduler');

describe.only('scheduler > engine', function() {

	describe('#initialize', function(){

		it('should register the job', function(done) {

			var jobs = [{
				id: '132132',
				description: 'test job',
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
			factory = {
				getCommand: function(jobDesc){
					return {
						execute: function(ci, cb) {
							cb(null, {});
						}
					}
				}
			};

			var scheduler = new Scheduler(query, factory);

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
					description: 'test job',
					status: JobDescriptorStatus.Scheduled,
					schedule: '42 * * * *',
					command: 'test.Command'
				},{
					id: '132132',
					description: 'another test job',
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
			factory = {
				getCommand: function(jobDesc){
					return {
						execute: function(ci, cb) {
							cb(null, {});
						}
					}
				}
			};

			var scheduler = new Scheduler(query, factory);

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
					description: 'test job',
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
			factory = {
				getCommand: function(jobDesc){
					return {
						execute: function(ci, cb) {
							cb(null, {});
						}
					}
				}
			};

			var scheduler = new Scheduler(query, factory);

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
					description: 'test job',
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
			factory = {
				getCommand: function(jobDesc){
					return {
						execute: function(ci, cb) {
							cb(null, {});
						}
					}
				}
			};

			var scheduler = new Scheduler(query, factory);

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
					description: 'test job',
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
			factory = {
				getCommand: function(jobDesc){
					return null;
				}
			};

			var scheduler = new Scheduler(query, factory);

			scheduler.initialize(function(err){
				expect(err).to.not.be.null;

				var jobRegistration = scheduler.jobStore['132132'];
				expect(jobRegistration).to.be.null;

				done();
			});
		});
		

		

		// it should handle when the command doesn't impl Command
	});
});