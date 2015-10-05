var Snoopy = require('./lib'),
    snoopyModule = {};

if (!window.angular) {
    console.warn('Could not detect Angular...');
} else {
    window.angular.module('Snoopy.Client', ['ng'])
        .service('Snoopy', Snoopy);
}

module.exports = snoopyModule;