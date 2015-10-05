'use strict';

var Communication = require('../communication'),
    StackTrace = require('./stacktrace'),
    exceptionsToIgnore = 0;

module.exports = {
    handle: function (exception, ignoreNextOnError) {
        Communication.send({
            name: name || exception.name,
            message: exception.message || exception.description,
            stacktrace: StackTrace.fromException(exception),
            file: exception.fileName || exception.sourceURL,
            lineNumber: exception.lineNumber || exception.line
        });

        if (ignoreNextOnError) {
            exceptionsToIgnore += 1;

            window.setTimeout(function () {
                exceptionsToIgnore -= 1;
            });
        }
    },

    handleOnError: function (message, url, lineNo, charNo, exception) {
        if (exceptionsToIgnore === 0) {
            Communication.send({
                name: exception && exception.name || 'window.onerror',
                message: message,
                file: url,
                lineNumber: lineNo,
                columnNumber: charNo,
                stacktrace: (exception && StackTrace.fromException(exception))
            });
        }
    }
};