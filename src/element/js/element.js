Inovout.Element = Class.create({
    initialize: function (dom) {
        var me = this;
        this.dom = dom;
        this.dom.uid = new Date().getTime() + "" + parseInt(Math.random() * 100000, 10);
        this.dom.toString = function () {
            return me.dom.uid;
        }
        ("blur focus focusin focusout load resize scroll unload click dblclick " +
	    "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	    "change select submit keydown keypress keyup error contextmenu").split(" ").each(function (i, name) {
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
        return this.dom.toString();
    }
});
/**********jQeryAdapter，确保Elenet本身不依赖jQuery，彻底隔离相关Dom的类库**********/
Object.extend(Inovout.Element.prototype, jQuery.fn);
Object.extend(Inovout.Element.prototype, {
    _pushStack: jQuery.fn.pushStack,
    pushStack: function (elems) {
        var ret = this._pushStack(elems);
        return jQuery.map(ret, function (dom) {
            return Inovout.Element.get(dom);
        })
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
            if (dom.tagName && dom.tagName.toLowerCase() == "form") {
                element = new Inovout.Element.Form(dom);
            } else {
                element = new Inovout.Element(dom);
            }
            element.init(dom);
            Inovout.Element.cache.add(dom, element);
        }
        return element;
    }
});


