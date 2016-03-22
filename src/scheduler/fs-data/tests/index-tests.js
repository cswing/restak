'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	config = require('config'),
	ApplicationContext = require('../../../app-server/application-context'),
	register = require('../index').register;

describe('scheduler > fs-data', function() {

	describe('#register', function(){

		// TODO mock the use of ApplicationContext
		// TODO test if app setting not provided 
		//		appContext.getConfigSetting('restak.data-dir.jobs')
		//		this will require the mock to occur.  See not in harness-tests.js

		it('should register a query and 2 commands', function(done) {

			var appContext = new ApplicationContext(config);

			register(appContext);

			expect(appContext.hasQuery('restak.scheduler.JobsQuery')).to.equal(true);
			expect(appContext.hasCommand('restak.scheduler.MarkJobExecutingCommand')).to.equal(true);
			expect(appContext.hasCommand('restak.scheduler.MarkJobExecutedCommand')).to.equal(true);

			done();
		});

		it('should use default fs', function(done){

			var fs = require('fs'),
				appContext = new ApplicationContext(config);

			register(appContext);

			expect(appContext.getQuery('restak.scheduler.JobsQuery').fs).to.deep.equal(fs);
			expect(appContext.getCommand('restak.scheduler.MarkJobExecutingCommand').fs).to.deep.equal(fs);
			expect(appContext.getCommand('restak.scheduler.MarkJobExecutedCommand').fs).to.deep.equal(fs);

			done();
		});

		it('should use the custom fs we provide', function(done){

			var fs = { test: 'abc' },
				appContext = new ApplicationContext(config);

			register(appContext, {fs: fs});

			expect(appContext.getQuery('restak.scheduler.JobsQuery').fs).to.deep.equal(fs);
			expect(appContext.getCommand('restak.scheduler.MarkJobExecutingCommand').fs).to.deep.equal(fs);
			expect(appContext.getCommand('restak.scheduler.MarkJobExecutedCommand').fs).to.deep.equal(fs);

			done();
		});
	});
});