var Page = Class.create(Inovout.View, {
    initialize: function ($super, element) {
        $super(element);
        this.init = new Event("init", this);
        this.load = new Event("load", this);
        return this;
    },
    run: function () {
        var me = this;
        this.init.fire(me, me.wrapEventArgs(me))
        this.load.fire(me, me.wrapEventArgs(me))
        this.parseEventAdapter(me.element);
    },
    wrapEventArgs: function (control) {
        var eventArgs = {
            text: ""
        }
        return eventArgs;
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

        Inovout.Element.eventNames.each(function (eventName) {
            selectorElement.find("input[data-" + eventName + "-command]").each(function (dedElement) {
                debugger;
                //解析data-*-command标识
                var eventAdapterExpression = dedElement.attr("data-" + eventName + "-command");
                //获取event
                var event = dedElement[eventName];
                var eventAdapter = new Inovout.HAML.CommandBinder(event, Inovout.View.buildFunction);
                //获取监听对象
                eventAdapter.addListener(eventAdapterExpression, dedElement);
            });
        })
    },
    showDialog: function (iframeid, url, width, height) {
        debugger;
        //弹出对话框，并且生成dialog对象
        return new Inovout.Widgets.Dialog(iframeid, url, width, height);
    }

});

var DialogPage = Class.create(Page, {
    initialize: function ($super, element) {
        $super(element);
        return this;
    },
    run: function ($super) {
        this.element.find("form").each(function (formElement) {
            //为form表单添加data-async属性
            formElement.attr("data-async", "true");
            //为form表单添加data-submit-command属性
            formElement.attr("data-submit-command", "page.submitCallBack()");
        })
        //执行父类中的方法
        $super();
    },
    submitCallBack: function () {
        //将需要返回的值发送给Dialog
    }
});

//应由专门的main来处理，以后再来重构
//(function (window, document, undefined) {
//iui.main(function () {
if (!iui) {
    var iui = {};
    iui.ready = iui.ready || jQuery(window).ready;
}
var page;
iui.ready(function () {
    if (window === window.parent) {
        page = new Page(document);
    } else {
        debugger;
        page = new DialogPage(document);
    }
    page.init.addListener(function () {
        var elements, doc = Inovout.Element.get(document);
        for (var widget in Inovout.Widgets) {
            var wc = widget.substring(0, 1).toLowerCase() + widget.substring(1, widget.length);
            doc.find("." + wc + "," + widget).each(function (element) {
                Inovout.View.get(element);
            });
        }
    })
    //iui.context.page.run();
    page.run();
});
