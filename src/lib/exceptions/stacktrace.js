'use strict';

var FUNCTION_REGEX = /function\s*([\w\-$]+)?\s*\(/i,
    MAX_FAKE_STACK_SIZE = 10,
    ANONYMOUS_FUNCTION_PLACEHOLDER = '[anonymous]';

module.exports = {
    fromException: function (exception) {
        if (exception.stacktrace) {
            return exception.stacktrace;
        }

        if (exception.stack) {
            return exception.stack;
        }

        if (exception.backtrace) {
            return exception.backtrace;
        }

        return this.generate();
    },

    generate: function () {
        var stacktrace;

        try {
            throw new Error('');
        } catch (exception) {
            stacktrace = this.fromException(exception);
        }

        if (!stacktrace) {
            var functionStack = [],
                current = arguments.callee.caller.caller;

            while (current && functionStack.length < MAX_FAKE_STACK_SIZE) {
                var fn = FUNCTION_REGEX.test(current.toString()) ? RegExp.$1 || ANONYMOUS_FUNCTION_PLACEHOLDER : ANONYMOUS_FUNCTION_PLACEHOLDER;
                functionStack.push(fn);
                current = current.caller;
            }

            stacktrace = functionStack.join('\n');
        }

        return stacktrace;
    }
};