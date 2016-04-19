'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	DefaultConfig = require('../../app-server/config'),
	validation = require('express-validation'),
	CommandValidationError = require('../../command/validation-error'),
	RestServer = require('../server');

var config = new DefaultConfig({
	'http.port': 21314
});

describe('restak > rest > server', function() {

	describe('#handleError', function(){

		it('should handle a express-validation error', function(done) {

			var server = new RestServer(config, [], []),
				error = new validation.ValidationError([{
					field: 'field',
					location: 'body',
					messages: ['An error message'],
					types: ['any.required']
				}], { status: 400 }),
				req = null,
				res = {},
				nextCalled = 0,
				next = function(){ nextCalled++; };

			res.status = function(code){
				res._status = code;
				return res;
			};
			res.json = function(json){
				res._content = json;
				return res;
			};
			res.send = function(content){
				res._content = content;
				return res;
			};

			server.handleError(error, req, res, next);

			// err, req, res, next

			expect(res._status).to.equal(400);

			var payload = res._content.payload;
			expect(payload).to.not.be.null;
			expect(payload['validation-errors']).to.have.deep.members([{ 
				field: 'field',
				location: 'body',
				messages: [ 'An error message' ],
				types: [ 'any.required' ] 
			}]);

			done();
		});

		it('should handle a CommandValidationError', function(done) {

			var server = new RestServer(config, [], []),
				error = new CommandValidationError('any.error', 'An error message', 'field'),
				req = null,
				res = {},
				nextCalled = 0,
				next = function(){ nextCalled++; };

			res.status = function(code){
				res._status = code;
				return res;
			};
			res.json = function(json){
				res._content = json;
				return res;
			};
			res.send = function(content){
				res._content = content;
				return res;
			};

			server.handleError(error, req, res, next);

			expect(res._status).to.equal(400);

			var payload = res._content.payload;
			expect(payload).to.not.be.null;
			expect(payload['validation-errors']).to.have.deep.members([{ 
				field: 'field',
				messages: [ 'An error message' ],
				types: [ 'any.error' ] 
			}]);

			done();
		});
	});
});