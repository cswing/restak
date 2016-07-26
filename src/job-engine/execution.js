'use strict';

var log4js = global.log4js || require('log4js'),
	logger = log4js.getLogger('restak.scheduler.Execution'),
	moment = require('moment'),
	models = require('./models'),
	JobDescriptorStatus = models.JobDescriptorStatus,
	JobInstanceStatus = models.JobInstanceStatus;


var Execution = function(commandExecutor, job){

	/** 
	 * The command executor used to execute jobs.
	 *
	 * @protected
	 * @type {restak.command.CommandExecutor}
	 */
	this.commandExecutor = commandExecutor;

	/**
	 *
	 * @protected
	 * @type {restak.scheduler.JobDescriptor}
	 */
	this.job = job;

	/**
	 *
	 * @protected
	 * @type {restak.scheduler.JobInstance}
	 */
	this.jobInstance = {
		jobId: job.id,
		name: job.name,
		instanceId: null,
		status: null,
		startTimestamp: null,
		endTimestamp: null,
		user: {
			id: 'SYSTEM',
			name: 'System'
		},
		data: job.data,
		result: null
	};;
};

Execution.prototype._markExecuting = function(callback){

	var _t = this,
		commandExecutor = this.commandExecutor,
		job = this.job,
		jobInstance = this.jobInstance;

	jobInstance.startTimestamp = moment().toISOString();
	jobInstance.status = JobInstanceStatus.Executing;

	commandExecutor.executeCommand('restak.scheduler.MarkJobExecutingCommand', {
			job: job,
			instance: jobInstance
		}, function(err, result){

			if(err) {
				logger.error('An error occurred preparing for job execution: ' + err);
				callback(err);
			}

			// Update job and instance witht he results of the command
			_t.job = result.data.job;
			_t.jobInstance = result.data.instance;

			callback(null);
		});
};

Execution.prototype._executeCommand = function(callback){

	var _t = this,
		commandExecutor = this.commandExecutor,
		job = this.job,
		jobInstance = this.jobInstance;

	try {
				
		commandExecutor._execute(job.command, jobInstance, callback);

	} catch(err){
		
		var err = err || 'An error occurred';
		
		if(err instanceof Error) {
			callback(err.message, null);
		} else {
			callback((err || '').toString(), null);
		}
	}
};

Execution.prototype._markExecuted = function(){

	var _t = this,
		commandExecutor = this.commandExecutor,
		job = this.job,
		jobInstance = this.jobInstance;
	
	commandExecutor.executeCommand('restak.scheduler.MarkJobExecutedCommand', {
		job: job,
		instance: jobInstance
	}, function(err, result){
		if(err) {
			logger.error('An error occurred updating job status: ' + err);
			return;
		}

		_t.job = result.data.job;
		_t.jobInstance = result.data.instance;
	});

};

Execution.prototype.invoke = function(){

	var _t = this;

	this._markExecuting(function(err){
		if(err) return;

		_t._executeCommand(function(err, result){

			var job = _t.job,
				jobInstance = _t.jobInstance;

			jobInstance.endTimestamp = moment().toISOString();

			if(job.schedule) {
				job.status = JobDescriptorStatus.Scheduled;
			} else {
				job.status = JobDescriptorStatus.Completed;
			}

			if(err) {
				jobInstance.status = JobInstanceStatus.Error;
				jobInstance.result = err;
			} else {
				jobInstance.status = JobInstanceStatus.Completed;
				jobInstance.result = (result || {}).data || null;
			}

			_t._markExecuted();
		});
	});
};

module.exports = Execution;