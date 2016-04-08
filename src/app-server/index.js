'use strict';

/**
 * The app-server namespace contains the classes that are necessaary to configure and run an application.
 * The core classes are the {@link restak.app-server.ApplicationContext} and {@link restak.app-server.ApplicationServer}.
 *
 * @namespace restak.app-server
 */

/**
 * Describes the basics about an application.
 *
 * @typedef ApplicationDescriptor
 * @memberof restak.app-server
 * @type {object}
 * @property {string} name - The name of the application.
 * @property {string} version - The version of the application.
 */

/**
 * A registrar function that registers objects with an {@link restak.app-server.ApplciationContext|application context}.
 *
 * @function register
 * @memberof restak.app-server
 * @param {restak.app-server.ApplicationContext} appContext - The application context.
 * @param {Object} opts - Options specific to the register function.
 */

module.exports.ApplicationContext = require('./application-context');
module.exports.ApplicationServer = require('./application-server');
module.exports.DefaultConfig = require('./config');