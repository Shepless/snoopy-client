'use strict';

var Config = require('../config'),
    failedAnnounceAttempts = 0;

function ajax(url, data, success, fail) {
    var xhr = new (window.XMLHttpRequest || window.ActiveXObject)('MSXML2.XMLHTTP.3.0');
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.onreadystatechange = function () {
        if (xhr.readyState > 3) {
            if (xhr.status > 0 && xhr.status < 400) {
                success(JSON.parse(xhr.responseText));
            } else {
                fail(xhr.status, xhr.responseText);
            }
        }
    };
    xhr.send(JSON.stringify(data));
}

module.exports = {
    announce: function (success, fail) {
        try {
            ajax(Config.announceUrl, {
                applicationId: Config.applicationId,
                sessionUuid: Config.sessionUuid,
                sessionStartTimeStamp: Config.sessionStartTimeStamp,
                clientId: Config.clientId,
                clientVersion: Config.clientVersion,
                device: {
                    viewport: {
                        width: window.innerWidth,
                        height: window.innerHeight
                    }
                }
            }, success, fail);
        } catch (e) {
            console.error(e);
            failedAnnounceAttempts++;
            fail();
        }
    },

    send: function (data) {
        ajax(Config.xhrExceptionUrl, data, function () {}, function () {})
    },

    get shouldAnnounce() {
        return (failedAnnounceAttempts < 3);
    }
};