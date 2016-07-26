'use strict';

// set the config directory explicitly.
// this supports the development environment
process.env.NODE_CONFIG_DIR = __dirname +'\\config';

var log4js = global.log4js = require('log4js');
log4js.configure(process.env.NODE_CONFIG_DIR + '\\log4js.json');

var	logger = log4js.getLogger('restak.sample-server'),
	config = require('config'),
	util = require('util'),
	restak = require('../index'),
	ApplicationContext = restak.appServer.ApplicationContext,
	ApplicationServer = restak.appServer.ApplicationServer,
	ResourceEndpoint = restak.rest.endpoints.ResourceEndpoint,
	createJobCollectionLink = restak.job-engine.restEndpoints.util.createJobCollectionLink;

var MainEndpoint = function(logger, path){
	ResourceEndpoint.apply(this, arguments);
};
util.inherits(MainEndpoint, ResourceEndpoint);

MainEndpoint.prototype.getPayload = function(req, callback){
	var payload = {
		jobs: createJobCollectionLink(this, {req: req})
	};

	callback(null, payload);
};

// Configure application context & server.
var appDescriptor = {
		name: 'Restak Sample Server',
		version: '0.1.0'
	},
	appContext = new ApplicationContext(config);


// Registration
restak.nedb.job-engine.register(appContext);
restak.job-engine.register(appContext);
restak.job-engine.restEndpoints.register(appContext);

appContext.registerEndpoint('main', new MainEndpoint(logger, '/'));

var appServer = new ApplicationServer(appDescriptor, appContext);
appServer.start();