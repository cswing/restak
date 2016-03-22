'use strict';

/*
	Configure for all tests
	- logging
 */

var log4js = require('log4js'),
	config = require('config');

// Because ApplicationContext relies on the concrete impl of config
// and the way config works, all overridden config options need to be 
// specified here.
config.http = {
	port: 21314
};
config.restak = {
	'data-dir': {
		jobs: 'c:/jobs/'
	}
};

before(function() {

	log4js.configure({
		"appenders": [
			{ 
				"type": "console"
			}
		],
		"replaceConsole": false,
		"levels": {
			"[all]": "DEBUG"
		}
	});	
	
});