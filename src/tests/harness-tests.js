'use strict';

/*
	Configure for all tests
	- logging
 */

var log4js = require('log4js');

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