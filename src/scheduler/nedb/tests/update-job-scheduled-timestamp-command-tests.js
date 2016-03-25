'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	mock = require('mock-fs'),
	moment = require('moment'),
	transforms = require('../transforms'),
	Datastore = require('nedb'),
	UpdateJobScheduledTimestampCommand = require('../update-job-scheduled-timestamp-command');

describe('scheduler > nedb > update-job-scheduled-timestamp', function() {

	describe('#execute', function(){

		it('should update the job', function(done) {

			var jobStore = new Datastore(),
				command = new UpdateJobScheduledTimestampCommand(jobStore, transforms.jobTransform);

			jobStore.insert([{
					"_id": "12345",
					"name": "Test Job"
				}], function (err, newDocs) {
					
					var timestamp = moment().toISOString(),
						instr = {
							data: {
								jobId: "12345",
								timestamp: timestamp
							}
						};

					command.execute(instr, function(err, result){
						expect(err).to.be.null;
						
						expect(result).to.have.deep.property('nextExecution', timestamp);
						
						jobStore.find({_id: "12345"}, function(err, jobs){
							expect(err).to.be.null;
						
							expect(jobs[0]).to.have.deep.property('nextExecution', timestamp);
							done();
						});
					});
				});
		});

		it('should handle error if the file does not exist', function(done) {

			var jobStore = new Datastore(),
				command = new UpdateJobScheduledTimestampCommand(jobStore, transforms.jobTransform);

			var timestamp = moment().toISOString(),
				instr = {
					data: {
						jobId: "12345",
						timestamp: timestamp
					}
				};

			command.execute(instr, function(err, result){
				expect(err).to.equal('Job [12345] does not exist');
				expect(result).to.be.null;
				done();
			});
		});

	});
});