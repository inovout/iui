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
        this.parseHAML(me.element);
    },
    wrapEventArgs: function (control) {
        var eventArgs = {
            text: ""
        }
        return eventArgs;
    },
    parseHAML: function (selector) {
        var selectorElement = Inovout.Element.get(selector);
        Inovout.HAML.Parser.parse(selectorElement);
    },
    showDialog: function (url, width, height) {
        var httpurl = new Uri(url);
        httpurl.paras = [];
        httpurl.add({ "_model": "dialog" });
        httpurl.add({ "id": 1 });
        //弹出对话框，并且生成dialog对象
        this.frameDialog = new Inovout.Widgets.Dialog(httpurl.build(), width, height);
        return this.frameDialog;
    },
    closeDialog: function () {
        return this.frameDialog.close();
    },
    postMessage: function (data) {
        this.frameDialog.receiveMess(data);
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
            formElement.attr("data-async", "page.submitCallBack(data)");
        })
        //执行父类中的方法
        $super();
    },
    submitCallBack: function (data) {
        //向父窗体发送消息
        window.parent.page.postMessage(data);
    },
    closeDialog: function () {
        window.parent.page.closeDialog();
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
    page.run();
});
