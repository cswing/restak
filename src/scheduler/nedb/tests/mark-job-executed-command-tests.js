'use strict';

var expect = require('chai').expect,
	assert = require('chai').assert,
	async = require('async'),
	mock = require('mock-fs'),
	Datastore = require('nedb'),
	models = require('../../models'),
	transforms = require('../transforms'),
	JobDescriptorStatus = models.JobDescriptorStatus,
	JobInstanceStatus = models.JobInstanceStatus,
	MarkJobExecutedCommand = require('../mark-job-executed-command');

describe('scheduler > nedb > mark-job-executed', function() {

	describe('#execute', function(){

		it('should update the job', function(done) {

			var jobStore = new Datastore(),
				jobInstanceStore = new Datastore(),
				command = new MarkJobExecutedCommand(jobStore, jobInstanceStore, transforms.jobTransform, transforms.jobInstanceTransform),
				insertTasks = [];

			insertTasks.push(function(cb){
				jobStore.insert({
					"_id": "12345",
					"name": "Test Job"
				}, cb);
			});

			insertTasks.push(function(cb){
				jobInstanceStore.insert({
					"_id": "0123456-1",
					"jobId": "12345",
					"name": "Test Job",
					"status": null
				}, cb);
			});

			async.parallel(insertTasks, function(err){
				if(err) return done(err);

				var job = { // restak.scheduler.JobDescriptor
						id: "12345", 
						name: "test job", 
						data: {}, 
						status: JobDescriptorStatus.Executing,
						schedule: '* * * * *',
					},
					instance = { // restak.scheduler.JobInstance
						jobId: '12345',
						name: 'test job', 
						instanceId: '0123456-1',
						status: JobInstanceStatus.Executing
					};

				// The caller of the command (scheduler) is responsible for telling us the job status (Scheduled or completed)
				job.status = JobDescriptorStatus.Scheduled;
				// The caller of the command (scheduler) is responsible for telling us the job status (Error or completed)
				instance.status = JobInstanceStatus.Completed;
				
				var instr = {
					data: {
						job: job,
						instance: instance
					}
				};

				command.execute(instr, function(err, result){
					expect(err).to.be.null;
					
					expect(result).to.have.deep.property('job.status', JobDescriptorStatus.Scheduled);
					expect(result).to.have.deep.property('instance.status', JobInstanceStatus.Completed);
					
					var expectTasks = [];

					expectTasks.push(function(cb){
						jobStore.find({'_id': "12345" }, function(err, jobs){
							if(err) return cb(err);

							var job = jobs[0];
							expect(job).to.not.be.null;
							expect(job).to.have.property('status', JobDescriptorStatus.Scheduled);
							cb();
						});
					});

					expectTasks.push(function(cb){
						jobInstanceStore.find({'_id': instance.instanceId }, function(err, instances){
							if(err) return cb(err);

							var instance = instances[0];
							expect(instance).to.not.be.null;
							expect(instance).to.have.property('status', JobInstanceStatus.Completed);
							cb();
						});
					});

					async.parallel(expectTasks, done);
				});

			});
		});

		it('should handle error if the job does not exist', function(done) {

			var jobStore = new Datastore(),
				jobInstanceStore = new Datastore(),
				command = new MarkJobExecutedCommand(jobStore, jobInstanceStore, transforms.jobTransform, transforms.jobInstanceTransform);

			var job = { // restak.scheduler.JobDescriptor
					id: "12345", 
					name: "test job", 
					data: {}, 
					status: JobDescriptorStatus.Executing,
					schedule: '* * * * *',
				},
				instance = { // restak.scheduler.JobInstance
					jobId: '12345',
					name: 'test job', 
					instanceId: '0123456-1',
					status: JobInstanceStatus.Executing
				};

			// The caller of the command (scheduler) is responsible for telling us the job status (Scheduled or completed)
			job.status = JobDescriptorStatus.Scheduled;
			// The caller of the command (scheduler) is responsible for telling us the job status (Error or completed)
			instance.status = JobInstanceStatus.Completed;
			
			var instr = {
				data: {
					job: job,
					instance: instance
				}
			};

			command.execute(instr, function(err, result){
				expect(err).to.equal('Job [12345] does not exist');
				expect(result).to.be.null;
				done();
			});
		});

		it('should handle the case where the job exists but the job instance does not', function(done) {
			
			var jobStore = new Datastore(),
				jobInstanceStore = new Datastore(),
				command = new MarkJobExecutedCommand(jobStore, jobInstanceStore, transforms.jobTransform, transforms.jobInstanceTransform),
				insertTasks = [];

			insertTasks.push(function(cb){
				jobStore.insert({
					"_id": "12345",
					"name": "Test Job"
				}, cb);
			});

			async.parallel(insertTasks, function(err){
				if(err) return done(err);

				var job = { // restak.scheduler.JobDescriptor
						id: "12345", 
						name: "test job", 
						data: {}, 
						status: JobDescriptorStatus.Executing,
						schedule: '* * * * *',
					},
					instance = { // restak.scheduler.JobInstance
						jobId: '12345',
						name: 'test job', 
						instanceId: '0123456-1',
						status: JobInstanceStatus.Executing
					};

				// The caller of the command (scheduler) is responsible for telling us the job status (Scheduled or completed)
				job.status = JobDescriptorStatus.Scheduled;
				// The caller of the command (scheduler) is responsible for telling us the job status (Error or completed)
				instance.status = JobInstanceStatus.Completed;
				
				var instr = {
					data: {
						job: job,
						instance: instance
					}
				};

				command.execute(instr, function(err, result){
					expect(err).to.be.null;
					
					expect(result).to.have.deep.property('job.status', JobDescriptorStatus.Scheduled);
					expect(result).to.have.deep.property('instance', null);
					
					var expectTasks = [];

					expectTasks.push(function(cb){
						jobStore.find({'_id': "12345" }, function(err, jobs){
							if(err) return cb(err);

							var job = jobs[0];
							expect(job).to.not.be.null;
							expect(job).to.have.property('status', JobDescriptorStatus.Scheduled);
							cb();
						});
					});

					async.parallel(expectTasks, done);
				});

			});
		});

	});
});