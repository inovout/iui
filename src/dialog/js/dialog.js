Inovout.Widgets.Dialog = Class.create(Inovout.View, {
    initialize: function (iframeid, url, iframewidth, iframeheight) {
        //打开对话框
        $("#" + iframeid).dialog({
            autoOpen: true,
            model: true,
            height: iframeheight,
            width:iframewidth,
            open: function () {
                $("#" + iframeid).attr('src', url)
                $("#" + iframeid).attr('width', iframewidth)
            }
        })
        return this;
    },
    addEventListener: function (type, eventHandle) {
        var dom = this.dom;
        if (dom.addEventListener) {
            dom.addEventListener(type, eventHandle, false);

        } else if (dom.attachEvent) {
            dom.attachEvent("on" + type, eventHandle);
        }
    },
    callBackMethod:[],
    done: function (functionName) {
        //保存回调方法名
        callBackMethod = arguments;
    },
    execueDone: function (args) {
        //执行回调方法
        debugger;
        callBackMethod = Inovout.View.buildFunction(arguments[0])
        callBackMethod.call(this, args);
    }
});