if (!Inovout) {
    var Inovout = {};
}
Inovout.Element = Class.create({
    initialize: function (dom) {
        var me = this;
        this.dom = dom;
        this.dom.uid = new Date().getTime() + "" + parseInt(Math.random() * 100000, 10);

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
            element = new Inovout.Element(dom);
            element.init(dom);
            Inovout.Element.cache.add(dom, element);
        }
        return element;
    }
});


Inovout.Widget = {};

Inovout.View = Class.create({
    initialize: function (element) {
        this.element = Inovout.Element.get(element);
        return this;
    }
});
Object.extend(Inovout.View, {
    factories: {},
    cache: new HashMap(),
    get: function (element) {
        if (element instanceof Inovout.View) {
            return element;
        }
        element = Inovout.Element.get(element);
        var view = Inovout.View.cache.get(element);
        if (!view) {
            var widgetType;
            for (var viewClass in Inovout.View.factories) {
                if (Inovout.View.factories[viewClass](element)) {
                    widgetType = viewClass;
                    break
                }
            }
            if (!widgetType) {
                for (var widget in Inovout.Widget) {
                    var wc = widget.substring(0, 1).toLowerCase() + widget.substring(1, widget.length);
                    if (element.hasClass(wc)) {
                        widgetType = widget;
                        Inovout.View.factories[widget] = function (ele) { return ele.hasClass(wc); };
                        break
                    }
                }
            }
            if (widgetType) {
                view = new Inovout.Widget[widgetType](element);
            } else {
                view = new Inovout.View(element);
                Object.extend(view, element);
            }
            Inovout.View.cache.add(element, view);
        }
        return view;
    }
});

iui.load(function () {
    var doc = Inovout.Element.get(document);
    for (var widget in Inovout.Widget) {
        var wc = widget.substring(0, 1).toLowerCase() + widget.substring(1, widget.length);
        doc.find("." + wc).each(function (element) {
            Inovout.View.get(element);
            //var view = Inovout.View.get(element);
            //if (view.init) {
            //    view.init.call(view);
            //}
        });
    }
});var Page = Class.create(Inovout.View, {
    initialize: function ($super, element) {
        $super(element);
        return this;
    },
    init: function () {
        this.parseEventAdapter(this.element);
    },
    parseEventAdapter: function (selector) {
        var selectorElement = Inovout.Element.get(selector);
        selectorElement.find("[ data-event-adapter]").each(function (dedElement) {
            var eventAdapters = dedElement.attr("data-event-adapter").split(";");
            eventAdapters.each(function (eventAdapterStatement) {
                if (eventAdapterStatement != "") {
                    var eventAdapterExpression = eventAdapterStatement.split("=");
                    //获取event
                    var eventExpression = eventAdapterExpression[0].split(".");
                    var event = Inovout.View.get(eventExpression[0])[eventExpression[1]];
                    var eventAdapter = new EventAdapter(event);
                    //获取监听对象
                    var view = Inovout.View.get(dedElement);
                    eventAdapter.addListener(eventAdapterExpression[1],view);
                    //var listenerExpression = eventAdapterExpression[1];
                    //var lBracketIndex = listenerExpression.indexOf("(");
                    //var functionName = listenerExpression.substring(0, lBracketIndex);
                    //var functionArgs = listenerExpression.substring((lBracketIndex + 1), (listenerExpression.length - 1));
                  
                    //if (view) {
                     
                    //    var ela = new EventAdapter(view[functionName], functionArgs, view);
                    //    event.addListener(ela.inovke, ela);
                    }
                    //searcherList.selectedChanged=update(args.tip)
                    //Event.adapte(event, view, view[functionName], functionArgs);
                //}
            });
        });
    }
});
//应由专门的main来处理，以后再来重构
//(function (window, document, undefined) {
//iui.main(function () {
iui.context.page = new Page(document);
iui.load(function () {
    iui.context.page.init();
});
Inovout.Widget.List = Class.create(Inovout.View, {
    initialize: function ($super, element) {
        $super(element);
        this.selectedChanged = new Event("selectedChanged", this);
        return this;
    },
    bindData: function (data) {
        if (Object.isJSON(data)) {
            element.empty();
            $.each(data, function (i, item) {
                this.add(item);
            });

        } else {
            $.getJSON(data).done(function (result) {
                this.bindData(result);
            });
        }
    },
    wrapEventArgs: function (selectedItem) {
        var eventArgs = {
            text: selectedItem.text()
        }
        if (!this.valueKeys) {
            this.valueKeys = [];
            var attributes = selectedItem.getAttributes();
            for (var i = 0; i < attributes.length; i++) {
                var attrName = attributes[i].name;
                var dataAttrIndex = attrName.indexOf("data-");
                if (dataAttrIndex > -1) {
                    this.valueKeys.push(attrName.substring(5, attrName.length));
                }
            }
        }
        for (var i = 0; i < this.valueKeys.length; i++) {
            eventArgs[this.valueKeys[i]] = selectedItem.data(this.valueKeys[i]);
        }
        eventArgs.value = eventArgs.value || selectedItem.val() || selectedItem.text();
        return eventArgs;
    },
    valueKeys: undefined
});

Inovout.Widget.DropDownList = Class.create(Inovout.Widget.List, {
    initialize: function ($super, element) {
        $super(element);
        var me = this;
        element.change.addListener(function (sender, args) {
            var selectedOption = me.element.children("option:selected")[0];
            me.selectedChanged.fire(me, me.wrapEventArgs(selectedOption));
        });
        return this;
    },
    add: function (item) {
        this.element.append("<option value=\""+item.value+"\">"+item.value+"</option>");
    }
});

Inovout.Widget.TabList = Class.create(Inovout.Widget.List, {
    initialize: function ($super, element) {
        $super(element);
        this.selectedChanged = new Event("selectedChanged", this);
        var me = this;
        this.element.children().each(function (liElement) {
            liElement.click.addListener(function (sender, args) {
                var clickItem = sender;//点击的li
                var activeItem = me.element.find("li.selected")[0];//当前活动的li
                if (!clickItem.equals(activeItem)) {
                    activeItem.removeClass("selected");
                    clickItem.addClass("selected");
                    var eventArgs = {
                        text: clickItem.text()
                    }
                    if (!me.valueKeys) {
                        me.valueKeys = [];
                        var attributes = clickItem.getAttributes();
                        for (var i = 0; i < attributes.length; i++) {
                            var attrName = attributes[i].name;
                            var dataAttrIndex = attrName.indexOf("data-");
                            if (dataAttrIndex > -1) {
                                me.valueKeys.push(attrName.substring(5, attrName.length));
                            }
                        }
                    }
                    for (var i = 0; i < me.valueKeys.length; i++) {
                        eventArgs[me.valueKeys[i]] = clickItem.attr("data-" + me.valueKeys[i]);
                    }
                    eventArgs.value = eventArgs.value || clickItem.text();

                    me.selectedChanged.fire(me, eventArgs);
                }
            });
        });
        return this;
    },
    valueKeys: undefined
});
Inovout.Widget.DataChart = Class.create(Inovout.View, {
    initialize: function ($super, element) {
        $super(element);
        var option = new Function("return " + element.html().replace(/\n/g, ""))();
        element.empty();
        $(element.dom).highcharts(option);
        //$(element.dom).highcharts(eval("(" + element.html() + ")"));
        element.css("visibility", "visible");
    }
});
$(function () {
    $(".dataChart").each(function (i, dom) {
        Inovout.View.get(dom);
    });
});Inovout.Widget.BinaryPad = Class.create(Inovout.View, {
    initialize: function ($super, element) {
        $super(element);
        this.navs = Inovout.Element.get(document).find(".binaryPad-nav>span");
        this.articles = element.children("article");
        var me = this;
        this.navs.each(function (nav) {
            nav.click.addListener(function (sender, args) {
                me.navs.each(function (n) {
                    n.toggle();
                });
                me.articles.each(function (a) {
                    a.toggle();
                });

            });
        });
    }
});
$(function () {
    $(".binaryPad").each(function (i, dom) {
        Inovout.View.get(dom);
    });
});Inovout.Widget.Wizard = Class.create(Inovout.View, {
    initialize: function ($super, element) {
        $super(element);
        this.navs = element.find("nav>span");
        this.articles = element.find("div>article");
        this.currentArticle = 0;
        var me = this;
        this.navs[0].click.addListener(function (sender, args) {
            me.currentArticle--;
            me.show(me.currentArticle);
            if (me.currentArticle < me.articles.length - 1) {
                me.navs[1].css("visibility", "visible");
            }
            if (me.currentArticle == 0) {
                me.navs[0].css("visibility", "hidden");
            }
        });
        this.navs[1].click.addListener(function (sender, args) {
            me.currentArticle++;
            me.show(me.currentArticle);
            if (me.currentArticle > 0) {
                me.navs[0].css("visibility", "visible");
            }
            if (me.currentArticle == me.articles.length - 1) {
                me.navs[1].css("visibility", "hidden");
            }
        });
        if (this.navs.length > 2) {
            this.navs[2].click.addListener(function (sender, args) {
                me.currentArticle = me.articles.length - 1;
                me.show(me.currentArticle);
            });
        }
    },
    show: function (i) {
        this.articles.each(function (item) { item.hide(); });
        this.articles[i].show();
    }
});
$(function () {
    $(".wizard").each(function (i, dom) {
        Inovout.View.get(dom);
    });
});