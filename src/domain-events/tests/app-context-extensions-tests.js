'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	EventEmitter = require('events').EventEmitter,
	DefaultConfig = require('../../app-server/config'),
	NoSqlShim = require('../../util').NoSqlShim,
	ApplicationContext = require('../app-context-extensions').ApplicationContext,
	RecordEventCommand = require('../record-event-command');

var config = new DefaultConfig({});

describe('domain-events > app-context-extensions', function() {

	describe('#registerDomainEntity', function(){

		it('should register the correct objects', function(done){

			var appContext = new ApplicationContext(config),
				collection = { test: 'mock collection' };
			
			appContext.registerDomainEntity('testEntity', collection);

			var registeredCollection = appContext.getObject('domain.entity[testEntity].event-collection'),
				emitter = appContext.getObject('domain.entity[testEntity].event-emitter');
			
			expect(registeredCollection).to.be.instanceof(NoSqlShim);
			expect(registeredCollection).to.have.property('collection', collection);
			expect(emitter).to.be.instanceof(EventEmitter);

			done();
		});
	});

	describe('#registerDomainEvent', function(){
		
		it('should register a record-event-command', function(done) {

			var appContext = new ApplicationContext(config),
				collection = { test: 'mock collection' },
				eventValidation = { test: 'mock validation' };
			
			appContext.registerDomainEntity('testEntity', collection);
			appContext.registerDomainEvent('testEntity', 'testEvent', eventValidation);

			var cmd = appContext.getCommand('domain.entity[testEntity].record-event-command');
			expect(cmd).to.be.instanceof(RecordEventCommand);
			expect(cmd).to.have.deep.property('collection.collection', collection);
			expect(cmd).to.have.property('emitter');
			expect(cmd).to.have.property('entityKey', 'testEntity');
			expect(cmd).to.have.property('eventKey', 'testEvent');
			expect(cmd).to.have.property('validation', eventValidation);

			done();
		});

		it('should give an error when the entity has not been registered', function(done){

			var appContext = new ApplicationContext(config),
				eventValidation = { test: 'mock validation' };
			
			try {			
				appContext.registerDomainEvent('testEntity', 'testEvent', eventValidation);

			} catch(err) {

				expect(err).to.be.instanceof(Error);
				expect(err.toString()).to.equal('Error: Unknown entity: testEntity');

				return done();
			}

			done('An err was expected to be thrown');
		});
	});

	describe('#registerDomainEventListener', function(){
		
		it('should register a listener that is called when the event is emitted', function(done) {

			var appContext = new ApplicationContext(config),
				collection = { test: 'mock collection' },
				eventValidation = { test: 'mock validation' },
				listenerCalls = 0,
				listener = function(evt){ listenerCalls++; };
			
			appContext.registerDomainEntity('testEntity', collection);
			appContext.registerDomainEvent('testEntity', 'testEvent', eventValidation);
			appContext.registerDomainEventListener('testEntity', 'testEvent', listener);

			var emitter = appContext.getObject('domain.entity[testEntity].event-emitter');
			emitter.emit('testEvent', {});

			expect(listenerCalls).to.equal(1);

			done();
		});

		it('should give an error when the entity has not been registered', function(done){

			var appContext = new ApplicationContext(config),
				listener = function(evt){};
			
			try {			
				appContext.registerDomainEventListener('testEntity', 'testEvent', listener);

			} catch(err) {

				expect(err).to.be.instanceof(Error);
				expect(err.toString()).to.equal('Error: Unknown entity: testEntity');

				return done();
			}

			done('An err was expected to be thrown');
		});
	});
});