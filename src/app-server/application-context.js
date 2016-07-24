'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.app-server.ApplicationContext'),
	DefaultObjectFactory = require('./object-factory').DefaultObjectFactory,
	DefaultConfig = require('./config'),
	command = require('../command'),
	CommandNotFoundError = command.CommandNotFoundError,
	CommandExecutor = command.CommandExecutor,
	query = require('../query'),
	QueryNotFoundError = query.QueryNotFoundError,
	QueryExecutor = query.QueryExecutor;

var cmdPrefix = 'restak.command.Command::',
	qryPrefix = 'restak.query.Query::',
	restPrefix = 'restak.rest.endpoints.Endpoint::',
	restMiddlewarePrefix = 'restak.rest.middleware.Middleware::',
	objPrefix = '';

/**
 * Describes a requested execution of a command.  When creating the application context,
 * commands can be asked to execute with sopecific instructions, once the creation of the
 * application context is complete.
 *
 * @typedef DeferredExecution
 * @memberof restak.app-server
 * @type {object}
 * @property {string} commandKey - The key that identifies the command.
 * @property {string} description - A description of the command execution request.
 * @property {object} data - The data to pass to the command when executing.
 */

/**  
 * Provide the context for running an application using {@link restak.app-server.ApplicationServer}.  All {@link restak.command.Command|commands}, 
 * {@link restak.query.Query|queries}, and other objects should be registered with an {@link restak.app-server.ApplicationContext} before 
 * initializing the {@link restak.app-server.ApplicationServer}.
 *
 * @constructor
 * @memberof restak.app-server
 * @implements restak.command.CommandFactory
 * @implements restak.query.QueryFactory
 * @param {restak.app-server.Config} config - configuration settings
 */
var ApplicationContext = function(config){
	
	/** 
	 * The configuration settings.
	 *
	 * @type restak.app-server.Config
	 */
	this.config = config || new DefaultConfig({});

	/** */
	this.objectFactory = new DefaultObjectFactory();

	/** 
	 * Basic information about the application.
	 *
	 * @type restak.app-server.ApplicationDescriptor
	 */
	this.appDescriptor = {
		name: this.getConfigSetting('appName', false) || 'Restak Application Server',
		version: this.getConfigSetting('appVersion', false)
	};
	this.registerObject('restak.app-server.ApplicationDescriptor', this.appDescriptor);

	/**
	 * A command executor that given a key that identifies a command, will execute the command.
	 *
	 * @type restak.command.CommandExecutor
	 */
	this.commandExecutor = new CommandExecutor(this);
	this.registerObject('restak.command.CommandExecutor', this.commandExecutor);

	/**
	 * A query executor that given a key that identifies a query, will execute the query.
	 *
	 * @type restak.query.QueryExecutor
	 */
	this.queryExecutor = new QueryExecutor(this);
	this.registerObject('restak.command.QueryExecutor', this.queryExecutor);

	/**
	 * Deferred executions.
	 *
	 * @type restak.app-server.DeferredExecution[]
	 */
	this.deferreds = [];
};

/**
 * Retrieve a configuration setting using node-config.
 * 
 * @param {string} key - the key to use to locate a value for the setting.
 * @param {boolean} throwIfNotFound - defaults to true.  Throw an error if the setting is not specified; otherwise return null.
 */
ApplicationContext.prototype.getConfigSetting = function(key, throwIfNotFound){
	
	if(throwIfNotFound === false && !this.config.has(key)){
		return null;
	}

	return this.config.get(key);
};

ApplicationContext.prototype._register = function(prefix, key, obj){

	if(!key) {
		logger.warn('Invalid key: ' + key + '; will not register: ' + obj);
		return false;
	}

	var k = prefix + key;

	return this.objectFactory.register(k, obj);
};

ApplicationContext.prototype._get = function(prefix, key, obj){

	if(!key) {
		logger.warn('Unknown key: ' + key);
		return null;
	}

	var k = prefix + key;

	return this.objectFactory.get(k);
};

/** @inheritdoc */
ApplicationContext.prototype.registerCommand = function(commandKey, command){
	return this._register(cmdPrefix, commandKey, command);
};

/** @inheritdoc */
ApplicationContext.prototype.getCommand = function(commandKey){
	var cmd = this._get(cmdPrefix, commandKey);
	
	if(!cmd) {
		throw new CommandNotFoundError(commandKey);
	}

	return cmd;
};

/** @inheritdoc */
ApplicationContext.prototype.hasCommand = function(commandKey){
	return this._get(cmdPrefix, commandKey) != null;
};

/** @inheritdoc */
ApplicationContext.prototype.registerQuery = function(queryKey, query){
	return this._register(qryPrefix, queryKey, query);
};

/** @inheritdoc */
ApplicationContext.prototype.getQuery = function(queryKey){
	var qry = this._get(qryPrefix, queryKey);
	
	if(!qry) {
		throw new QueryNotFoundError(queryKey);
	}

	return qry;
};

/** @inheritdoc */
ApplicationContext.prototype.hasQuery = function(queryKey){
	return this._get(qryPrefix, queryKey) != null;
};

/** 
 * Register an object for use by the application.  Commands and Queries should NOT be registered
 * using this function.  Instead use {@link restak.context.ApplicationContext#registerCommand} or
 * {@link restak.context.ApplicationContext#registerQuery}.
 *
 * @param {string} key - The key that identifies the command.
 * @param {object} obj - The object.
 * @return {boolean} true if the object was registered, otherwise false.
 * 
 * @see restak.context.ObjectFactory#register
 * @see restak.context.ApplicationContext#registerCommand
 * @see restak.context.ApplicationContext#registerQuery
 * @see restak.context.ApplicationContext#registerEndpoint
 */
ApplicationContext.prototype.registerObject = function(key, obj){
	return this._register(objPrefix, key, obj);
};

/**
 * Get an object to use. Commands and Queries should NOT be retreived
 * using this function.  Instead use {@link restak.context.ApplicationContext#getCommand} or
 * {@link restak.context.ApplicationContext#getQuery}.
 *
 * @param {string} key - The key that identifies the object.
 * @return {object} the object.
 *
 * @see restak.context.ObjectFactory#get
 * @see restak.context.ApplicationContext#getCommand
 * @see restak.context.ApplicationContext#getQuery
 * @see restak.context.ApplicationContext#getEndpoint
 */
ApplicationContext.prototype.getObject = function(key){
	return this._get(objPrefix, key);
};

/**
 * Register a endpoint for use by the application.
 *
 * @param {string} key - The key that identifies the endpoint.
 * @param {restak.rest.Endpoint} endpoint - The endpoint.
 * @return {boolean} true if the endpoint was registered, otherwise false.
 * 
 * @see restak.context.ObjectFactory#register
 */
ApplicationContext.prototype.registerEndpoint = function(key, endpoint){

	if(!endpoint.commandExecutor) {
		endpoint.commandExecutor = this.commandExecutor;
	}

	if(!endpoint.queryExecutor) {
		endpoint.queryExecutor = this.queryExecutor;
	}

	return this._register(restPrefix, key, endpoint);
};

/**
 * Get a endpoint to use.
 *
 * @param {string} key - The key that identifies the endpoint.
 * @return {restak.rest.Endpoint} the endpoint.
 */
ApplicationContext.prototype.getEndpoint = function(key){
	return this._get(restPrefix, key);
};

/**
 * Get all endpoints that have been registered.
 *
 * @return {restak.rest.Endpoint[]} the endpoints.
 */
ApplicationContext.prototype.getEndpoints = function(){
	
	var objects = this.objectFactory.objects;

	return Object.keys(objects).filter(
		function(key){
			return key.indexOf(restPrefix) == 0;
		}).map(function(key){
			return objects[key];
		});

	return endpoints;
};

/**
 * Register middleware for use by the application.
 *
 * @param {string} key - The key that identifies the mi.
 * @param {restak.rest.middleware.Middleware} middleware - The middleware.
 * @return {boolean} true if the middleware was registered, otherwise false.
 * 
 * @see restak.context.ObjectFactory#register
 */
ApplicationContext.prototype.registerMiddleware = function(key, middleware){
	return this._register(restMiddlewarePrefix, key, middleware);
};

/**
 * Get middleware to use.
 *
 * @param {string} key - The key that identifies the middleware.
 * @return {restak.rest.middleware.Middleware} the middleware.
 */
ApplicationContext.prototype.getMiddleware = function(key){
	return this._get(restMiddlewarePrefix, key);
};

/**
 * Get all middleware that has been registered.
 *
 * @return {restak.rest.middleware.Middleware[]} the middleware.
 */
ApplicationContext.prototype.getAllMiddleware = function(){
	
	var objects = this.objectFactory.objects;

	return Object.keys(objects).filter(
		function(key){
			return key.indexOf(restMiddlewarePrefix) == 0;
		}).map(function(key){
			return objects[key];
		});

	return middleware;
};

/**
 * Register a command to be eecuted once the application context is fully built.
 *
 * @param key {string} - the command key of the command to execute.
 * @param description {string} - A description of the specific command execution.  Primarily used for logging.
 * @param data {object} - the data to pass to the command
 */
ApplicationContext.prototype.registerDeferredExecution = function(key, description, data) {
	this.deferreds.push({
		description: description,
		commandKey: key,
		data: data
	});
};

module.exports = ApplicationContext;