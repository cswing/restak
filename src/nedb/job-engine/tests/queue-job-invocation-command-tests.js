'use strict';

var expect = require('chai').expect,
	assert = require('chai').assert,
	async = require('async'),
	Joi = require('joi'),
	Datastore = require('nedb'),
	models = require('../../../job-engine/models'),
	JobInstanceStatus = models.JobInstanceStatus,
	transforms = require('../transforms'),
	QueueJobInvocationCommand = require('../queue-job-invocation-command');

describe('nedb > jobs > queue-job-invocation', function() {

	describe('#validation', function(){
		
		it('should tell me what fields are required', function(done) {

			var joiOptions = {
					abortEarly: false
				},
				request = {};

			Joi.validate(request, QueueJobInvocationCommand.validation, joiOptions, function (errors, value) {
				expect(errors).to.not.be.null;
				expect(errors).to.have.deep.property('details');
				expect(errors).to.have.deep.property('details.length', 1);
				expect(errors.details).to.have.deep.members([ 
					{ 
						message: '"jobId" is required',
						path: 'jobId',
						type: 'any.required',
						context: { key: 'jobId' } 
					} 
				]);
				done();
			});

		});

		it('should successfully validate without params', function(done) {

			var joiOptions = {
					abortEarly: false
				},
				request = {
					jobId: '1234'
				};

			Joi.validate(request, QueueJobInvocationCommand.validation, joiOptions, function (errors, value) {
				expect(errors).to.be.null;
				done();
			});
		});

		it('should successfully validate with params object', function(done) {

			var joiOptions = {
					abortEarly: false
				},
				request = {
					jobId: '1234',
					params: {
						arg1: 'a'
					}
				};

			Joi.validate(request, QueueJobInvocationCommand.validation, joiOptions, function (errors, value) {
				expect(errors).to.be.null;
				done();
			});
		});

		it('should tell me that params must be an object', function(done) {

			var joiOptions = {
					abortEarly: false
				},
				request = {
					jobId: '1234',
					params: 'test'
				};

			Joi.validate(request, QueueJobInvocationCommand.validation, joiOptions, function (errors, value) {
				expect(errors).to.not.be.null;
				expect(errors).to.have.deep.property('details');
				expect(errors).to.have.deep.property('details.length', 1);
				expect(errors.details).to.have.deep.members([ 
					{ 
						message: '"params" must be an object',
						path: 'params',
						type: 'object.base',
						context: { key: 'params' } 
					} 
				]);
				done();
			});
		});
	});

	describe('#execute', function(){

		var jobsCollection, instancesCollection;

		beforeEach(function(done){
			jobsCollection = new Datastore();
			instancesCollection = new Datastore();

			jobsCollection.insert({
				_id: '1234',
				name: 'Test Job',
				description: 'Test Job Description',
				commandKey: 'test.job'
			}, function(err){
				done(err);
			});
		});

		it('should create an instance of a job and mark it as queued', function(done) {

			var command = new QueueJobInvocationCommand(jobsCollection, instancesCollection, transforms.jobInstanceTransform),
				instr = {
					data: {
						jobId: '1234',
						params: {
							arg1: 'a',
							arg2: 'b'
						}
					}
				};
			
			command.execute(instr, function(err, instance){
				expect(err).to.be.null;

				expect(instance).to.have.deep.property('id');
				expect(instance).to.have.deep.property('jobId', '1234');
				expect(instance).to.have.deep.property('name', 'Test Job');
				expect(instance).to.have.deep.property('description', 'Test Job Description');
				expect(instance).to.have.deep.property('commandKey', 'test.job');
				expect(instance).to.have.deep.property('queuedTimestamp');
				expect(instance).to.have.deep.property('queuedUts');
				expect(instance).to.have.deep.property('executionStartTimestamp', null);
				expect(instance).to.have.deep.property('executionStartUts', null);
				expect(instance).to.have.deep.property('executionEndTimestamp', null);
				expect(instance).to.have.deep.property('executionEndUts', null);
				expect(instance).to.have.deep.property('status', JobInstanceStatus.Queued);
				expect(instance).to.have.deep.property('params.arg1', 'a');
				expect(instance).to.have.deep.property('params.arg2', 'b');

				done();
			});
		});
	
		it('should callback with an error, if the job does not exist', function(done) {
			
			var command = new QueueJobInvocationCommand(jobsCollection, instancesCollection, transforms.jobInstanceTransform),
				instr = {
					data: {
						jobId: '1235',
						params: {
							arg1: 'a',
							arg2: 'b'
						}
					}
				};
			
			command.execute(instr, function(err, instance){
				
				expect(err).to.have.property('type', 'entity.unknown');
				expect(err).to.have.property('field', 'jobId');
				expect(err).to.have.property('message', 'A job with this id does not exist.');

				expect(instance).to.be.null;

				done();
			});
		});

		it('should callback with an error, if the parameters cannot be serialized', function(done) {

			// create a circular reference
			var x = {
					arg1: 'a',
					arg2: null
				},
				y = {
					arg1: 'a',
					arg2: x
				};
			x.arg2 = y;

			var command = new QueueJobInvocationCommand(jobsCollection, instancesCollection, transforms.jobInstanceTransform),
				instr = {
					data: {
						jobId: '1234',
						params: x
					}
				};
			
			command.execute(instr, function(err, instance){
				
				expect(err).to.have.property('type', 'circular.reference');
				expect(err).to.have.property('field', 'params');
				expect(err).to.have.property('message', 'The params for this command contain a circular reference.');

				expect(instance).to.be.null;

				done();
			});
		});

	});
});