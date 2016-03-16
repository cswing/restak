'use strict';

var log4js = require('log4js'),
	logger = log4js.getLogger('restak.query.object-query.FileSystemObjectQuery'),
	InMemoryObjectQuery = require('../../query/object-query/in-memory-object-query');

/**
 * A file system query where a file in a directory represents an entity.
 *
 * NOTE: this is not a performant query.  But it allows for the file system to be used for simple prototypes
 * or an in-memory store if using mock-fs for the file system.
 *
 * @constructor
 * @implements restak.query.Query
 * @memberof restak.query.object-query
 * @param {Fs} fs - the file system to use to access files
 * @param {string} directoryPath - the directory path to access files
 */
var FileSystemObjectQuery = function(fs, directoryPath){
	this.fs = fs;
	this.directoryPath = directoryPath;
};

/**
 * Load files from the file system.
 *
 * @protected
 * @param {Function} onError - callback to deliver errors to
 * @param {Function} onItem - callback to deliver specific items to
 * @param {Function} onFinish - callback when all files have been processed
 */
FileSystemObjectQuery.prototype.load = function(onError, onItem, onFinish) {

	var _t = this,
		fs = this.fs,
		directoryPath = this.directoryPath;

	fs.readdir(directoryPath, function (err, list) {

		if (err) {
			onError(err, null);
			return;
		}
		
		list.forEach(function (file) {
			
			var path = directoryPath + file,
				data = fs.readFileSync(path);

			onItem(JSON.parse(data));
		});

		onFinish();
	});
};

/** @inheritdoc */
FileSystemObjectQuery.prototype.execute = function(request, callback){

	var _t = this,
		fs = this.fs,
		directoryPath = this.directoryPath;

	var items = [];

	this.load(
		callback, 
		function(itm){
			items.push(itm);
		},
		function(){
			var query = new InMemoryObjectQuery(items);
			query.execute(request, callback);
		});
};

module.exports = FileSystemObjectQuery;