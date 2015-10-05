'use strict';

var Config = require('../config'),
    Logger = require('../logger'),
    ThresholdManager = require('../threshold-manager'),
    WebSocket = require('./web-socket'),
    XHR = require('./xhr');

module.exports = {
    send: function (params) {
        ThresholdManager.increment();

        params.clientSession = Config.sessionId;
        params.timestamp = Date.now();
        params.timeline = Logger.all();

        if (WebSocket.isActive) {
            WebSocket.send(params);
        } else {
            XHR.send(params);
        }

        Logger.clear();
    },
    announce: function (callback) {
        XHR.announce(callback);
    }
};