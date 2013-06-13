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
    cache: {},
    get: function (element) {
        if (element instanceof Inovout.View) {
            return element;
        }
        debugger;
        element = Inovout.Element.get(element);
        var view = Inovout.View.cache[element];
        if (!view) {
            var vidgetClass;
            for (var viewClass in Inovout.View.factories) {
                if (Inovout.View.factories[viewClass](element)) {
                    vidgetClass = viewClass;
                    break
                }
            }
            if (!vidgetClass) {
                for (var widget in Inovout.Widget) {
                    var wc = widget.substring(0, 1).toLowerCase() + widget.substring(1, widget.length);
                    if (element.hasClass(wc)) {
                        vidgetClass = widget;
                        Inovout.View.factories[widget] = function (ele) { return ele.hasClass(wc); };
                        break
                    }
                }
            }
            if (vidgetClass) {
                view = new Inovout.Widget[vidgetClass](element);
                Inovout.View.cache[element] = view;
            }
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