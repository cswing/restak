'use strict';

var expect = require('chai').expect,
	assert = require('chai').assert,
	ApplicationContext = require('../../../app-server/application-context'),
	DefaultConfig =  require('../../../app-server/config'),
	register = require('../index').register;

describe('scheduler > rest-endpoints', function() {

	describe('#register', function(){

		var expectObjects = function(appContext) {
			expect(appContext.getEndpoint('restak.scheduler.rest-endpoints.JobsCollection')).to.not.be.null;
			expect(appContext.getEndpoint('restak.scheduler.rest-endpoints.JobResourceGet')).to.not.be.null;
			expect(appContext.getEndpoint('restak.scheduler.rest-endpoints.InstancesCollection')).to.not.be.null;
			expect(appContext.getEndpoint('restak.scheduler.rest-endpoints.InstanceResourceGet')).to.not.be.null;
		};

		it('should register endpoints with the app server', function(done){

			var config = new DefaultConfig({}),
				appContext = new ApplicationContext(config);

			register(appContext);
			expectObjects(appContext);

			done();
		});

	});
});