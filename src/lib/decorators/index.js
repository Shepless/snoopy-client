'use strict';

var Decorator = require('./decorator'),
    Logger = require('../logger'),
    consoleMethods = ['debug', 'error', 'info', 'log', 'warn'],
    vendors = ['ms', 'moz', 'webkit', 'o'],
    supportsAnimationFrame = (window.requestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame);

module.exports = {
    init: function (config) {
        Decorator.decorate(window, 'onerror', 'onerror');
        Decorator.decorate(window, 'setTimeout', 'timer');
        Decorator.decorate(window, 'setInterval', 'timer');
        consoleMethods.forEach(function (method) {
            Decorator.decorate(window.console, method, 'console');
        });

        if (supportsAnimationFrame) {
            Decorator.decorate(window, 'requestAnimationFrame', 'timer');
        }

        if (config.userInteraction.allow) {
            Decorator.decorate(null, null, 'element', config.userInteraction);
        }
    }
};