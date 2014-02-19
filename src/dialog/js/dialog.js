Inovout.Widgets.Dialog = Class.create(Inovout.View, {
    initialize: function (url, iframewidth, iframeheight, title) {
        //打开对话框
        var dialogTitle = "内容页";
        if (title) {
            dialogTitle = title;
        }
        var html = "<iframe title=\"" + dialogTitle + "\"  frameborder=\"0\" scrolling=\"no\" style=\"width:100%;min-width: 95%;height:auto;\"   src=" + url + "></iframe>";
        this.widgetDialog = $(html).dialog({
            autoOpen: true,
            model: true,
            height: iframeheight,
            width: iframewidth
            //open: function () {
            //    $("#" + iframeid).attr('src', url)
            //}
        })
        //  this.addEventLister("message", this.messageHandle);
        return this;
    },
    messageHandle: function (event) {
        execueDone(event.data);
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
    done: function (fnexpression) {
        //保存回调方法名
        this.fnexpression = fnexpression;
    },
    execueDone: function (args) {
        //执行回调方法
        Inovout.View.buildFunction("data", this.fnexpression).call(this, args);
        //关闭dialog
        //this.removeEventtLister("message", this.messageHandle);
        this.widgetDialog.dialog("close");
    },
    close: function () {
        this.widgetDialog.dialog("close");
    },
    receiveMess: function (data) {
        this.execueDone(data);
    }
});