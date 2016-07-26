'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.nedb'),
	ApplicationContext = require('../app-server/application-context');


ApplicationContext.prototype.registerJob = function(key, jobCommand, configProperty){
	
	var name = configProperty.name,
		description = configProperty.description;

	this.registerCommand(key, jobCommand);

	var data = {
		commandKey: key,
		name: name,
		description: description
	};

	this.registerDeferredExecution('restak.job-engine.InstallJobCommand', 'Install job: ' + name, data);
};

module.exports = ApplicationContext;