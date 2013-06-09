Inovout.Widget = {};

View = Class.create({
    initialize: function () {
        return this;
    }
});
jQuery.extend(View, {
    cache: {},
    get: function (element) {
        if (typeof element != "Element") {
            element = Element.get(element);
        }
        var view = View.cache[element];
        if (!view) {
            var className = element.getClassName();
            $(Object.keys(Inovout.Widget)).each(function (i, widgetClass) {
                if (className.indexOf(widgetClass.toLowerCase()) > -1) {
                    view = new Inovout.Widget[widgetClass](element);
                    View.cache[element] = view;
                }
            });
        }
        return view;
    }
});