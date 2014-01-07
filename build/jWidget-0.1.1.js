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
Inovout.HAML = {};
Inovout.HAML.EventAdapter = Class.create({
    initialize: function (event, buildFunction) {
        this.event = event;
        buildFunction = buildFunction || Function.build;
        this.buildFunction = buildFunction;
        return this;
    },
    listen: function (sender, args) {
        this.buildFunction("sender,args", this.fnExpression).call(this.scope, sender, args);
     },
    addListener: function (fnExpression, scope, options) {
        this.fnExpression = fnExpression;
        this.scope = scope;
        this.event.addListener(this.listen, this, options);
    }
});
Inovout.HAML.EncryptInput = Class.create({
    initialize: function (element) {
        var name = element.attr("name");
        var reg_pk = element.data("encrypt").split("|");
        //去除element的name属性 
        element.removeAttr("name");
        //添加同名隐藏域
        var hiden = $("<input type='hidden' name=" + name + " />");
        element.append(hiden);
        //订阅元素的change事件
        element.change.addListener(function (sender, args) {
            var inputValue = element.val();
            var rsa = new RSAKey();
            rsa.setPublic(reg_pk[0], reg_pk[1]);
            hiden.val(rsa.encrypt(inputValue));
        });
        return this;
    }
})
Inovout.HAML.CommandBinder = Class.create(Inovout.HAML.EventAdapter, {
    initialize: function ($super, event, buildFunction) {
        $super(event, buildFunction);
        return this;
    }
});
Inovout.Widgets = {};

Inovout.View = Class.create({
    initialize: function (element) {
        this.element = Inovout.Element.get(element);
        return this;
    }
});
Object.extend(Inovout.View, {
    cache: new HashMap(),
    tryGet: function (element) {
        for (var widget in Inovout.Widgets) {
            var view, wc = widget.substring(0, 1).toLowerCase() + widget.substring(1, widget.length);
            if (element.hasClass(wc) || widget.toLowerCase() == element.dom.tagName.toLowerCase()) {
                view = new Inovout.Widgets[widget](element);
                Inovout.View.cache.add(element, view);
                return view;
            }
        }
    },
    get: function (element) {
        if (element instanceof Inovout.View) {
            return element;
        }
        element = Inovout.Element.get(element);
        var view = Inovout.View.cache.get(element) || Inovout.View.tryGet(element);
        if (!view) {
            view = new Inovout.View(element);
            Inovout.View.cache.add(element, view);
            Object.extend(view, element);
        }
        return view;
    },
    buildFunction: function (args, fnExpression) {
        fnExpression = fnExpression.trim();
        var dot = fnExpression.indexOf(".");
        var owner = fnExpression.substring(0, dot);
        if (owner != "this." && owner != "") {
            //view.bindData(args.value);
            fnExpression = "Inovout.View.get(" + owner + ")." + fnExpression.substring(dot + 1, fnExpression.length);
            return Function(args, fnExpression);
        }
        return Function.build(args, fnExpression);
    }
});

if (!iui) {
    var iui = {};
    iui.load = iui.load || jQuery(window).ready;
    iui.context = {};
}

iui.load(function () {
    var elements, doc = Inovout.Element.get(document);
    for (var widget in Inovout.Widgets) {
        var wc = widget.substring(0, 1).toLowerCase() + widget.substring(1, widget.length);
        doc.find("." + wc + "," + widget).each(function (element) {
            Inovout.View.get(element);
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
                    var eventAdapter = new Inovout.HAML.EventAdapter(event);
                    //获取监听对象
                    var view = Inovout.View.get(dedElement);
                    eventAdapter.addListener(eventAdapterExpression[1], view);
                }
            });
        });
        selectorElement.find("[data-encrypt]").each(function (dedElement) {
            new Inovout.HAML.EncryptInput(dedElement);
        });

        selectorElement.find("input[data-click-command]").each(function (dedElement) {
            //解析data-*-command标识
            var eventAdapterExpression = dedElement.attr("data-click-command");
            //获取event
            var event = dedElement["click"];
            var eventAdapter = new Inovout.HAML.CommandBinder(event, Inovout.View.buildFunction);
            //获取监听对象
            eventAdapter.addListener(eventAdapterExpression, dedElement);
        });
    }
});
//应由专门的main来处理，以后再来重构
//(function (window, document, undefined) {
//iui.main(function () {
if (!iui) {
    var iui = {};
    iui.load = iui.load || jQuery(window).ready;
    iui.context = {};
}

iui.context.page = new Page(document);
iui.load(function () {
    iui.context.page.init();
});
Inovout.Widgets.List = Class.create(Inovout.View, {
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
        //if (!this.valueKeys) {
        //    this.valueKeys = [];
        //    var attributes = selectedItem.getAttributes();
        //    for (var i = 0; i < attributes.length; i++) {
        //        var attrName = attributes[i].name;
        //        var dataAttrIndex = attrName.indexOf("data-");
        //        if (dataAttrIndex > -1) {
        //            this.valueKeys.push(attrName.substring(5, attrName.length));
        //        }
        //    }
        //}
        //for (var i = 0; i < this.valueKeys.length; i++) {
        //    eventArgs[this.valueKeys[i]] = selectedItem.data(this.valueKeys[i]);
        //}
        Object.extend(eventArgs, selectedItem.data());
        eventArgs.value = eventArgs.value || selectedItem.val() || selectedItem.text();
        return eventArgs;
    },
    valueKeys: undefined
});
Inovout.Widgets.DropDownList = Class.create(Inovout.Widgets.List, {
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

Inovout.Widgets.TabList = Class.create(Inovout.Widgets.List, {
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
Inovout.Widgets.Form = Class.create(Inovout.View, {
    initialize: function ($super, element) {
        $super(element);
        var me = this,
            asyncSubmit = element.data("async");
        if (asyncSubmit) {
            element.complete(element.submit, function (event) {
                if (!event.defaultPrevented) {
                    event.preventDefault();
                    event.stopPropagation();
                    _submit(asyncSubmit);
                }
            });

            //替换FileInput
            element.find("input[type=file]").each(function (file) {
                var fiDom = $("<div class=\"fileInput\"><button type=\"button\" class=\"fileInput_browse_button\">浏览</button></div>")[0];
                file.replaceWith(fiDom);
                Inovout.View.get(fiDom);
            });
        }
        function _submit(callback) {
            
            var uri = new Uri(element.prop("action")),
                data = element.serializeJSON(),
                request = new HttpRequest(element.prop("method"), uri),
                content, client = new HttpClient();
            enctype = element.attr("enctype");

            if (uri.uri.indexOf("[") > 0) {
                for (name in data) {
                    uri.uri = uri.uri.replace(new RegExp("\\[" + name + "\\]", "ig"), data[name]);
                }
            }

            if (request.method == "post") {
                if (enctype == "application/x-www-form-urlencoded") {
                    content = new JsonContent(data);
                } else if (enctype == "multipart/related") {
                    var boundary = "iui_" + ("" + Math.random()).replace(/\D/g, "");
                    content = new MultipartContent("related", boundary);
                    content.add(new JsonContent(data));
                    element.find(".fileInput").each(function (file) {
                        content.add(new FileContent(Inovout.View.get(file.fileInput.files[0])));
                    });
                }
                request.content = content;
            }
            client.send(request).read().done(function (data) {
                
                Inovout.View.buildFunction("data", callback).call(me, data);
                //me.submit.fire(me, data);
            });
        }

        return this;
    }
});
Inovout.Widgets.FileInput = Class.create(Inovout.View, {
    initialize: function ($super, element) {

        $super(element);
        var me = this, option = {
            browse_button: element.find(".fileInput_browse_button")[0].dom, // or document.getElementById('file-picker')
            container: element.dom
        };
        if (!!element.data("multiple")) {
            option.multiple = true;
        }
        this.selectedChanged = new Event("selectedChanged", this);

        this.fileInput = new o.FileInput(option);
        this.fileInput.onchange = function (e) {
            me.selectedChanged.fire(me, e.target.files);
        };
        this.fileInput.init();

        //element.change.addListener(function (sender, args) {
        //    alert("e.c")
        //    me.selectedChanged.fire(me, me.fileInput.files);
        //});
        return this;
    }
});
Inovout.Widgets.DataChart = Class.create(Inovout.View, {
    initialize: function ($super, element) {
        $super(element);
        var option = new Function("return " + element.html().replace(/\n/g, ""))();
        element.empty();
        $(element.dom).highcharts(option);
        //$(element.dom).highcharts(eval("(" + element.html() + ")"));
        element.css("visibility", "visible");
    }
});
Inovout.Widgets.BinaryPad = Class.create(Inovout.View, {
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
Inovout.Widgets.Wizard = Class.create(Inovout.View, {
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
Inovout.Widgets.DataTable = Class.create(Inovout.View, {
    initialize: function ($super, element) {
        $super(element);
        this.selectedRowsChanged = new Event("selectedRowsChanged", this);
        return this;
    },
    selectRow: function (control) {
        //改变背景色
        var _row = control.parent().parent();
        this.element.find(".selected").each(function (row) {
            row.removeClass("selected")
        })
        _row.toggleClass("selected");
        //触发selectedRowsChanged事件
        var me = this;
        this.selectedRowsChanged.fire(me, me.wrapEventArgs(control))
    },
    insertNewRow: function (data, id) {

        //克隆一份行的模版
        var template = $.templates("#" + id);
        //利用Jsview控件进行替换
        var htmlOutput = template.render(data);
        //将内容追加到Table中
        this.element.append("<tr>" + htmlOutput + "</tr>");
    },
    wrapEventArgs: function (control) {
        var hasSelected = false;
        var count = 0;
        this.element.find(".selected").each(function (row) {
            count++;
        })
        if (count > 0) {
            hasSelected = true;
        }
        var eventArgs = {
            "hasSelected": hasSelected
        }
        return eventArgs;
    }
});