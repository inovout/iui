Inovout.Widget = {};

Inovout.View = Class.create({
    initialize: function (element) {
        this.element = Inovout.Element.get(element);
        return this;
    }
});
Object.extend(Inovout.View, {
    factories: {},
    inits: {},
    cache: new HashMap(),
    get: function (element) {
        if (element instanceof Inovout.View) {
            return element;
        }
        element = Inovout.Element.get(element);
        var view = Inovout.View.cache.get(element);
        if (!view) {
            var widgetType;
            for (var viewClass in Inovout.View.factories) {
                if (Inovout.View.factories[viewClass](element)) {
                    widgetType = viewClass;
                    break
                }
            }
            if (!widgetType) {
                for (var widget in Inovout.Widget) {
                    var wc = widget.substring(0, 1).toLowerCase() + widget.substring(1, widget.length);
                    if (element.hasClass(wc)) {
                        widgetType = widget;
                        Inovout.View.factories[widget] = function (ele) { return ele.hasClass(wc); };
                        break
                    }
                }
            }
            if (widgetType) {
                view = new Inovout.Widget[widgetType](element);
            } else {
                view = new Inovout.View(element);
                Object.extend(view, element);
            }
            Inovout.View.cache.add(element, view);
        }
        return view;
    },
    loadWidget: function (components, loader) {
        loader(components, Inovout.Element.get(document))
    }
});