'use strict';

var maxLength = 30,
    log = [];

module.exports = {
    all: function () {
        return log;
    },
    clear: function () {
        log.length = 0;
    },
    truncate: function () {
        if (log.length > maxLength) {
            log = log.slice(Math.max(log.length - maxLength, 0));
        }
    },
    add: function (category, value) {
        value.timestamp = Date.now();
        value.category = category;

        log.push(value);

        this.truncate();
    }
};