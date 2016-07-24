'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	log4js = require('log4js'),
	request = require('supertest'),
	ResourceEndpoint = require('../../rest/endpoints/resource-endpoint'),
	ApplicationContext = require('../application-context'),
	ApplicationServer = require('../application-server'),
	DefaultConfig = require('../config');

var config = new DefaultConfig({
		'http.port': 21314,
		'appName': 'test app server',
		'appVersion': '0.1.0-TEST'
	}),
	appContext = new ApplicationContext(config);

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

			appServer = new ApplicationServer();

			expect(appServer).to.have.property('initialized', false);

			done();
		});

		it('should initialize', function(done){

			appServer = new ApplicationServer(appContext);

			expect(appServer).to.have.property('initialized', true);
			expect(appServer).to.have.property('running', false);

			done();
		});
	});

	describe('#initialize', function(){

		it('should initialize', function(done){

			appServer = new ApplicationServer();
			appServer.initialize(appContext, false);

			expect(appServer).to.have.property('initialized', true);
			expect(appServer).to.have.property('running', false);

			done();
		});

		it('should not initialize a null context', function(done){

			appServer = new ApplicationServer();

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

			appServer = new ApplicationServer();

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

			appServer = new ApplicationServer();

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

			appServer = new ApplicationServer();
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

			appServer = new ApplicationServer();

			appServer.initialize(appContext, true);

			setTimeout(function(){ // need to wait to test.  There is no callback 

				expect(appServer).to.have.property('running', true);

				request(appServer.app)
					.get('/api/')
					.expect('Content-Type', /json/)
					.expect(200)
					.end(function(err, res){

						console.dir(res.statusCode);

						expect(err).to.be.null;
						expect(res.body).to.deep.equal(
							{ 
								application: { 
									name: 'test app server', 
									version: '0.1.0-TEST' 
								},
								payload: { test: 'test content' },
								messages: [] 
							});
						done();
					});
			}, 50);
		});

	});

	describe('#start', function(){

		it('should start and execute deferred command executions', function(done){
			
			var appContext = new ApplicationContext(config),
				executedInstr = null,
				testCommand = {
					execute: function(instr, callback) {
						executedInstr = instr;
						callback(null);
					}
				};

			appContext.registerCommand('test', testCommand);
			appContext.registerDeferredExecution('test', 'test deferred', {
				arg1: 'a', arg2: 'b'
			});

			appServer = new ApplicationServer();

			appServer.initialize(appContext, false);
			appServer.start(function(){
				
				expect(executedInstr).to.deep.equal({
					data: { arg1: 'a', arg2: 'b' }
				});

				done();
			});
		});

	});
});