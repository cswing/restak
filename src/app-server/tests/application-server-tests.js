'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	log4js = require('log4js'),
	config = require('config'),
	request = require('supertest'),
	ResourceEndpoint = require('../../rest/endpoints/resource-endpoint'),
	ApplicationContext = require('../application-context'),
	ApplicationServer = require('../application-server');

// setup a config setting
config.http = {
	port: 21314
};

var appDescriptor = {
	name: 'test app server',
	version: '0.1.0-TEST'
};

var TestEndpoint = function(){
	ResourceEndpoint.apply(this, [log4js.getLogger('restak.test.TestEndpoint'),	'/']);
};
util.inherits(TestEndpoint, ResourceEndpoint);

TestEndpoint.prototype.getPayload = function(req, callback){
	callback(null, { test: 'test content'});
};

var appServer;

describe('app-server > application-server', function() {

	afterEach(function(done){
		if(appServer){
			appServer.stop(function(){
				done();
			});
		} else {
			done();
		}
	});

	describe('#ctor', function(){

		it('should not be initialized', function(done) {

			appServer = new ApplicationServer(appDescriptor);

			expect(appServer.appDescriptor).to.deep.equal(appDescriptor);
			expect(appServer).to.have.property('initialized', false);

			done();
		});

		it('should initialize', function(done){

			var appContext = new ApplicationContext(config);
			appServer = new ApplicationServer(appDescriptor, appContext);

			expect(appServer.appDescriptor).to.deep.equal(appDescriptor);
			expect(appServer).to.have.property('initialized', true);
			expect(appServer).to.have.property('running', false);

			done();
		});
	});

	describe('#initialize', function(){

		it('should initialize', function(done){

			var appContext = new ApplicationContext(config);
			appServer = new ApplicationServer(appDescriptor);

			appServer.initialize(appContext, false);

			expect(appServer.appDescriptor).to.deep.equal(appDescriptor);
			expect(appServer).to.have.property('initialized', true);
			expect(appServer).to.have.property('running', false);

			done();
		});

		it('should not initialize a null context', function(done){

			appServer = new ApplicationServer(appDescriptor);

			try{
				appServer.initialize(null);
			} catch(err){
				expect(err.message).to.equal('An appContext is required in order to initialize.');
				done();
				return;
			}

			done('Error expected');
		});

		it('should not initialize an undefined context', function(done){

			appServer = new ApplicationServer(appDescriptor);

			try{
				appServer.initialize(undefined);
			} catch(err){
				expect(err.message).to.equal('An appContext is required in order to initialize.');
				done();
				return;
			}

			done('Error expected');
		});

		it('should not initialize a 2nd time', function(done){

			var appContext = new ApplicationContext(config);
			appServer = new ApplicationServer(appDescriptor);

			appServer.initialize(appContext);

			try{
				appServer.initialize(appContext);
			} catch(err){
				expect(err.message).to.equal('The application server has already been initialized.');
				done();
				return;
			}

			done('Error expected');
		});

		it('should start a scheduler', function(done){

			var appContext = new ApplicationContext(config);

			var schedulerInitialized = false,
				scheduler = {
				initialize: function(cb){
					schedulerInitialized = true;
					cb();
				}
			};
			appContext.registerObject('restak.scheduler.Scheduler', scheduler);

			appServer = new ApplicationServer(appDescriptor);
			appServer.initialize(appContext);
			appServer.start(function(){
				expect(schedulerInitialized).to.equal(true);
				done();
			});
		});

		it('should start and make an endpoint available', function(done){

			var appContext = new ApplicationContext(config),
				endpoint = new TestEndpoint();

			appContext.registerEndpoint('test', endpoint);

			appServer = new ApplicationServer(appDescriptor);

			appServer.initialize(appContext, true);

			expect(appServer).to.have.property('running', true);

			request(appServer.restServer.app)
				.get('/')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res){
					expect(err).to.be.null;
					expect(res.body).to.deep.equal(
						{ 
							application: { 
								appName: 'test app server', 
								appVersion: '0.1.0-TEST' 
							},
							payload: { test: 'test content' },
							messages: [] 
						});
					done();
				});
		});

	});
});