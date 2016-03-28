'use strict';

var expect = require('chai').expect,
	urlUtil = require('url');

module.exports.expectLink = function(link, name, rel, path){
	expect(link).to.not.be.null;
	expect(link).to.have.deep.property('name', name);
	expect(link).to.have.deep.property('rel', rel);

	var parsedUrl = urlUtil.parse(link.url);
	expect(parsedUrl.path).to.equal(path);
};