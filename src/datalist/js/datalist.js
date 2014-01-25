Inovout.Widgets.DataList = Class.create(Inovout.View, {
    initialize: function ($super, element) {
        $super(element);
        me = this;
        me.discriminator = me.element.attr("data-discriminator");
        me.templates = new Array();
        me.element.find(".template").each(function (seletedElement) {
            var elementId = seletedElement.attr("data-template_id");
            seletedElement.attr("id", elementId)
            me.templates[elementId] = seletedElement;
        })
        return this;
    },
    insertNewRow: function (data) {
        var seletedElement = this.templates[data[this.discriminator]];
        //克隆一份行的模版
        var template = $.templates("#" + seletedElement.attr("id"));
        //利用Jsview控件进行替换
        var htmlOutput = template.render(data);
        //将内容追加到Div中
        var newtr = new Inovout.Element("<div class='wgt'>" + htmlOutput + "</div>");
        this.element.append(newtr);
    }
});