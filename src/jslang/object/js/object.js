
jQuery.extend(Object, {
    toArray: function (obj) {
        return jQuery.makeArray(obj);
    },
    isFunction: function (obj) {
        return jQuery.isFunction(obj);
    },
    isUndefined: function (object) {
        return typeof object === "undefined";
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
    each: function (obj, callback, args) {
        jQuery.each(obj, callback, args);
    },
    map: function (elems, callback, arg) {
        return jQuery.map(elems, callback, arg);
    },
    merge: function (first, second) {
        return jQuery.merge(first, second);
    },
    extend: function () {
        return jQuery.extend.apply(this, Object.toArray(arguments));
    }
})();