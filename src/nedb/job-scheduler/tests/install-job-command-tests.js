'use strict';

var expect = require('chai').expect,
	assert = require('chai').assert,
	async = require('async'),
	Datastore = require('nedb'),
	models = require('../../../job-scheduler/models'),
	transforms = require('../transforms'),
	JobDescriptorStatus = models.JobDescriptorStatus,
	JobInstanceStatus = models.JobInstanceStatus,
	InstallJobCommand = require('../install-job-command');

describe('nedb > scheduler > install-job', function() {

	describe('#execute', function(){

		var jobsCollection;

		beforeEach(function(done){

			jobsCollection = new Datastore();

			jobsCollection.ensureIndex({
					fieldName: 'commandKey',
					unique: 'true'
			}, done);
		});


		it('should install the job', function(done) {

			var command = new InstallJobCommand(jobsCollection, transforms.jobTransform);

			var instr = {
				data: {
					name: 'Test Job',
					description: 'Test Description',
					commandKey: 'test.command'
				}
			};

			command.execute(instr, function(err, result){
				expect(err).to.be.null;
				
				expect(result).to.have.property('id');
				expect(result).to.have.property('name', 'Test Job');
				expect(result).to.have.property('description', 'Test Description');
				expect(result).to.have.property('commandKey', 'test.command');
				
				jobsCollection.findOne({ _id: result.id }, function(err, doc){

					expect(err).to.be.null;
					expect(doc).to.have.property('_id', result.id);
					expect(doc).to.have.property('name', 'Test Job');
					expect(doc).to.have.property('description', 'Test Description');
					expect(doc).to.have.property('commandKey', 'test.command');
				
					done();
				});
			});
		});

		it('should return an error because a job with the same key has already been installed', function(done) {

			var command = new InstallJobCommand(jobsCollection, transforms.jobTransform),
				originalJob = {
					name: 'Test Job',
					description: 'Test Description',
					commandKey: 'test.command'	
				},
				instr = {
					data: {
						name: 'Second Test Job',
						description: 'Second Test Description',
						commandKey: 'test.command'
					}
				};

			jobsCollection.insert(originalJob, function(err, job){
				expect(err).to.be.null;
				originalJob = job;

				command.execute(instr, function(err, result){

					expect(err).to.have.deep.property('message', 'A job for the key test.command already exists.');
					expect(err).to.have.deep.property('field', 'commandKey');
					expect(err).to.have.deep.property('type', 'non-unique');

					expect(result).to.be.null;

					jobsCollection.findOne({ commandKey: 'test.command' }, function(err, doc){

						expect(err).to.be.null;
						expect(doc).to.have.property('_id', job._id);
						expect(doc).to.have.property('name', 'Test Job');
						expect(doc).to.have.property('description', 'Test Description');
						expect(doc).to.have.property('commandKey', 'test.command');
					
						done();
					});
				});
			});
		});

	});
});