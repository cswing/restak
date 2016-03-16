'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	mock = require('mock-fs'),
	models = require('../../models'),
	JobDescriptorStatus = models.JobDescriptorStatus,
	JobInstanceStatus = models.JobInstanceStatus,
	MarkJobExecutingCommand = require('../fs-mark-job-executing-command');

var testJob = { "id": "12345", "name": "testJob", "data": {} };

describe('scheduler > fs-data > mark-job-executing', function() {

	describe('#execute', function(){

		it('should update the job', function(done) {

			var fs = mock.fs({
					'c:/jobs/': {
						'12345.json': JSON.stringify(testJob)
					}
				}),
				cmd = new MarkJobExecutingCommand(fs, 'c:/jobs/'),
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

			cmd.execute(instr, function(err, result){
				expect(err).to.be.null;
				
				expect(result).to.have.deep.property('data.job.status', JobDescriptorStatus.Executing);
				expect(result).to.have.deep.property('data.instance.instanceId');
				expect(result).to.have.deep.property('data.instance.status', JobInstanceStatus.Executing);
				
				fs.readFile('c:/jobs/12345.json', function(err, fileContent) {
					expect(err).to.be.null;
					var job = JSON.parse(fileContent);

					expect(job).to.have.deep.property('status', JobDescriptorStatus.Executing);
					expect(job).to.have.deep.property('instances[0].instanceId');
					expect(job).to.have.deep.property('instances[0].status', JobInstanceStatus.Executing);

					done();
				});
			});
		});

		it('it should err if the file does not exist', function(done) {

			var fs = mock.fs({
					'c:/jobs/': {}
				}),
				cmd = new MarkJobExecutingCommand(fs, 'c:/jobs/'),
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

			cmd.execute(instr, function(err, result){
				expect(err).to.equal('A job with the id does not exist: 12345');
				done();
			});
		});
	});
});