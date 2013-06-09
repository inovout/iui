jQuery.extend(Function.prototype, {
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
            var a = jQuery.merge(args, arguments);
            return __method.apply(context, a);
        }
    }
})();


var Class = (function () {

    function subclass() { };
    function create() {
        var parent = null, properties = Object.toArray(arguments);
        if (Object.isFunction(properties[0]))
            parent = properties.shift();

        function klass() {
            this.initialize.apply(this, arguments);
        }

        Object.extend(klass, Class.Methods);
        klass.superclass = parent;
        klass.subclasses = [];

        if (parent) {
            subclass.prototype = parent.prototype;
            klass.prototype = new subclass;
            parent.subclasses.push(klass);
        }

        for (var i = 0, length = properties.length; i < length; i++)
            klass.addMethods(properties[i]);

        if (!klass.prototype.initialize)
            klass.prototype.initialize = Prototype.emptyFunction;

        klass.prototype.constructor = klass;
        return klass;
    }

    function addMethods(source) {
        var ancestor = this.superclass && this.superclass.prototype,
        properties = Object.keys(source);

        if (source.toString != Object.prototype.toString)
            properties.push("toString");
        if (source.valueOf != Object.prototype.valueOf)
            properties.push("valueOf");


        for (var i = 0, length = properties.length; i < length; i++) {
            var property = properties[i], value = source[property];
            if (ancestor && Object.isFunction(value) &&
          value.argumentNames()[0] == "$super") {
                var method = value;
                value = (function (m) {
                    return function () { return ancestor[m].apply(this, arguments); };
                })(property).wrap(method);

                value.valueOf = method.valueOf.bind(method);
                value.toString = method.toString.bind(method);
            }
            this.prototype[property] = value;
        }

        return this;
    }

    return {
        create: create,
        Methods: {
            addMethods: addMethods
        }
    };
})();
