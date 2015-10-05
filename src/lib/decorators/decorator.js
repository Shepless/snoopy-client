'use strict';

var ExceptionHandler = require('../exceptions/handler'),
    Logger = require('../logger'),
    elementsToTrack = ['button', 'input'],
    lastEvent;

function wrapInTryCatch(entity, options) {
    if (typeof entity !== "function") {
        return entity;
    }
    if (!entity._original) {
        entity._original = function (event) {
            if (options && options.eventHandler) {
                lastEvent = event;
            }

            try {
                return entity.apply(this, arguments);
            } catch (e) {
                ExceptionHandler.handle(e, true);
                throw e;
            }
        };

        entity._original._original = entity._original;
    }

    return entity._original;
}

function eventFunction(originalFn) {
    return function (event, handler, capture, secure) {
        if (handler && handler.handleEvent) {
            handler.handleEvent = wrapInTryCatch(handler.handleEvent, {
                eventHandler: true
            });
        }

        return originalFn.call(this, event, wrapInTryCatch(handler, {
            eventHandler: true
        }), capture, secure);
    };
}

function timerFunction(handler) {
    return function (callback, time) {
        return handler(wrapInTryCatch(callback), time);
    };
}

function onErrorFunction(originalFn) {
    return function (message, url, lineNo, charNo, exception) {
        window.setTimeout(function () {
            ExceptionHandler.handleOnError(message, url, lineNo, charNo, exception);
        });

        if (originalFn) {
            originalFn(message, url, lineNo, charNo, exception);
        }
    };
}

function getElementAttributes(element) {
    for (var b = {}, c = 0; c < element.attributes.length; c++) 'value' !== element.attributes[c].name.toLowerCase() && (b[element.attributes[c].name] = element.attributes[c].value);
    return b
}

function getElement(e) {
    return e.target || document.elementFromPoint(e.clientX, e.clientY);
}

function shouldTrackElementType(element) {
    return (elementsToTrack.indexOf(element.tagName.toLowerCase()) > -1);
}

function elementHandler(e) {
    try {
        var element = getElement(e);

        if (shouldTrackElementType(element)) {
            Logger.add('ui', {
                action: e.type,
                element: {
                    tag: element.tagName.toLowerCase(),
                    attributes: getElementAttributes(element)
                }
            });
        }
    } catch (e) {

    }
}

function consoleMethod (originalFn) {
    return function () {
        var args = Array.prototype.slice.call(arguments);

        Logger.add('c', {
            severity: originalFn.name,
            message: args.join(',')
        });

        originalFn.apply(window.console, arguments);
    }
}

module.exports = {
    decorate: function (obj, name, type, config) {
        if (type === 'element') {
            document.addEventListener('click', elementHandler);

            if (config.elementTypes) {
                elementsToTrack = config.elementTypes;
            }

            return;
        }

        var original = obj[name],
            decoratorFn;

        switch (type) {
            case 'event':
                decoratorFn = eventFunction;
                break;
            case 'timer':
                decoratorFn = timerFunction;
                break;
            case 'onerror':
                decoratorFn = onErrorFunction;
                break;
            case 'console':
                decoratorFn = consoleMethod;
                break;
        }

        obj[name] = decoratorFn(original);
    }
};