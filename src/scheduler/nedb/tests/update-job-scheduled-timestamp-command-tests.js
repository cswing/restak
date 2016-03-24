'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	mock = require('mock-fs'),
	moment = require('moment'),
	Datastore = require('nedb'),
	UpdateJobScheduledTimestampCommand = require('../update-job-scheduled-timestamp-command');

describe.only('scheduler > nedb > update-job-scheduled-timestamp', function() {

	describe('#execute', function(){

		it('should update the job', function(done) {

			var jobStore = new Datastore(),
				command = new UpdateJobScheduledTimestampCommand(jobStore);

			jobStore.insert([{
					"id": "12345",
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
						
						jobStore.find({id: "12345"}, function(err, jobs){
							expect(err).to.be.null;
						
							expect(jobs[0]).to.have.deep.property('nextExecution', timestamp);
							done();
						});
					});
				});
		});

		it('should handle error if the file does not exist', function(done) {

			var jobStore = new Datastore(),
				command = new UpdateJobScheduledTimestampCommand(jobStore);

			var timestamp = moment().toISOString(),
				instr = {
					data: {
						jobId: "12345",
						timestamp: timestamp
					}
				};

			command.execute(instr, function(err, result){
				expect(err).to.equal('A job with the id does not exist: 12345');
				expect(result).to.be.null;
				done();
			});
		});

	});
});