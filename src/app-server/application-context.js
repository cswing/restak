'use strict';

var log4js = require('log4js'),
	logger = log4js.getLogger('restak.app-server.ApplicationContext'),
	DefaultObjectFactory = require('./object-factory').DefaultObjectFactory,
	command = require('../command'),
	CommandNotFoundError = command.CommandNotFoundError,
	CommandExecutor = command.CommandExecutor,
	query = require('../query'),
	QueryNotFoundError = query.QueryNotFoundError,
	QueryExecutor = query.QueryExecutor;

var cmdPrefix = 'restak.command.Command::',
	qryPrefix = 'restak.query.Query::',
	restPrefix = 'restak.rest.endpoints.Endpoint::',
	objPrefix = '';

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
	this.config = config;

	/** */
	this.objectFactory = new DefaultObjectFactory();

	/**
	 * A command executor that given a key that identifies a command, will execute the command.
	 *
	 * @type restak.comand.CommandExecutor
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
};

/**
 * Retrieve a configuration setting using node-config.
 * 
 * @param {string} key - the key to use to locate a value for the setting.
 */
ApplicationContext.prototype.getConfigSetting = function(key){
	
	if(!this.config)
		return null;

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

module.exports = ApplicationContext;