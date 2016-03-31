'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	jwt = require('jsonwebtoken'),
	ResponseMock = require('../../tests/response-mock'),
	SecurityMiddleware = require('../security-middleware');

describe('security > security-middleware', function() {

	describe('#onRequest', function(){

		it('should handle a null request', function(done){

			var privateKey = 'TEST123',
				mw = new SecurityMiddleware(privateKey),
				req = null,
				res = {};

			mw.onRequest(req, res, function(){
				done();
			});
		});

		it('should an empty request object', function(done){

			var privateKey = 'TEST123',
				mw = new SecurityMiddleware(privateKey),
				req = {},
				res = {};

			mw.onRequest(req, res, function(){

				var security = req.security;
				expect(security).to.not.be.null;
				expect(security).to.have.property('isAnonymous', true);
				expect(security).to.have.property('isAuthenticated', false);
				expect(security).to.have.property('token', null);

				done();
			});
		});

		it('should not find a token and be an anonymous request', function(done){

			var privateKey = 'TEST123',
				mw = new SecurityMiddleware(privateKey),
				req = {
					body: {},
					query: {},
					headers: {}
				},
				res = {};

			mw.onRequest(req, res, function(){

				var security = req.security;
				expect(security).to.not.be.null;
				expect(security).to.have.property('isAnonymous', true);
				expect(security).to.have.property('isAuthenticated', false);
				expect(security).to.have.property('token', null);

				done();
			});
		});

		it('should find a token on the body and be an authenticated request', function(done){

			var privateKey = 'TEST123',
				token = jwt.sign('John.Doe@email.com', privateKey),
				mw = new SecurityMiddleware(privateKey),
				req = {
					body: {
						auth: token
					},
					query: {},
					headers: {}
				},
				res = {};

			mw.onRequest(req, res, function(){

				var security = req.security;
				expect(security).to.not.be.null;
				expect(security).to.have.property('isAnonymous', false);
				expect(security).to.have.property('isAuthenticated', true);
				expect(security).to.have.property('token', 'John.Doe@email.com');

				done();
			});
		});

		it('should find a token on the query and be an authenticated request', function(done){

			var privateKey = 'TEST123',
				token = jwt.sign('John.Doe@email.com', privateKey),
				mw = new SecurityMiddleware(privateKey),
				req = {
					body: {},
					query: {
						auth: token
					},
					headers: {}
				},
				res = {};

			mw.onRequest(req, res, function(){

				var security = req.security;
				expect(security).to.not.be.null;
				expect(security).to.have.property('isAnonymous', false);
				expect(security).to.have.property('isAuthenticated', true);
				expect(security).to.have.property('token', 'John.Doe@email.com');

				done();
			});
		});

		it('should find a token on the headers and be an authenticated request', function(done){

			var privateKey = 'TEST123',
				token = jwt.sign('John.Doe@email.com', privateKey),
				mw = new SecurityMiddleware(privateKey),
				req = {
					body: {},
					query: {},
					headers: {
						'x-auth-token': token
					}
				},
				res = {};

			mw.onRequest(req, res, function(){

				var security = req.security;
				expect(security).to.not.be.null;
				expect(security).to.have.property('isAnonymous', false);
				expect(security).to.have.property('isAuthenticated', true);
				expect(security).to.have.property('token', 'John.Doe@email.com');

				done();
			});
		});

		it('should handle a malformed token', function(done){

			var privateKey = 'TEST123',
				mw = new SecurityMiddleware(privateKey),
				req = {
					body: {},
					query: {},
					headers: {
						'x-auth-token': 'AN INVALID TOKEN'
					}
				},
				res = {};

			mw.onRequest(req, res, function(){

				var security = req.security;
				expect(security).to.not.be.null;
				expect(security).to.have.property('isAnonymous', true);
				expect(security).to.have.property('isAuthenticated', false);
				expect(security).to.have.property('token', null);

				done();
			});
		});

		it('should handle an invalid token', function(done){

			var privateKey = 'TEST123',
				token = jwt.sign('John.Doe@email.com', 'TEST456'),
				mw = new SecurityMiddleware(privateKey),
				req = {
					body: {},
					query: {},
					headers: {
						'x-auth-token': token
					}
				},
				res = {};

			mw.onRequest(req, res, function(){

				var security = req.security;
				expect(security).to.not.be.null;
				expect(security).to.have.property('isAnonymous', true);
				expect(security).to.have.property('isAuthenticated', false);
				expect(security).to.have.property('token', null);

				done();
			});
		});
	});

	describe('#validateAuthenticatedRequest', function(){

		it('should handle a null request', function(done){

			var req = null,
				res = new ResponseMock(),
				nextCalled = false,
				next = function(){
					nextCalled = true;
				};

			SecurityMiddleware.validateAuthenticatedRequest(req, res, next);

			expect(nextCalled).to.equal(false);
			expect(res).to.have.property('_status', 401);
			expect(res).to.have.property('_sentCalls', 1);
			expect(res._headers).to.deep.equal({ 'WWW-Authenticate': 'None' });

			done();
		});

		it('should handle a request without a security object', function(done){

			var req = {},
				res = new ResponseMock(),
				nextCalled = false,
				next = function(){
					nextCalled = true;
				};

			SecurityMiddleware.validateAuthenticatedRequest(req, res, next);

			expect(nextCalled).to.equal(false);
			expect(res).to.have.property('_status', 401);
			expect(res).to.have.property('_sentCalls', 1);
			expect(res._headers).to.deep.equal({ 'WWW-Authenticate': 'None' });

			done();
		});

		it('should handle a request with an authenticated user', function(done){

			var req = {
					security: {
						isAnonymous: false,
						isAuthenticated: true,
						token: 'John.Doe@email.com'
					}
				},
				res = new ResponseMock(),
				nextCalled = false,
				next = function(){
					nextCalled = true;
				};

			SecurityMiddleware.validateAuthenticatedRequest(req, res, next);

			expect(nextCalled).to.equal(true);
			expect(res).to.have.property('_sentCalls', 0);

			done();
		});

		it('should handle a request with an anonymous user', function(done){

			var req = {
					security: {
						isAnonymous: true,
						isAuthenticated: false,
						token: null
					}
				},
				res = new ResponseMock(),
				nextCalled = false,
				next = function(){
					nextCalled = true;
				};

			SecurityMiddleware.validateAuthenticatedRequest(req, res, next);

			expect(nextCalled).to.equal(false);
			expect(res).to.have.property('_status', 401);
			expect(res).to.have.property('_sentCalls', 1);
			expect(res._headers).to.deep.equal({ 'WWW-Authenticate': 'None' });

			done();
		});
	});
});