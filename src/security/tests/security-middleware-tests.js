'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	jwt = require('jsonwebtoken'),
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

		it('should handle an invalid token', function(done){

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

	});
});