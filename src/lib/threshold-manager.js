'use strict';

var Config = require('./config'),
    WebSocket = require('./communication/web-socket'),
    thresholdErrorCount = 0,
    errorCount = 0,
    thresholdMet = false;

module.exports = {
    init: function (config) {
        thresholdErrorCount = config.threshold.errorCount || 10;
    },
    increment: function () {
        errorCount++;

        if (this.thresholdMet && !WebSocket.isLoaded && !WebSocket.isLoading) {
            WebSocket.loadScript();
        }
    },

    get thresholdMet() {
        if (thresholdMet) {
            return true;
        }

        if (errorCount >= thresholdErrorCount) {
            thresholdMet = true;
            return thresholdMet;
        }

        return false;
    }
};