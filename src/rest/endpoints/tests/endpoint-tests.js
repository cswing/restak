'use strict';

var log4js = global.log4js || require('log4js'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	Endpoint = require('../endpoint');


describe('rest > endpoints > endpoint', function() {

	describe('#register', function(){

		it('should set the parameters', function(done) {
			
			var app = { t: 0 },
				server = {
					config: {
						t: 0
					}
				};

			var ep = new Endpoint(log4js.getLogger('tests'));
			ep.register(app, server);

			expect(ep).to.have.deep.property('app', app);
			expect(ep).to.have.deep.property('server', server);
			expect(ep).to.have.deep.property('config', server.config);

			done();
		});

	});

	describe('#handleError', function(){

		it('should default to the unhandled error code when no code is passed in.', function(done) {
			
			var statusCode,
				sent,
				server = {
					config: {
						unhandledErrorCode: 'UNH',
					},
					buildRestResponse: function(req, res, data, msg) { 
						return msg; 
					}
				};
			var req = {},
				res = {};
			res.status = function(code){
				statusCode = code;
				return res;
			};
			res.send = function(content){
				sent = content;
				return res;
			};
	
			var ep = new Endpoint(log4js.getLogger('tests'));
			ep.server = server;
			ep.config = server.config;
			
			ep.handleError(req, res, 'error message');

			expect(statusCode).to.equal(500);
			expect(sent).to.have.deep.property('code', 'UNH')
			
			done();
		});

		it('should use the specified error code when passed in.', function(done) {
			
			var statusCode,
				sent,
				server = {
					config: {
						unhandledErrorCode: 'UNH',
					},
					buildRestResponse: function(req, res, data, msg) { 
						return msg; 
					}
				};
			var req = {},
				res = {};
			res.status = function(code){
				statusCode = code;
				return res;
			};
			res.send = function(content){
				sent = content;
				return res;
			};
	
			var ep = new Endpoint(log4js.getLogger('tests'));
			ep.server = server;
			ep.config = server.config;
			
			ep.handleError(req, res, 'error message', 'CUSTOM');

			expect(statusCode).to.equal(400);
			expect(sent).to.have.deep.property('code', 'CUSTOM')
			
			done();
		});
	});

	describe('#buildRestResponse', function(){

		it('should defer to the server to build the response', function(done) {

			var response = { t: 0 },
				calls = 0,
				server = {
					config: {},
					buildRestResponse: function() { 
						calls++; 
						return response; 
					}
				};

			var ep = new Endpoint(log4js.getLogger('tests'));
			ep.server = server;

			var response = ep.buildRestResponse();

			expect(calls).to.equal(1);
			expect(response).to.deep.equal(response);
			
			done();
		});

	});

});