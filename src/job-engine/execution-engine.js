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

ExecutionEngine.prototype.executeJob = function(instance, callback){

	var _t = this,
		commandExecutor = this.commandExecutor;

	try {

		commandExecutor._execute(instance.commandKey, instance.params || null, callback);

	} catch(err){
		
		var err = err || 'An error occurred';
		
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

		logger.debug('Found ' + result.items.length + ' queued jobs.');

		async.map(result.items, function(instance, cb){

			var instr = {
				data: {
					instanceId: instance.id
				}
			};

			markInstanceExecutingCommand.execute(instr, function(err, updatedInstance){
				if(err){
					logger.error('An error occurred preparing for job execution [instance: ' + instance.id + ']: ' + err);
					cb(null, null); // an error here should not prevent other jobs from executing
				}

				cb(null, updatedInstance);
			});

		}, function(err, jobsToExecute) {
			
			if(err){ // should never be true
				logger.error('An error occurred preparing jobs for execution: ' + err);
				return;
			}

			var tasks = jobsToExecute.filter(function(instance){
				return instance !== null;
			}).map(function(instance){
				return function(cb){
					_t.executeJob(instance, function(err, result){

						var instr = {
							data: {
								instanceId: instance.id,
								status: err ? JobInstanceStatus.Error : JobInstanceStatus.Completed,
								result: err || result
							}
						};

						markInstanceExecutedCommand.execute(instr, function(err, result){
							if(err){
								logger.error('An error occurred preparing for job execution [instance: ' + instance.id + ']: ' + err);
							}

							cb();
						});
					});
				};
			});

			async.parallel(tasks, function(err){
				logger.debug('Execution complete for ' + result.items.length + ' queued jobs.');
				callback(null);
			});

		}); // async.map
	}); // instanceQuery.execute
};

module.exports = ExecutionEngine;