'use strict';

var expect = require('chai').expect,
	assert = require('chai').assert,
	Datastore = require('nedb'),
	models = require('../../../job-engine/models'),
	transforms = require('../transforms'),
	InstanceStatus = models.JobInstanceStatus,
	MarkJobExecutedCommand = require('../mark-job-executed-command');

describe('nedb > job-engine > mark-job-executed', function() {

	describe('#execute', function(){

		it('should update the job as completed', function(done) {

			var instanceStore = new Datastore(),
				command = new MarkJobExecutedCommand(instanceStore, transforms.jobInstanceTransform);

			instanceStore.insert([{
					"_id": "12345",
					"status": InstanceStatus.Executing
				}], function (err) {
					
					var instr = {
						data: {
							instanceId: '12345',
							status: InstanceStatus.Completed,
							result: { msg: '120 items processed' }
						}
					};

					command.execute(instr, function(err, result){
						expect(err).to.be.null;
						
						expect(result).to.not.be.null;						
						expect(result).to.have.deep.property('id', '12345');
						expect(result).to.have.deep.property('status', InstanceStatus.Completed);
						expect(result.result).to.deep.equal({ msg: '120 items processed' });
						expect(result.executionEndTimestamp).to.not.be.null;
						expect(result.executionEndUts).to.not.be.null;
						
						instanceStore.findOne({ _id: '12345' }, function(err, instance){
							
							expect(err).to.be.null;
							expect(instance).to.not.be.null;						
							expect(instance).to.have.property('_id', '12345');
							expect(instance).to.have.property('status', InstanceStatus.Completed);
							expect(instance.result).to.deep.equal({ msg: '120 items processed' });
							expect(instance.executionEndTimestamp).to.not.be.null;
							expect(instance.executionEndUts).to.not.be.null;

							done();
						});
					});
				}); // instanceStore.insert
		});
		
		it('should update the job as errored', function(done) {

			var instanceStore = new Datastore(),
				command = new MarkJobExecutedCommand(instanceStore, transforms.jobInstanceTransform);

			instanceStore.insert([{
					"_id": "12345",
					"status": InstanceStatus.Executing
				}], function (err) {
					
					var instr = {
						data: {
							instanceId: '12345',
							status: InstanceStatus.Error,
							result: 'An error occurred'
						}
					};

					command.execute(instr, function(err, result){
						expect(err).to.be.null;
						
						expect(result).to.not.be.null;						
						expect(result).to.have.property('id', '12345');
						expect(result).to.have.property('status', InstanceStatus.Error);
						expect(result).to.have.property('result', 'An error occurred');
						expect(result.executionEndTimestamp).to.not.be.null;
						expect(result.executionEndUts).to.not.be.null;
						
						instanceStore.findOne({ _id: '12345' }, function(err, instance){
							
							expect(err).to.be.null;
							expect(instance).to.not.be.null;						
							expect(instance).to.have.property('_id', '12345');
							expect(instance).to.have.property('status', InstanceStatus.Error);
							expect(instance).to.have.property('result', 'An error occurred');
							expect(instance.executionEndTimestamp).to.not.be.null;
							expect(instance.executionEndUts).to.not.be.null;

							done();
						});
					});
				}); // instanceStore.insert
		});

		it('it should err if it cannot find the instance in the executing status', function(done) {

			var instanceStore = new Datastore(),
				command = new MarkJobExecutedCommand(instanceStore, transforms.jobInstanceTransform);

			instanceStore.insert([{
					"_id": "12345",
					"status": InstanceStatus.Completed
				}], function (err) {
					
					var instr = {
						data: {
							instanceId: '12345'
						}
					};

					command.execute(instr, function(err, result){
						expect(err).to.equal('Unable to find an instance[12345] in a executing status.');
						expect(result).to.be.null;						
						
						instanceStore.findOne({ _id: '12345' }, function(err, instance){
							
							expect(err).to.be.null;
							expect(instance).to.not.be.null;						
							expect(instance).to.have.property('_id', '12345');
							expect(instance).to.have.property('status', InstanceStatus.Completed);
							
							done();
						});
					});
				}); // instanceStore.insert
		});
	});
});