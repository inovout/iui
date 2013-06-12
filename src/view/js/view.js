Inovout.Widget = {};

Inovout.View = Class.create({
    initialize: function (element) {
        this.element = Inovout.Element.get(element);
        return this;
    }
});
Object.extend(Inovout.View, {
    factories: {},
    cache: {},
    get: function (element) {
        if (element instanceof Inovout.View) {
            return element;
        }
        element = Inovout.Element.get(element);
        var view = Inovout.View.cache[element];
        if (!view) {
            var className = element.getClassName();
            Object.each(Object.keys(Inovout.Widget), function (i, widgetClass) {
                if (className.indexOf(widgetClass.toLowerCase()) > -1) {
                    view = new Inovout.Widget[widgetClass](element);
                    Inovout.View.cache[element] = view;
                }
            });
        }
        return view;
    },
    init: function (viewClass) {
        var documentElement = Inovout.Element.get(document);
        Object.each(documentElement.find("." + viewClass), function (i, dom) {
            var view = new Inovout.Widget[(viewClass.substring(0, 1).toUpperCase() + viewClass.substring(1))](dom);
            Inovout.View.cache[view.element] = view;
        });
        return Object.values(Inovout.View.cache);
    }
});