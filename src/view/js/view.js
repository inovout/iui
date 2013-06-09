Inovout = {};
Inovout.Widget = {};

var View = Class.create({
    initialize: function () {
        return this;
    }
});
jQuery.extend(View, {
    idCache: {},
    get: function (element) {
        //需有缓存处理，应先从全局缓存去获取，若不存在再创建并放入全局缓存。
        var view = View.idCache[element];
        if (!view) {
            var viewElement = Element.create(element);
            var className = viewElement.jqDom[0].className
            $(Object.keys(Inovout.Widget)).each(function (i, widgetClass) {
                if (className.indexOf(widgetClass.toLowerCase()) > -1) {
                    view = new Inovout.Widget[widgetClass](viewElement);
                    View.idCache[view.element.jqDom.attr("id")] = view;
                }
            });
        }
        return view;

    }
});