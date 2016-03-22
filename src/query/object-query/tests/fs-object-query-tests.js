'use strict';

var util = require('util'),
	expect = require('chai').expect,
	assert = require('chai').assert,
	mock = require('mock-fs'),
	FileSystemObjectQuery = require('../fs-object-query');

var itemA = { "id": "itemA", "name": "ITEMA, 123" },
	itemB = { "id": "itemB", "name": "ITEMB, 456" },
	itemC = { "id": "itemC", "name": "ITEMC, 489" };

describe('query > object-query > file-system-query', function() {

	describe('#execute', function(){

		it('should find itemA', function(done) {

			var fs = mock.fs({
					'c:/items/': {
						'itemA': JSON.stringify(itemA),
						'itemB': JSON.stringify(itemB),
						'itemC': JSON.stringify(itemC)
					}
				}),
				query = new FileSystemObjectQuery(fs, 'c:/items/'),
				request = {
					filter: 'name~\'ITEMA\''
				};
			
			query.execute(request, function(err, result){

				expect(err).to.be.null;
				expect(result).to.deep.equal({ filter: 'name~\'ITEMA\'',
					pageSize: 25,
					page: 1,
					pageCount: 1,
					totalCount: 1,
					items: [ itemA ] 
				});

				done();
			});
		});

		it('should use the object transform', function(done){

			var fs = mock.fs({
					'c:/items/': {
						'itemA': JSON.stringify(itemA),
						'itemB': JSON.stringify(itemB),
						'itemC': JSON.stringify(itemC)
					}
				}),
				objectTransform = {
					transform: function(itm){
						return {
							"id": itm.id, 
							"name": itm.name + " - transformed"
						};
					}
				},
				query = new FileSystemObjectQuery(fs, 'c:/items/', objectTransform),
				request = {
					filter: 'name~\'ITEMA\''
				};
			
			query.execute(request, function(err, result){

				expect(err).to.be.null;
				expect(result).to.deep.equal({ filter: 'name~\'ITEMA\'',
					pageSize: 25,
					page: 1,
					pageCount: 1,
					totalCount: 1,
					items: [ {
						id: "itemA",
						name: "ITEMA, 123 - transformed"
					} ] 
				});

				done();
			});
		});

	});
});