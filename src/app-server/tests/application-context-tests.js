'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	config = require('config'),
	ApplicationContext = require('../application-context');

// setup a config setting
config['restak-test'] = 'restak application framework';

describe('app-server > application-context', function() {

	describe('#ctor', function(){

		it('should create an object factory', function(done) {
			var ctx = new ApplicationContext(config);
			expect(ctx).to.have.property('objectFactory');
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

		it('should return null because no config was provided', function(done) {
			
			var ctx = new ApplicationContext(),
				val = ctx.getConfigSetting('restak-test');

			expect(val).to.be.null;
			
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

		it('should return null with a null key', function(done){

			var ctx = new ApplicationContext();

			try{
				ctx.getCommand(null);
				done('Error expected');

			}catch(err){
				expect(err).to.have.deep.property('message', 'Unknown command: null');
			}

			done();
		});

		it('should return null with a undefined key', function(done){

			var ctx = new ApplicationContext();

			try{
				ctx.getCommand(undefined);
				done('Error expected');

			}catch(err){
				expect(err).to.have.deep.property('message', 'Unknown command: undefined');
			}

			done();
		});

		it('should not find the command', function(done) {

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

		it('should return null with a null key', function(done){

			var ctx = new ApplicationContext(),
				qry = ctx.getQuery(null);
			
			expect(qry).to.be.null;

			done();
		});

		it('should return null with a undefined key', function(done){

			var ctx = new ApplicationContext(),
				qry = ctx.getQuery(undefined);
			
			expect(qry).to.be.null;

			done();
		});

		it('should not find the query', function(done) {

			var ctx = new ApplicationContext(),
				qry = new Query();

			var result = ctx.registerQuery('test', qry),
				qry2 = ctx.getQuery('test1');
			
			expect(qry2).to.be.null;

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

			var ept2 = ctx.getEndpoint('test');
			expect(ept2).to.equal(ept);

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