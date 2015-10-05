'use strict';

var Config = require('./config'),
    Communication = require('./communication'),
    Decorators = require('./decorators'),
    ThresholdManager = require('./threshold-manager');

if (window.Snoopy) {
    Config.update(window.Snoopy);
}

Communication.announce(function (config) {
    ThresholdManager.init(config);
    Decorators.init(config);
    Config.token = config.token;
    Config.sessionId = config.sessionId;
}, function (status, response) {
    console.error('Snoopy failed to announce', status, response);
});

module.exports = {
    config: Config,
    send: Communication.send
};