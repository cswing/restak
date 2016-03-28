'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.nedb'),
	NeDb = require('nedb'),
	ApplicationContext = require('../app-server/application-context');

var configureNeDb = function(dbName, filepath){

	var opts = {
		autoload: true
	};	

	if(filepath) {
		logger.info('Initializing nedb [' + dbName + '] using ' + filepath);
		opts.filename = filepath;

	} else {
		logger.info('Initializing nedb [' + dbName + '] using an in memory db');
	}

	return new NeDb(opts);
};


ApplicationContext.prototype.registerNeDb = function(key, configProperty){

	var appContext = this,
		filepath = appContext.getConfigSetting(configProperty, false);

	var db = configureNeDb(key, filepath);
	appContext.registerObject(key, db);

	return db;
};

module.exports.configureNeDb = configureNeDb;