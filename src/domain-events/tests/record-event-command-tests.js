'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	EventEmitter = require('events').EventEmitter,
	Datastore = require('nedb'),
	NoSqlShim = require('../../util/no-sql-shim'),
	RecordEventCommand = require('../record-event-command');

describe('domain-events > commands > record-event-command', function() {

	describe('#execute', function(){

		it('should save to the collection and call the listeners', function(done) {

			var collection = new Datastore(),
				emitter = new EventEmitter(),
				listenerEvt = null,
				listener = function(evt){
					listenerEvt = evt;
				},
				validation = {
					arg1: null,
					arg2: null
				},
				cmd = new RecordEventCommand(new NoSqlShim(collection), emitter, 'testEntity', 'testEvent', validation),
				instr = {
					data: {
						arg1: 'A',
						arg2: 'B'
					}
				};

			emitter.on('testEvent', listener);

			cmd.execute(instr, function(err, evt){

				expect(err).to.be.null;
				expect(evt).to.not.be.null;
				expect(evt).to.have.property('_id');
				expect(evt).to.have.property('arg1', 'A');
				expect(evt).to.have.property('arg2', 'B');

				expect(listenerEvt).to.deep.equal(evt);

				collection.findOne({ _id: evt._id }, function(err, doc){

					expect(err).to.be.null;
					expect(doc).to.not.be.null;
					expect(doc).to.have.property('_id', evt._id);
					expect(doc).to.have.property('arg1', 'A');
					expect(doc).to.have.property('arg2', 'B');

					done();
				});
			});
		});

	});

});