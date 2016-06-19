'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	ApplicationContext = require('../application-context'),
	DefaultConfig = require('../config');

// setup a config setting
var config = new DefaultConfig({
	'restak-test': 'restak application framework'
});

describe('app-server > application-context', function() {

	describe('#ctor', function(){

		it('should create an object factory', function(done) {
			var ctx = new ApplicationContext(config);
			expect(ctx).to.have.property('objectFactory');
			done();
		});

		it('should create the default app descriptor', function(done) {
			var ctx = new ApplicationContext(config);
			expect(ctx.appDescriptor).to.deep.equal({
				name: 'Restak Application Server',
				version: null
			});
			done();
		});

		it('should create the app descriptor from config settings', function(done) {

			var config = new DefaultConfig({
				'appName': 'Custom app name',
				'appVersion': '0.1.0-TEST'
			});

			var ctx = new ApplicationContext(config);

			expect(ctx.appDescriptor).to.deep.equal({
				name: 'Custom app name',
				version: '0.1.0-TEST'
			});

			done();	
		});		

	});

	describe('#getConfigSetting', function(){

		it('should return a setting', function(done) {
			
			var ctx = new ApplicationContext(config),
				val = ctx.getConfigSetting('restak-test');

			expect(val).to.be.equal('restak application framework');
			
			done();
		});

		it('should return null for a setting not found', function(done){

			var ctx = new ApplicationContext(config),
				val = ctx.getConfigSetting('restak-test-not-there', false);

			expect(val).to.be.null;

			done();
		});

		it('should throw an error - I', function(done){

			var ctx = new ApplicationContext(config);

			try{
				ctx.getConfigSetting('restak-test-not-there');
				done('error expected');

			}catch(err){
				expect(err).to.equal('Undefined setting: restak-test-not-there');
			}

			done();
		});

		it('should throw an error - II', function(done){

			var ctx = new ApplicationContext(config);

			try{
				ctx.getConfigSetting('restak-test-not-there', true);
				done('error expected');

			}catch(err){
				expect(err).to.equal('Undefined setting: restak-test-not-there');
			}

			done();
		});
	});

	describe('#registerCommand #getCommand', function(){

		var Command = function(){};
		Command.prototype.execute = function(ci, cb){
			cb(null, {});
		};

		it('should register and return the command', function(done){

			var ctx = new ApplicationContext(),
				cmd = new Command();

			var result = ctx.registerCommand('test', cmd);
			expect(result).to.be.equal(true);

			var cmd2 = ctx.getCommand('test');
			expect(cmd2).to.equal(cmd);

			done();
		});

		it('should register with the underlying object factory using a prefix', function(done){

			var ctx = new ApplicationContext(),
				cmd = new Command();

			var result = ctx.registerCommand('test', cmd);
			expect(result).to.be.equal(true);
			
			var cmd2 = ctx.objectFactory.get('restak.command.Command::test');
			expect(cmd2).to.equal(cmd);

			done();
		});

		it('should throw CommandNotFoundError for a null key', function(done){

			var ctx = new ApplicationContext();

			try{
				ctx.getCommand(null);
				done('Error expected');

			}catch(err){
				expect(err).to.have.deep.property('message', 'Unknown command: null');
			}

			done();
		});

		it('should throw CommandNotFoundError for undefined key', function(done){

			var ctx = new ApplicationContext();

			try{
				ctx.getCommand(undefined);
				done('Error expected');

			}catch(err){
				expect(err).to.have.deep.property('message', 'Unknown command: undefined');
			}

			done();
		});

		it('should throw CommandNotFoundError for an unknown command', function(done) {

			var ctx = new ApplicationContext(),
				cmd = new Command();

			ctx.registerCommand('test', cmd);

			try{
				ctx.getCommand('test1');
				done('Error expected');

			}catch(err){
				expect(err).to.have.deep.property('message', 'Unknown command: test1');
			}

			done();
		});
	});

	describe('#registerQuery #getQuery', function(){

		var Query = function(){};
		Query.prototype.execute = function(ci, cb){
			cb(null, {});
		};

		it('should register and return the query', function(done){

			var ctx = new ApplicationContext(),
				qry = new Query();

			var result = ctx.registerQuery('test', qry);
			expect(result).to.be.equal(true);

			var qry2 = ctx.getQuery('test');
			expect(qry2).to.equal(qry);

			done();
		});

		it('should register with the underlying object factory using a prefix', function(done){

			var ctx = new ApplicationContext(),
				qry = new Query();

			var result = ctx.registerQuery('test', qry);
			expect(result).to.be.equal(true);
			
			var qry2 = ctx.objectFactory.get('restak.query.Query::test');
			expect(qry2).to.equal(qry);

			done();
		});

		it('should throw QueryNotFoundError for a null key', function(done){

			var ctx = new ApplicationContext();

			try{
				ctx.getQuery(null);
				done('Error expected');

			}catch(err){
				expect(err).to.have.deep.property('message', 'Unknown query: null');
			}

			done();
		});

		it('should throw QueryNotFoundError for a undefined key', function(done){

			var ctx = new ApplicationContext();

			try{
				ctx.getQuery(undefined);
				done('Error expected');

			}catch(err){
				expect(err).to.have.deep.property('message', 'Unknown query: undefined');
			}

			done();
		});

		it('should throw QueryNotFoundError for an unknown query', function(done) {

			var ctx = new ApplicationContext(),
				qry = new Query();

			var result = ctx.registerQuery('test', qry);
			
			try{
				ctx.getQuery('test1');
				done('Error expected');

			}catch(err){
				expect(err).to.have.deep.property('message', 'Unknown query: test1');
			}

			done();
		});

	});

	describe('#registerEndpoint #getEndpoint #getEndpoints', function(){

		var Endpoint = function(){};
		Endpoint.prototype.execute = function(ci, cb){
			cb(null, {});
		};

		it('should register and return the endpoint', function(done){

			var ctx = new ApplicationContext(),
				ept = new Endpoint();

			var result = ctx.registerEndpoint('test', ept);
			expect(result).to.be.equal(true);

			var ept = ctx.getEndpoint('test');
			expect(ept).to.equal(ept);
			expect(ept).to.have.property('queryExecutor', ctx.queryExecutor);
			expect(ept).to.have.property('commandExecutor', ctx.commandExecutor);

			done();
		});

		it('should not override the executors if they are already specified.', function(done){

			var ctx = new ApplicationContext(),
				ept = new Endpoint(),
				qe = { 'test': 'abc' },
				ce = { 'test': 'xyz' };

			ept.commandExecutor = ce;
			ept.queryExecutor = qe;

			var result = ctx.registerEndpoint('test', ept);
			expect(result).to.be.equal(true);

			var ept = ctx.getEndpoint('test');
			expect(ept).to.equal(ept);
			expect(ept).to.have.property('queryExecutor', qe);
			expect(ept).to.have.property('commandExecutor', ce);

			done();
		});

		it('should register with the underlying object factory using a prefix', function(done){

			var ctx = new ApplicationContext(),
				ept = new Endpoint();

			var result = ctx.registerEndpoint('test', ept);
			expect(result).to.be.equal(true);
			
			var ept2 = ctx.objectFactory.get('restak.rest.endpoints.Endpoint::test');
			expect(ept2).to.equal(ept);

			done();
		});

		it('should return null with a null key', function(done){

			var ctx = new ApplicationContext(),
				ept = ctx.getEndpoint(null);
			
			expect(ept).to.be.null;

			done();
		});

		it('should return null with a undefined key', function(done){

			var ctx = new ApplicationContext(),
				ept = ctx.getEndpoint(undefined);
			
			expect(ept).to.be.null;

			done();
		});

		it('should not find the endpoint', function(done) {

			var ctx = new ApplicationContext(),
				ept = new Endpoint();

			var result = ctx.registerEndpoint('test', ept),
				ept2 = ctx.getEndpoint('test1');
			
			expect(ept2).to.be.null;

			done();
		});

		it('should find 2 endpoints', function(done){

			var ctx = new ApplicationContext();

			var ept1 = new Endpoint();
			ept1.k = 'test';

			var ept2 = new Endpoint();
			ept2.k = 'test1';

			ctx.registerQuery('test', {});
			ctx.registerCommand('test', {});
			ctx.registerEndpoint('test', ept1);
			ctx.registerObject('test', {});

			ctx.registerQuery('test1', {});
			ctx.registerCommand('test1', {});
			ctx.registerEndpoint('test1', ept2);
			ctx.registerObject('test1', {});

			var endpoints = ctx.getEndpoints();

			expect(endpoints).to.have.deep.members([ept1, ept2]);

			done();
		});
	});
	
	describe('#registerMiddleware #getMiddleware #getAllMiddleware', function(){

		var Middleware = function(){};
		Middleware.prototype.install = function(app){};

		it('should register and return the endpoint', function(done){

			var ctx = new ApplicationContext(),
				mw = new Middleware();

			var result = ctx.registerMiddleware('test', mw);
			expect(result).to.be.equal(true);

			var mw = ctx.getMiddleware('test');
			expect(mw).to.equal(mw);

			done();
		});

		it('should not override the executors if they are already specified.', function(done){

			var ctx = new ApplicationContext(),
				mw = new Middleware(),
				qe = { 'test': 'abc' },
				ce = { 'test': 'xyz' };

			mw.commandExecutor = ce;
			mw.queryExecutor = qe;

			var result = ctx.registerMiddleware('test', mw);
			expect(result).to.be.equal(true);

			var mw = ctx.getMiddleware('test');
			expect(mw).to.equal(mw);
			
			done();
		});

		it('should register with the underlying object factory using a prefix', function(done){

			var ctx = new ApplicationContext(),
				mw = new Middleware();

			var result = ctx.registerMiddleware('test', mw);
			expect(result).to.be.equal(true);
			
			var mw2 = ctx.objectFactory.get('restak.rest.middleware.Middleware::test');
			expect(mw2).to.equal(mw);

			done();
		});

		it('should return null with a null key', function(done){

			var ctx = new ApplicationContext(),
				mw = ctx.getMiddleware(null);
			
			expect(mw).to.be.null;

			done();
		});

		it('should return null with a undefined key', function(done){

			var ctx = new ApplicationContext(),
				mw = ctx.getMiddleware(undefined);
			
			expect(mw).to.be.null;

			done();
		});

		it('should not find the middleware', function(done) {

			var ctx = new ApplicationContext(),
				mw = new Middleware();

			var result = ctx.registerMiddleware('test', mw),
				mw2 = ctx.getMiddleware('test1');
			
			expect(mw2).to.be.null;

			done();
		});

		it('should find 2 middleware', function(done){

			var ctx = new ApplicationContext();

			var mw1 = new Middleware();
			mw1.k = 'test';

			var mw2 = new Middleware();
			mw2.k = 'test1';

			ctx.registerQuery('test', {});
			ctx.registerCommand('test', {});
			ctx.registerMiddleware('test', mw1);
			ctx.registerObject('test', {});

			ctx.registerQuery('test1', {});
			ctx.registerCommand('test1', {});
			ctx.registerMiddleware('test1', mw2);
			ctx.registerObject('test1', {});

			var mw = ctx.getAllMiddleware();

			expect(mw).to.have.deep.members([mw1, mw2]);

			done();
		});
	});

	describe('#registerObject #getObject', function(){

		it('should register and return the object', function(done){

			var ctx = new ApplicationContext(),
				obj = { test: 'a' };

			var result = ctx.registerObject('test', obj);
			expect(result).to.be.equal(true);

			var obj2 = ctx.getObject('test');
			expect(obj2).to.equal(obj);

			done();
		});

		it('should register with the underlying object factory using a prefix', function(done){

			var ctx = new ApplicationContext(),
				obj = { test: 'a' };

			var result = ctx.registerObject('test', obj);
			expect(result).to.be.equal(true);
			
			var obj2 = ctx.objectFactory.get('test');
			expect(obj2).to.equal(obj);

			done();
		});

		it('should return null with a null key', function(done){

			var ctx = new ApplicationContext(),
				obj = ctx.getObject(null);
			
			expect(obj).to.be.null;

			done();
		});

		it('should return null with a undefined key', function(done){

			var ctx = new ApplicationContext(),
				obj = ctx.getObject(undefined);
			
			expect(obj).to.be.null;

			done();
		});

		it('should not find the object', function(done) {

			var ctx = new ApplicationContext(),
				obj = { test: 'a' };

			var result = ctx.registerObject('test', obj),
				obj2 = ctx.getObject('test1');
			
			expect(obj2).to.be.null;

			done();
		});

	});
});