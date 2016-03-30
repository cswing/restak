'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.app-server.ApplicationServer'),
	RestServer = require('../rest').RestServer;

/**
 * The core application server for the restak framework. 
 *
 * @constructor
 * @memberof restak.app-server
 * @param {restak.app-server.ApplicationDescriptor} appDescriptor - A description of the application.
 * @param {restak.app-server.ApplicationContext} appContext - Optional, the context of the application.  If provided, the server will initialize itself.  Otherwise initialize must be called manually.
 */
var ApplicationServer = function(appDescriptor, appContext){
	
	/** 
	 * Basic information about the application.
	 *
	 * @type restak.app-server.ApplicationDescriptor
	 */
	this.appDescriptor = appDescriptor;

	/**
	 * The application context that drives the behavior of the server.
	 *
	 * @type restak.app-server.ApplicationContext
	 */
	this.appContext = null;

	/** 
	 * Whether or not the application server is currently running.
	 * @type boolean
	 */
	this.running = false;

	/** 
	 * Whether or not the application server is initialized with an {@link restak.app-server.ApplicationContext|ApplicationContext}.
	 * @name restak.app-server.ApplicationServer#initialized
	 * @type boolean
	 */

	var _t = this;
	Object.defineProperty(this, 'initialized', {
		get: function() { return _t.appContext !== null; }
	});

	if(appContext)	{
		this.initialize(appContext, false);
	}
};

/**
 * Initializes the application server using the applciation context provided.
 *
 * @param {restak.app-server.ApplicationContext} appContext - the applciation context to use for initialization.
 * @param {boolean} andStart - whether or not to start the application server after initializing.
 */
ApplicationServer.prototype.initialize = function(appContext, andStart){

	if(!appContext) {
		var msg = 'An appContext is required in order to initialize.';
		logger.error(msg);
		throw new Error(msg);
	}

	if(this.appContext) {
		var msg = 'The application server has already been initialized.';
		logger.error(msg);
		throw new Error(msg);
	}

	this.appContext = appContext;
	appContext.registerObject('restak.app-server.ApplicationServer', this);

	// Setup scheduler
	this.scheduler = appContext.getObject('restak.scheduler.Scheduler');
	if(!this.scheduler){
		logger.warn('No scheduler was found in the app context.');
	}

	// Setup REST HTTP server
	var httpPort = appContext.getConfigSetting('http.port'),
		restServerConfig = {
			port: httpPort,
			appName: this.appDescriptor.name,
			appVersion: this.appDescriptor.version
		},
		middleware = this.appContext.getAllMiddleware(),
		endpoints = this.appContext.getEndpoints();
	this.restServer = new RestServer(endpoints, restServerConfig, middleware);
	appContext.registerObject('restak.rest.RestServer', this.restServer);

	if(andStart) this.start(function(){});
};

/* 
	- start and stop still needs to be thought through 
	- scheduler does not have a stop
*/

/**
 * Start the server
 */
ApplicationServer.prototype.start = function(callback){

	if(this.running) {
		return callback('Application server [] is already running.', null);		
	}

	if(!this.initialized) {
		throw new Error('Cannot start server because it has not been initialized.');
	}

	var _t = this,
		startRestServer = function(){
			_t.restServer.start();
			_t.running = true;
			if(callback) callback(null, _t.running);
		};

	if(this.scheduler){
		this.scheduler.initialize(function(){
			startRestServer();
		});
	} else {
		startRestServer();
	}
};

/**
 * Stop the server
 */
ApplicationServer.prototype.stop = function(callback){
	if(this.restServer) {
		this.restServer.stop();
	}

	this.running = false;

	if(callback) callback(null, this.running);
};


module.exports = ApplicationServer;