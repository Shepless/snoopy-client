'use strict';

module.exports = {
    extend: function (source) {
        var args = Array.prototype.slice.call(arguments),
            objects = args.slice(1),
            merge = function (obj) {
                for (var prop in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                        source[prop] = obj[prop];
                    }
                }
            };

        objects.forEach(merge);
        return source;
    },

    uuid: function () {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (a) {
            var b = 16 * Math.random() | 0;
            return ("x" == a ? b : b & 3 | 8).toString(16)
        })
    }
};