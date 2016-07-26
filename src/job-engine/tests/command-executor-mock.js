'use strict';

var expect = require('chai').expect,
	assert = require('chai').assert,
	models = require('../models'),
	JobDescriptorStatus = models.JobDescriptorStatus,
	JobInstanceStatus = models.JobInstanceStatus;

var CommandExecutorMock = function(command){
	this.job_pre = null;
	this.jobInstance_pre = null;
	this.job_post = null;
	this.jobInstance_post = null;
	this.command = command;
};

CommandExecutorMock.prototype.executeCommand = function(key, data, callback){
	
	if(key == 'restak.scheduler.MarkJobExecutingCommand') {

		this.job_pre = JSON.parse(JSON.stringify(data.job));
		this.jobInstance_pre = JSON.parse(JSON.stringify(data.instance));

		// Simulate reloading the data from the database where the database is responsible for id generation
		var resultData = JSON.parse(JSON.stringify(data));
		resultData.job.status = JobDescriptorStatus.Executing;

		resultData.instance.instanceId = '0123456-0'

		callback(null, { data: resultData });
		return;
	}

	if(key == 'restak.scheduler.MarkJobExecutedCommand') {

		this.job_post = JSON.parse(JSON.stringify(data.job));
		this.jobInstance_post = JSON.parse(JSON.stringify(data.instance));

		callback(null, { data: data });
		return;
	}

	throw 'Bad key: ' + key;
};

CommandExecutorMock.prototype._execute = function(key, data, callback){
	if(key == 'test.job') {
		this.command(data, function(err, data){
			callback(err, { data: data });
		});
		return;
	}

	throw 'Bad key: ' + key;
};

CommandExecutorMock.prototype.expect = function(jobId, jobName, instanceData, instanceResult, expectedPostJobStatus, expectedPostInstanceStatus){

	var jobInstance_pre = this.jobInstance_pre,
		job_post = this.job_post,
		jobInstance_post = this.jobInstance_post;

	// Before execution
	expect(jobInstance_pre).to.have.property('jobId', jobId);
	expect(jobInstance_pre).to.have.property('name', jobName);
	expect(jobInstance_pre).to.have.property('instanceId');
	expect(jobInstance_pre.instanceId).to.be.null;
	expect(jobInstance_pre).to.have.property('status', JobInstanceStatus.Executing);
	expect(jobInstance_pre.startTimestamp).to.not.be.null;
	expect(jobInstance_pre.endTimestamp).to.be.null;
	expect(jobInstance_pre).to.have.deep.property('user.id', 'SYSTEM');
	expect(jobInstance_pre).to.have.deep.property('user.name', 'System');
	expect(jobInstance_pre.data).to.deep.equal(instanceData);
	expect(jobInstance_pre.result).to.be.null;
	
	// After execution
	expect(job_post).to.have.property('status', expectedPostJobStatus);
	
	expect(jobInstance_post).to.have.property('jobId', jobId);
	expect(jobInstance_post).to.have.property('name', jobName);
	expect(jobInstance_post).to.have.property('instanceId', '0123456-0');
	expect(jobInstance_post).to.have.property('status', expectedPostInstanceStatus);
	expect(jobInstance_post.startTimestamp).to.not.be.null;
	expect(jobInstance_post.endTimestamp).to.not.be.null;
	expect(jobInstance_post).to.have.deep.property('user.id', 'SYSTEM');
	expect(jobInstance_post).to.have.deep.property('user.name', 'System');
	expect(jobInstance_post.data).to.deep.equal(instanceData);
	expect(jobInstance_post.result).to.deep.equal(instanceResult);
};

module.exports = CommandExecutorMock;