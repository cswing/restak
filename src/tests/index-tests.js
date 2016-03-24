'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	mock = require('mock-fs'),
	config = require('config');

// setup a config setting
config.http = {
	port: 21314
};

config.restak = {
	'data-dir': {
		jobs: 'c:/jobs/'
	}
};

var fs = mock.fs({
	'c:/jobs/': {}
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
		var appDescriptor = {
				name: 'Integration Tests',
				version: 'v0.1.0-TEST'
			},
			appContext = new ApplicationContext(config);

		// Registration
		//restak.scheduler.nedb.register(appContext); // TMP until nedb scheduler is implemented
		//restak.scheduler.register(appContext);

		appServer = new ApplicationServer(appDescriptor, appContext);
		appServer.start(function(){
			
			// test that there is a scheduler object
			done();
		});		
	});

});