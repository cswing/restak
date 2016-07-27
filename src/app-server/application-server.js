'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.app-server.ApplicationServer'),
	async = require('async'),
	express = require('express'),
	DefaultConfig = require('./config'),
	RestServer = require('../rest').RestServer;

/**
 * The core application server for the restak framework. 
 *
 * @constructor
 * @memberof restak.app-server
 * @param {restak.app-server.ApplicationContext} appContext - Optional, the context of the application.  If provided, the server will initialize itself.  Otherwise initialize must be called manually.
 */
var ApplicationServer = function(appContext){
	
	/**
	 * The application context that drives the behavior of the server.
	 *
	 * @type restak.app-server.ApplicationContext
	 */
	this.appContext = null;

	/** 
	 * Basic information about the application.
	 *
	 * @type restak.app-server.ApplicationDescriptor
	 *//*
	this.appDescriptor = {
		name: 'REST Server',
		version: null
	};*/

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

	// Setup job-engine
	this.jobEngine = appContext.getObject('restak.job-engine.ExecutionEngine');
	if(!this.jobEngine){
		logger.warn('No job engine was found in the app context.');
	}

	//this.scheduler = appContext.getObject('restak.job-engine.Scheduler');
	//if(!this.scheduler){
	//	logger.warn('No scheduler was found in the app context.');
	//}

	this.app = express();

	// Setup REST HTTP server
	var middleware = this.appContext.getAllMiddleware(),
		endpoints = this.appContext.getEndpoints();
	this.restServer = new RestServer(this.appContext.appDescriptor, this.appContext.config, endpoints, middleware);
	appContext.registerObject('restak.rest.RestServer', this.restServer);

	this.app.use('/api', this.restServer.app);

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
		appContext = this.appContext,
		appDescriptor = appContext.appDescriptor,
		httpPort = appContext.getConfigSetting('http.port', false) || 3000,
		app = this.app,
		applicationName = appDescriptor.name;
		
	if(appDescriptor.version) {
		applicationName = applicationName + ' [' + appDescriptor.version + ']';
	};

	var tasks = this.appContext.deferreds.map(function(descriptor){
		return function(cb){
			var commandKey = descriptor.commandKey,
				description = descriptor.description,
				cmd = appContext.getCommand(commandKey),
				instr = {
					data: descriptor.data
				};

			if(!cmd){
				logger.warn('Unable to locate command with key ' + commandKey + ' for ' + description);
				return cb();
			}

			logger.debug('Executing deferred command ' + description);
			cmd.execute(instr, function(err){
				if(err) {
					logger.error('An error occurred executing deferred command ' + description + ': ' + err);
					return cb();
				}

				logger.debug('Execution complete for deferred command ' + description);
				cb();
			});
		};
	});

	if(this.jobEngine){
		tasks.splice(0, 0, function(cb){
			_t.jobEngine.initialize(cb);
		});
	}

	if(this.scheduler){
		tasks.splice(0, 0, function(cb){
			_t.scheduler.initialize(cb);
		});
	} else {
		logger.warn('A job scheduler was not configured');
	}

	tasks.splice(0, 0, function(cb){

		logger.debug(applicationName + ' starting http server on port ' + httpPort);
		
		_t.httpServer = app.listen(httpPort, function () {
			logger.debug(applicationName + ' listening on port ' + httpPort);
			cb();
		});
	});

	async.series(tasks, function(err){
		if(err) {
			logger.error(err);
			if(callback) return callback(null, _t.running);	
		}

		logger.info(applicationName + ' startup complete');

		_t.running = true;
		if(callback) callback(null, _t.running);
	});

};

/**
 * Stop the server
 */
ApplicationServer.prototype.stop = function(callback){
	if(this.httpServer){
		this.httpServer.close();
	}

	this.running = false;

	if(callback) callback(null, this.running);
};


module.exports = ApplicationServer;