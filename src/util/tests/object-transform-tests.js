'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	mock = require('mock-fs'),
	DefaultObjectTransform = require('../object-transform').DefaultObjectTransform;

describe('util > object-transform', function() {

	describe('#transform', function(){

		it('should returned a transformed object with the x property', function(done) {

			var objTrans = new DefaultObjectTransform({ x: null }),
				transObj = objTrans.transform({ x: 'a', y: 'b', z: 'c'});

			expect(transObj).to.deep.equal({ x: 'a' });

			done();
		});

		it('should returned a transformed object with the x property using theproperty specified', function(done) {

			var objTrans = new DefaultObjectTransform({ x: 'y' }),
				transObj = objTrans.transform({ x: 'a', y: 'b', z: 'c'});

			expect(transObj).to.deep.equal({ x: 'b' });

			done();
		});

		it('should returned a transformed object with the x property using a function', function(done) {

			var objTrans = new DefaultObjectTransform({ x: function(itm){ return itm.y; } }),
				transObj = objTrans.transform({ x: 'a', y: 'b', z: 'c'});

			expect(transObj).to.deep.equal({ x: 'b' });

			done();
		});
	});
});