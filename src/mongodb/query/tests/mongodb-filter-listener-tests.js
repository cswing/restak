'use strict';

var expect = require('chai').expect,
	assert = require('chai').assert,
	ObjectId = require('mongodb').ObjectId,
	MongoDBFilterListener = require('../mongodb-filter-listener');

describe.only('mongodb > query > filter-listener', function() {

	describe('#_setValue', function(){

		it('should create an ObjectId because the property has been identified as such', function(done){

			var listener = new MongoDBFilterListener(['_id']),
				val = '57b7482267bec30c48aadda7',
				setVal = null,
				setter = function(val) {
					setVal = val;
				},
				literalCtx = {
					parentCtx: {
						parentCtx: {
							__currentPredicate: {
								__prop: '_id',
								__setter: setter
							}
						}
					}
				};

			listener._setValue(literalCtx, val);

			expect(setVal).to.not.be.null;
			expect(setVal).to.be.an.instanceof(ObjectId);
			expect(ObjectId(val).equals(setVal)).to.equal(true);

			done();
		});

		it('should NOT create an ObjectId because the property was NOT identified as such', function(done){

			var listener = new MongoDBFilterListener([]),
				val = '57b7482267bec30c48aadda7',
				setVal = null,
				setter = function(val) {
					setVal = val;
				},
				literalCtx = {
					parentCtx: {
						parentCtx: {
							__currentPredicate: {
								__prop: '_id',
								__setter: setter
							}
						}
					}
				};

			listener._setValue(literalCtx, val);

			expect(setVal).to.not.be.null;
			expect(setVal).to.be.a('string');
			expect(setVal).to.equal(val);

			done();
		});

	});
});