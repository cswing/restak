'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.job-engine.execution-engine'),
	async = require('async'),
	models = require('./models'),
	JobInstanceStatus = models.JobInstanceStatus;

var ExecutionEngine = function(instanceQuery, markInstanceExecutingCommand, markInstanceExecutedCommand, commandExecutor){

	this.instanceQuery = instanceQuery;

	this.markInstanceExecutingCommand = markInstanceExecutingCommand;

	this.markInstanceExecutedCommand = markInstanceExecutedCommand;

	this.commandExecutor = commandExecutor;
};

ExecutionEngine.prototype.invoke = function() {
	var _t = this;
	this.execute(function(){
		setTimeout(function(){
			process.nextTick(_t.invoke.bind(_t));
		}, 5000);
	});
};

ExecutionEngine.prototype.initialize = function(callback){
	process.nextTick(this.invoke.bind(this));
	callback();
};

ExecutionEngine.prototype.executeJob = function(instance, callback){

	var _t = this,
		commandExecutor = this.commandExecutor;

	try {

		commandExecutor.executeCommand(instance.commandKey, instance.params || null, {}, callback);

	} catch(err){
		
		var err = err || 'An error occurred';
		console.dir(err);
		if(err instanceof Error) {
			callback(err.message, null);
		} else {
			callback((err || '').toString(), null);
		}
	}	
};

ExecutionEngine.prototype.execute = function(callback){

	var _t = this,
		instanceQuery = this.instanceQuery,
		markInstanceExecutingCommand = this.markInstanceExecutingCommand,
		markInstanceExecutedCommand = this.markInstanceExecutedCommand,
		queryRequest = {
			pageSize: 100,
			filter: 'status=\'' + JobInstanceStatus.Queued + '\''
		};

	instanceQuery.execute(queryRequest, function(err, result){

		if(err){
			var message = 'Unable to find queued jobs: ' + err; 
			logger.error(message);
			
			return callback(message);
		}

		if(result.items.length <= 0)
			return callback(null);

		logger.debug('Found ' + result.items.length + ' queued jobs.');

		var queue = async.queue(function(instance, cb) {
			
			var instr = {
				data: {
					instanceId: instance.id
				}
			};

			markInstanceExecutingCommand.execute(instr, function(err, updatedInstance){
				if(err){
					logger.error('An error occurred preparing for job execution [instance: ' + instance.id + ']: ' + err);
					return cb();
				}

				_t.executeJob(instance, function(err, result){

					var instr = {
						data: {
							instanceId: instance.id,
							status: err ? JobInstanceStatus.Error : JobInstanceStatus.Completed,
							result: err || result
						}
					};

					setImmediate(function() {
						markInstanceExecutedCommand.execute(instr, function(err, result){
							if(err){
								logger.error('An error updating job after execution [instance: ' + instance.id + ']: ' + err);
							}

							cb();
						});
					});
				});
			});

		}, 5);

		queue.drain = function() {
			callback(null);
		};

		result.items.forEach(function(instance){
			queue.push(instance);
		});
		
	}); // instanceQuery.execute
};

module.exports = ExecutionEngine;