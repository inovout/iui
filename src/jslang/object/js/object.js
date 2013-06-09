Inovout = {};

jQuery.extend(Object, {
    toArray: function (obj) {
        return jQuery.makeArray(obj);
    },
    isFunction: function (obj) {
        return jQuery.isFunction(obj);
    },
    keys: function (object) {
        if (typeof (object) !== "object") { throw new TypeError(); }
        var results = [];
        for (var property in object) {
            if (object.hasOwnProperty(property)) {
                results.push(property);
            }
        }
        return results;
    },
    values: function (object) {
        var results = [];
        for (var property in object)
            results.push(object[property]);
        return results;
    },
    extend: function (destination, source) {
        jQuery.extend(destination, source);
    },
    isUndefined: function (object) {
        return typeof object === "undefined";
    }
})();