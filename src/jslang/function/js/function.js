Object.extend(Function.prototype, {

    argumentNames: function () {
        var names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
      .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
      .replace(/\s+/g, '').split(',');
        return names.length == 1 && !names[0] ? [] : names;
    },
    wrap: function (wrapper) {
        var __method = this;
        return function () {
            var a = jQuery.merge([__method.bind(this)], arguments);
            return wrapper.apply(this, a);
        }
    },
    bind: function (context) {
        if (arguments.length < 2 && Object.isUndefined(arguments[0])) return this;
        var __method = this, args = Array.prototype.slice.call(arguments, 1);
        return function () {
            var a = Object.merge(args, arguments);
            return __method.apply(context, a);
        }
    }
})();