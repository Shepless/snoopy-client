'use strict';

var Util = require('./util');

module.exports = {
    update: function (obj) {
        Util.extend(this, obj);
    },
    serverUrl: 'http://localhost:8081/',
    get announceUrl() {
        return this.webSocketServerUrl + 'application/announce';
    },
    get loggingUrl() {
        return this.serverUrl + 'log.gif';
    },
    get trackingUrl() {
        return this.serverUrl + 'track.gif';
    },
    get xhrExceptionUrl() {
        return this.webSocketServerUrl + 'exception';
    },
    get webSocketServerUrl() {
        return 'http://localhost:8082/';
    },
    applicationId: null,
    realtimeErrorThreshold: 0,
    trackUserInteraction: true,
    validElements: ['button', 'input'],
    sessionUuid: Util.uuid(),
    sessionStartTimeStamp: Date.now(),
    clientId: 'Not Set',
    clientVersion: 'Not Set',
    token: null
};