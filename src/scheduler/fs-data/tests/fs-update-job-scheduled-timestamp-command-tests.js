'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	mock = require('mock-fs'),
	moment = require('moment'),
	UpdateJobScheduledTimestampCommand = require('../fs-update-job-scheduled-timestamp-command');

describe('scheduler > fs-data > update-job-scheduled-timestamp', function() {

	describe('#execute', function(){

		it('should update the recurring job', function(done) {

			var testJob = { 
					id: "12345", 
					name: "test job"
				},
				fs = mock.fs({
					'c:/jobs/': {
						'12345.json': JSON.stringify(testJob)
					}
				});

			var timestamp = moment().toISOString();

			var cmd = new UpdateJobScheduledTimestampCommand(fs, 'c:/jobs/'),
				instr = {
					data: {
						jobId: "12345",
						timestamp: timestamp
					}
				};

			cmd.execute(instr, function(err, result){
				expect(err).to.be.null;
				
				expect(result).to.have.deep.property('nextExecution', timestamp);
				
				fs.readFile('c:/jobs/12345.json', function(err, fileContent) {
					expect(err).to.be.null;
					var job = JSON.parse(fileContent);

					expect(job).to.have.deep.property('nextExecution', timestamp);

					done();
				});
			});
		});

		it('should handle error if the file does not exist', function(done) {

			var testJob = { 
					id: "12345", 
					name: "test job"
				},
				fs = mock.fs({});
				
			var timestamp = moment().toISOString();

			var cmd = new UpdateJobScheduledTimestampCommand(fs, 'c:/jobs/'),
				instr = {
					data: {
						jobId: "12345",
						timestamp: timestamp
					}
				};

			cmd.execute(instr, function(err, result){
				expect(err).to.equal('A job with the id does not exist: 12345');
				expect(result).to.be.null;
				done();
			});
		});

	});
});