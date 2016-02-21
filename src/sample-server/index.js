'use strict';

// set the config directory explicitly.
// this supports the development environment
process.env.NODE_CONFIG_DIR = __dirname +'\\config';

var log4js = require('log4js');
log4js.configure(process.env.NODE_CONFIG_DIR + '/log4js.json');

var	logger = log4js.getLogger('main'),
	config = require('config'),
	express = require('express');

// Configuration
var httpPort = config.get('http.port');

/**
 * Main class. Wraps an express application to provide REST services.
 *
 * @constructor
 * @param {Number} port - The port number to listen on
 */
var Main = function(port){
	this.port = port;
	this.app = express();
};

Main.prototype.start = function() {

	var app = this.app,
		port = this.port;

	// 
	app.get('/', function (req, res) {
		res.send('Sample REST Server!');
	});

	app.listen(port, function () {
		logger.info('Sample REST app listening on port ' + port);
	});
};

new Main(httpPort).start();