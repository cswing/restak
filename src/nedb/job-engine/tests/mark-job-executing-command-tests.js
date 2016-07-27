'use strict';

var expect = require('chai').expect,
	assert = require('chai').assert,
	mock = require('mock-fs'),
	moment = require('moment'),
	Datastore = require('nedb'),
	models = require('../../../job-engine/models'),
	transforms = require('../transforms'),
	JobDescriptorStatus = models.JobDescriptorStatus,
	JobInstanceStatus = models.JobInstanceStatus,
	MarkJobExecutingCommand = require('../mark-job-executing-command');

var testJob = { "id": "12345", "name": "testJob", "data": {} };

describe('nedb > job-engine > mark-job-executing', function() {

	describe('#execute', function(){

		it('should update the job', function(done) {

			var jobStore = new Datastore(),
				jobInstanceStore = new Datastore(),
				command = new MarkJobExecutingCommand(jobStore, jobInstanceStore, transforms.jobTransform, transforms.jobInstanceTransform);

			jobStore.insert([{
					"_id": "12345",
					"name": "Test Job"
				}], function (err, newDocs) {
					var instr = {
						data: {
							job: {
								id: testJob.id,
								name: testJob.name,
								status: null
							},
							instance: {
								jobId: testJob.id,
								name: testJob.name,
								instanceId: null,
								status: null,
								user: {
									id: 'SYSTEM',
									name: 'System'
								},
								data: testJob.data
							}
						}
					};

					command.execute(instr, function(err, result){
						expect(err).to.be.null;
						
						expect(result).to.have.deep.property('job.status', JobDescriptorStatus.Executing);
						expect(result).to.have.deep.property('instance.instanceId');
						expect(result).to.have.deep.property('instance.status', JobInstanceStatus.Executing);
						
						jobStore.find({ _id: testJob.id }, function(err, jobs){
							if(err) 
								return done(err);

							var job = jobs[0];

							expect(job).to.have.property('status', JobDescriptorStatus.Executing);

							jobInstanceStore.find({_id: result.instance.instanceId}, function(err, instances){
								if(err) 
									return done(err);

								var instance = instances[0];

								expect(instance).to.have.property('status', JobInstanceStatus.Executing);
								done();
							});
						});
					});
				}); // jobStore.insert
		});

		it('it should err if the job does not exist', function(done) {

			var jobStore = new Datastore(),
				jobInstanceStore = new Datastore(),
				command = new MarkJobExecutingCommand(jobStore, jobInstanceStore, transforms.jobTransform, transforms.jobInstanceTransform),
				instr = {
					data: {
						job: {
							id: testJob.id,
							name: testJob.name,
							status: null
						},
						instance: {
							jobId: testJob.id,
							name: testJob.name,
							instanceId: null,
							status: null,
							user: {
								id: 'SYSTEM',
								name: 'System'
							},
							data: testJob.data
						}
					}
				};

			command.execute(instr, function(err, result){
				expect(err).to.equal('Job [12345] does not exist');
				done();
			});
		});
	});
});