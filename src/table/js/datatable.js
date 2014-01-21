Inovout.Widgets.DataTable = Class.create(Inovout.View, {
    initialize: function ($super, element) {
        $super(element);
        this.selectedRowsChanged = new Event("selectedRowsChanged", this);
        this.template = this.element.find(".template")[0];
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
    insertNewRow: function (data) {
        debugger;
        //克隆一份行的模版
        var template = $.templates("#" + this.template.attr("id"));
        //利用Jsview控件进行替换
        var htmlOutput = template.render(data);
        //将内容追加到Table中
        var newtr = new Inovout.Element("<tr>" + htmlOutput + "</tr>");
        this.element.append(newtr);
        Inovout.HAML.Parser.parse(this.element.find("tr:last")[0]);
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