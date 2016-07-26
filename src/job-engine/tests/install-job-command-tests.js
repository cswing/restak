'use strict';

var expect = require('chai').expect,
	assert = require('chai').assert,
	ValidationError = require('../../command').ValidationError,
	InstallJobCommand = require('../install-job-command');

describe('scheduler > install-job', function() {

	describe('#execute', function(){

		it('should delegate to the underlying create-job command', function(done) {

			var sentInstr = null,
				delegate = {
					execute: function(cmdInstr, callback){
						sentInstr = cmdInstr;
						callback(null, {});
					}
				},
				command = new InstallJobCommand(delegate);

			var instr = {
				data: {
					name: 'Test Job',
					description: 'Test Description',
					commandKey: 'test.command'
				}
			};

			command.execute(instr, function(err, result){
				expect(err).to.be.null;
				expect(sentInstr).to.deep.equal(instr);

				done();
			});
		});

		it('should not callback with a duplicate job error', function(done) {

			var sentInstr = null,
				delegate = {
					execute: function(cmdInstr, callback){
						sentInstr = cmdInstr;
						callback(new ValidationError('non-unique', 'A job for the key test.job already exists.', 'commandKey'), null);
					}
				},
				command = new InstallJobCommand(delegate);

			var instr = {
				data: {
					name: 'Test Job',
					description: 'Test Description',
					commandKey: 'test.command'
				}
			};

			command.execute(instr, function(err, result){
				expect(err).to.be.null;
				expect(sentInstr).to.deep.equal(instr);

				done();
			});
		});

		it('should callback with any error other than the duplicate job error', function(done) {

			var sentInstr = null,
				error = new ValidationError('error', 'Some other error', 'commandKey'),
				delegate = {
					execute: function(cmdInstr, callback){
						sentInstr = cmdInstr;
						callback(error, null);
					}
				},
				command = new InstallJobCommand(delegate);

			var instr = {
				data: {
					name: 'Test Job',
					description: 'Test Description',
					commandKey: 'test.command'
				}
			};

			command.execute(instr, function(err, result){
				expect(err).to.equal(error);
				expect(sentInstr).to.deep.equal(instr);

				done();
			});
		});

	});
});