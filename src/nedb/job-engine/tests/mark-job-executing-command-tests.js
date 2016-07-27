'use strict';

var expect = require('chai').expect,
	assert = require('chai').assert,
	Datastore = require('nedb'),
	models = require('../../../job-engine/models'),
	transforms = require('../transforms'),
	JobInstanceStatus = models.JobInstanceStatus,
	MarkJobExecutingCommand = require('../mark-job-executing-command');

describe('nedb > job-engine > mark-job-executing', function() {

	describe('#execute', function(){

		it('should update the job', function(done) {

			var instanceStore = new Datastore(),
				command = new MarkJobExecutingCommand(instanceStore, transforms.jobInstanceTransform);

			instanceStore.insert([{
					"_id": "12345",
					"status": JobInstanceStatus.Queued
				}], function (err) {
					
					var instr = {
						data: {
							instanceId: '12345'
						}
					};

					command.execute(instr, function(err, result){
						expect(err).to.be.null;
						
						expect(result).to.not.be.null;						
						expect(result).to.have.deep.property('id', '12345');
						expect(result).to.have.deep.property('status', JobInstanceStatus.Executing);
						expect(result.executionStartTimestamp).to.not.be.null;
						expect(result.executionStartUts).to.not.be.null;
						
						instanceStore.findOne({ _id: '12345' }, function(err, instance){
							
							expect(err).to.be.null;
							expect(instance).to.not.be.null;						
							expect(instance).to.have.property('_id', '12345');
							expect(instance).to.have.property('status', JobInstanceStatus.Executing);
							expect(instance.executionStartTimestamp).to.not.be.null;
							expect(instance.executionStartUts).to.not.be.null;

							done();
						});
					});
				}); // instanceStore.insert
		});

		it('it should err if it cannot find the instance in the queued status', function(done) {

			var instanceStore = new Datastore(),
				command = new MarkJobExecutingCommand(instanceStore, transforms.jobInstanceTransform);

			instanceStore.insert([{
					"_id": "12345",
					"status": JobInstanceStatus.Completed
				}], function (err) {
					
					var instr = {
						data: {
							instanceId: '12345'
						}
					};

					command.execute(instr, function(err, result){
						expect(err).to.equal('Unable to find an instance[12345] in a queued status.');
						expect(result).to.be.null;						
						
						instanceStore.findOne({ _id: '12345' }, function(err, instance){
							
							expect(err).to.be.null;
							expect(instance).to.not.be.null;						
							expect(instance).to.have.property('_id', '12345');
							expect(instance).to.have.property('status', JobInstanceStatus.Completed);
							
							done();
						});
					});
				}); // instanceStore.insert
		});
	});
});