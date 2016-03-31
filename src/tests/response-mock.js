'use strict';

var ResponseMock = function(){
	this._sentCalls = 0;
	this._status = null;
	this._headers = {};
};

ResponseMock.prototype.header = function(name, value){
	this._headers[name] = value;
	return this;
};

ResponseMock.prototype.status = function(status){
	this._status = status;
	return this;
};

ResponseMock.prototype.send = function(){
	this._sentCalls++;
	return this;
};

module.exports = ResponseMock;