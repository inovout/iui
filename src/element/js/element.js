var Element = Class.create({

    initialize: function (jqDom) {
        this.jqDom = jqDom;
        this.click = new Event("click", this);
        var owner = this;
        this.jqDom.bind("click", function (event) {
            owner.click.fire(owner, event);
        });
    }
});
jQuery.extend(Element, {
    create: function (dom) {
        //需有缓存处理，应先从全局缓存去获取，若不存在再创建并放入全局缓存。
        var jqDom;
        if (typeof dom == "string") {
            jqDom = $("#" + dom);
        } else {
            jqDom = $(dom);
        }
        return new Element(jqDom);

    }
});