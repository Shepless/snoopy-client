'use strict';

var Config = require('../config'),
    isLoading = false,
    isLoaded = false,
    isConnected = false,
    socket;

function handshake() {
    socket = window.io.connect(Config.webSocketServerUrl + Config.sessionUuid, {
        query: 'token=' + Config.token
    });

    socket
        .on('connect', function () {
            isConnected = true;
        })
        .on('disconnect', function () {
            isConnected = false;
        })
        .on('error', function () {
            isConnected = false;
        });
}

module.exports = {
    loadScript: function () {
        isLoading = true;
        var script = document.createElement('script');
        script.src = 'https://cdn.socket.io/socket.io-1.3.7.js';
        script.async = true;
        script.onload = function () {
            isLoading = false;
            isLoaded = true;
            handshake();
        };
        document.head.appendChild(script);
    },
    get isActive() {
        return (isLoaded && isConnected);
    },
    get isLoading () {
        return isLoading;
    },
    get isLoaded () {
        return isLoaded;
    },
    send: function (params) {
        socket.emit('exception', params);
    }
};