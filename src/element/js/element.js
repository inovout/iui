var Inovout = {};
Inovout.Element = Class.create({
    initialize: function (dom) {
        var me = this;
        this.dom = dom;
        this.dom.uid = new Date().getTime() + "" + parseInt(Math.random() * 100000, 10);
        this.eventHnadles = {};
        this.eventCallbacks = {};
        ("blur focus focusin focusout load resize scroll unload click dblclick " +
	    "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	    "change select submit keydown keypress keyup error contextmenu").split(" ").each(function (name) {
	        var evt = me[name] = new Event(name, me);
	        evt._addListener = evt.addListener;
	        evt.addListener = function (fn, scope, options) {
	            if (!evt.hasListeners()) {
	                me.bind(name, function (event) {
	                    evt.fire(me, { target: Inovout.Element.get(event.target) });
	                });
	            }
	            evt._addListener(fn, scope, options);

	        };
	    });
    },
    complete: function (event, callback) {
        var name = Object.isString(event) ? event : event.name,
            eventCallbacks,
            me = this;

        if (!(eventCallbacks = this.eventCallbacks[name])) {
            eventCallbacks = this.eventCallbacks[name] = $.Callbacks();
            var elemData = jQuery._data(me.dom);
            me.eventHnadles[name] = elemData.handle || $.event.dispatch;
            var eventHandle = function (e) {
                var ret = me.eventHnadles[name].apply(me.dom, arguments);
                eventCallbacks.fire(e);
                return ret;
            };
            me.removeEventtLister(name, me.eventHnadles[name]);
            me.addEventLister(name, eventHandle);
        }
        eventCallbacks.add(callback);
    },
    addEventLister: function (type, eventHandle) {
        var dom = this.dom;
        if (dom.addEventListener) {
            dom.addEventListener(type, eventHandle, false);

        } else if (dom.attachEvent) {
            dom.attachEvent("on" + type, eventHandle);
        }
    },
    removeEventtLister: function (type, handle) {
        var elem = this.dom;
        if (elem.removeEventListener) {
            elem.removeEventListener(type, handle, false);
        }
        else if (elem.detachEvent) {
            var name = "on" + type;
            if (typeof elem[name] === core_strundefined) {
                elem[name] = null;
            }

            elem.detachEvent(name, handle);
        }
    },
    getClassName: function () {
        return this.dom.className;
    },
    equals: function (that) {
        return this.dom && that.dom && this.dom == that.dom;
    },
    getAttributes: function () {
        return this.dom.attributes;
    },
    toString: function () {
        return this.dom.uid;
    }
});

Object.extend(Inovout.Element, {
    cache: new HashMap(),
    get: function (dom) {
        if (typeof dom == "string") {
            dom = document.getElementById(dom);
        } else if (dom instanceof Inovout.Element) {
            return dom;
        }
        var element = Inovout.Element.cache.get(dom);
        if (!element) {
            element = new Inovout.Element(dom);
            Inovout.Element.cache.add(dom, element);
        }
        return element;
    }
});

Inovout.Element.prototype._initialize = Inovout.Element.prototype.initialize;
Inovout.Element.prototype.initialize = function (dom) {
    Object.extend(this, jQuery.fn);
    this.init(dom);
    var me = this;
    ["find"].each(function (name) {
        me["_" + name] = me[name];
        me[name] = function () {
            var ret = me["_" + name].apply(me, arguments);
            return jQuery.map(ret, function (dom) {
                return Inovout.Element.get(dom);
            })
        };
    });
    Inovout.Element.prototype._initialize.call(this, dom);

};
