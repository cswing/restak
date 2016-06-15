'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	DefaultConfig = require('../app-server/config');

var config = new DefaultConfig({
	'http.port': 21314,
	appName: 'Integration Tests',
	appVersion: 'v0.1.0-TEST'
});

var appServer;

describe('restak core', function() {

	afterEach(function(done){
		if(appServer){
			appServer.stop(function(){
				done();
			});
		} else {
			done();
		}
	});

	it('should not error when configuring with nedb as backing store', function(done) {

		var restak = require('../index'),
			ApplicationContext = restak.appServer.ApplicationContext,
			ApplicationServer = restak.appServer.ApplicationServer;

		// Configure application context & server.
		var appContext = new ApplicationContext(config);

		// Registration
		restak.nedb.scheduler.register(appContext);
		restak.scheduler.register(appContext);

		appServer = new ApplicationServer(appContext);
		appServer.start(function(){
			
			expect(appContext.getObject('restak.scheduler.Scheduler')).to.not.be.null;
			
			done();
		});		
	});

});