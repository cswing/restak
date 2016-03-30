'use strict';

var log4js = global.log4js || require('log4js'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	request = require('supertest'),
	BaseMiddleware = require('../base-middleware');

describe('rest > middleware > base-middleware', function() {

	describe('#install', function(){

		it('should install the middleware', function(done){

			var fn,
				app = {
					use: function(_fn){
						fn = _fn;
					}
				},
				req = null,
				res = null,
				nextCalled = false,
				next = function(){
					nextCalled = true;
				};

			var mw = new BaseMiddleware();
			mw.install(app);
			
			expect(fn).to.be.function;

			fn(req, res, next);

			expect(nextCalled).to.equal(true);

			done();
		});

	});
});