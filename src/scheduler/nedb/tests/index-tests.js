'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	mock = require('mock-fs'),
	async = require('async'),
	ApplicationContext = require('../../../app-server/application-context'),
	DefaultConfig =  require('../../../app-server/config'),
	register = require('../index').register;

describe('scheduler > nedb', function() {

	describe('#register', function(){

		var expectObjects = function(appContext) {
			expect(appContext.getObject('restak.scheduler.nedb.JobsDb')).to.not.be.null;
			expect(appContext.getObject('restak.scheduler.nedb.JobTransform')).to.not.be.null;
			expect(appContext.hasQuery('restak.scheduler.JobsQuery')).to.equal(true);

			expect(appContext.getObject('restak.scheduler.nedb.JobInstancesDb')).to.not.be.null;
			expect(appContext.getObject('restak.scheduler.nedb.JobInstanceTransform')).to.not.be.null;
			expect(appContext.hasQuery('restak.scheduler.JobInstancessQuery')).to.equal(true);

			expect(appContext.hasCommand('restak.scheduler.UpdateJobScheduledTimestampCommand')).to.equal(true);
			expect(appContext.hasCommand('restak.scheduler.MarkJobExecutingCommand')).to.equal(true);
			expect(appContext.hasCommand('restak.scheduler.MarkJobExecutedCommand')).to.equal(true);
		};

		beforeEach(function(done){
			
			var jobs = [],
				instances = [];

			//mock({
				//'/data/jobs.nedb': JSON.stringify(jobs),
				//'/data/job-instances.nedb': JSON.stringify(instances)
			//});

			done();
		});

		afterEach(function(done){
			mock.restore();
			done();
		});

		it('should register without file system settings', function(done){

			var config = new DefaultConfig({}),
				appContext = new ApplicationContext(config);

			register(appContext);
			expectObjects(appContext);

			done();
		});

		it('should register with file system settings', function(done){

			var config = new DefaultConfig({
//					'restak.data-dir.jobs': 'c:/data/jobs.nedb',
//					'restak.data-dir.job-instances': 'c:/data/job-instances.nedb'
				}),
				appContext = new ApplicationContext(config);
			
			register(appContext);
			expectObjects(appContext);

			var expectTasks = [];

			expectTasks.push(function(cb){
				var jobsDb = appContext.getObject('restak.scheduler.nedb.JobsDb');
				jobsDb.find({}, function(err, docs){
					
					// TODO inspect documents

					cb();
				});
			});

			expectTasks.push(function(cb){
				var instancesDb = appContext.getObject('restak.scheduler.nedb.JobInstancesDb');
				instancesDb.find({}, function(err, docs){
					
					// TODO inspect documents

					cb();
				});
			});

			async.parallel(expectTasks, function(err){
				mock.restore();
				done(err);	
			});
		});
	});
});