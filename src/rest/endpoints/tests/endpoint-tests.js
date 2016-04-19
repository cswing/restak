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