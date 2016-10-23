'use strict';

/*
	How do you "mock" MongoDb for unit tests?
	There is a lot opinions including "Don't mock what you don't own"
	I am not sure I buy into this statement entirely.

	I want to write unit tests where I don't have to have the external systems 
	in place to execute them.  

	That is why I have this.  This allows me to use NeDB for unit tests and 
	mongodb for production.  I understand the risks  with not testing mongodb, but 
	IMO that should be for integration tests and I want unit tests.

	I am sure I will revisit this at some point, but this solves what I am trying 
	to do right now.
 */

var NoSqlShim = function(collection, transform){
	this.collection = collection;
};

NoSqlShim.prototype.insert = function(doc, callback){
	
	var transform = this.transform;

	this.collection.insert(doc, function(err, result){
		if(err) return callback(err, null);

		var retVal = {
			implResult: result
		};

		if(result.ops) { 
			retVal.doc = result.ops[0]; // mongodb
		} else {
			retVal.doc = result; // nedb
		}

		callback(null, retVal);
	});
};

module.exports = NoSqlShim;