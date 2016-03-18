'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	mock = require('mock-fs'),
	models = require('../../models'),
	JobDescriptorStatus = models.JobDescriptorStatus,
	JobInstanceStatus = models.JobInstanceStatus,
	MarkJobExecutedCommand = require('../fs-mark-job-executed-command');

describe('scheduler > fs-data > mark-job-executed', function() {

	describe('#execute', function(){

		it('should update the recurring job', function(done) {

			var testJob = { 
					id: "12345", 
					name: "test job", 
					data: {}, 
					status: JobDescriptorStatus.Executing, 
					schedule: '* * * * *',
					instances: [{
						jobId: '12345',
						name: 'test job', 
						instanceId: '0123456-1',
						status: null
					}]
				},
				fs = mock.fs({
					'c:/jobs/': {
						'12345.json': JSON.stringify(testJob)
					}
				});

			testJob.status = JobDescriptorStatus.Scheduled;
			testJob.instances[0].status = JobInstanceStatus.Completed;

			var cmd = new MarkJobExecutedCommand(fs, 'c:/jobs/'),
				instr = {
					data: {
						job: testJob,
						instance: testJob.instances[0]
					}
				};

			cmd.execute(instr, function(err, result){
				expect(err).to.be.null;
				
				expect(result).to.have.deep.property('data.job.status', JobDescriptorStatus.Scheduled);
				expect(result).to.have.deep.property('data.instance.status', JobInstanceStatus.Completed);
				
				fs.readFile('c:/jobs/12345.json', function(err, fileContent) {
					expect(err).to.be.null;
					var job = JSON.parse(fileContent);

					expect(job).to.have.deep.property('status', JobDescriptorStatus.Scheduled);
					expect(job).to.have.deep.property('instances[0].status', JobInstanceStatus.Completed);

					done();
				});
			});
		});

		it('should handle error if the file does not exist', function(done) {

			var testJob = { 
					id: "12345", 
					name: "test job", 
					data: {}, 
					status: JobDescriptorStatus.Executing, 
					instances: [{
						jobId: '12345',
						name: 'test job', 
						instanceId: '0123456-1',
						status: null
					}]
				},
				fs = mock.fs({
					'c:/jobs/': {}
				}),
				cmd = new MarkJobExecutedCommand(fs, 'c:/jobs/'),
				instr = {
					data: {
						job: testJob,
						instance: testJob.instances[0]
					}
				};

			cmd.execute(instr, function(err, result){
				expect(err).to.equal('A job with the id does not exist: 12345');
				expect(result).to.be.null;
				done();
			});
		});

		it('should handle error if job instance does not exist', function(done) {

			var testJob = { 
					id: "12345", 
					name: "test job", 
					data: {}, 
					status: JobDescriptorStatus.Executing, 
					instances: []
				},
				fs = mock.fs({
					'c:/jobs/': {
						'12345.json': JSON.stringify(testJob)
					}
				}),
				cmd = new MarkJobExecutedCommand(fs, 'c:/jobs/'),
				instr = {
					data: {
						job: testJob,
						instance: {
							jobId: '12345',
							name: 'test job', 
							instanceId: '0123456-1',
							status: null
						}
					}
				};

			cmd.execute(instr, function(err, result){
				
				expect(err).to.equal('A job instance with the id does not exist: 0123456-1');
				expect(result).to.be.null;
				
				fs.readFile('c:/jobs/12345.json', function(err, fileContent) {
					expect(err).to.be.null;
					var job = JSON.parse(fileContent);

					expect(job).to.have.deep.property('status', JobDescriptorStatus.Executing);
					done();
				});
			});
		});
	});
});