'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	ApplicationContext = require('../application-context-extensions'),
	DefaultConfig = require('../../app-server').DefaultConfig;

describe('scheduler > application-context', function() {

	var config = new DefaultConfig({
		'appName': 'Custom app name',
		'appVersion': '0.1.0-TEST'
	});

	describe('#registerJob', function(){

		it('should register the job', function(done) {

			var command = {
					execute: function(){}
				},
				appContext = new ApplicationContext(config);

			appContext.registerJob('test.job', command, {
				name: 'Test Job',
				description: 'Test Job Description'
			});

			expect(appContext.getCommand('test.job')).to.equal(command);
			expect(appContext.deferreds).to.have.deep.members([{
				commandKey: 'restak.job-engine.InstallJobCommand',
				description: 'Install job: Test Job',
				data: {
					commandKey: 'test.job',
					name: 'Test Job',
					description: 'Test Job Description'
				}				
			}]);

			done();
		});

	});
});