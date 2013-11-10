Inovout.Widgets = {};
Inovout.Controls = {};

Inovout.View = Class.create({
    initialize: function (element) {
        this.element = Inovout.Element.get(element);
        return this;
    }
});
Object.extend(Inovout.View, {
    factories: {},
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
                for (var widget in Inovout.Widgets) {
                    var wc = widget.substring(0, 1).toLowerCase() + widget.substring(1, widget.length);
                    if (element.hasClass(wc)) {
                        widgetType = widget;
                        Inovout.View.factories[widget] = function (ele) { return ele.hasClass(wc); };
                        break
                    }
                }
            }
            if (widgetType) {
                view = new Inovout.Widgets[widgetType](element);
            } else {
                for (var control in Inovout.Controls) {
                    if (control.toLowerCase() == element.dom.tagName.toLowerCase()) {
                        widgetType = control;
                        break;
                    }
                }
                if (widgetType) {
                    view = new Inovout.Controls[widgetType](element);
                } else {
                    view = new Inovout.View(element);
                    Object.extend(view, element);
                }
            }
            Inovout.View.cache.add(element, view);
        }
        return view;
    },
    wrapFunction: function (args, fnExpression) {
        var dot = fnExpression.indexOf("."),
            bracket = fnExpression.indexOf("(");
        if (dot == -1 || dot > bracket) {
            //fn(sender)
            fnExpression = "this." + fnExpression;
        } else if (dot < bracket) {
            //view.bindData(args.value);
            fnExpression = "Inovout.View.get(" + fnExpression.substr(0, dot) + ")" + fnExpression.substring(dot, fnExpression.length);
        }
        return Function(args, fnExpression);

}
});

iui.load(function () {
    var doc = Inovout.Element.get(document);
    for (var widget in Inovout.Widgets) {
        var wc = widget.substring(0, 1).toLowerCase() + widget.substring(1, widget.length);
        doc.find("." + wc).each(function (element) {
            Inovout.View.get(element);
        });
    }
    for (var control in Inovout.Controls) {
        doc.find(control).each(function (element) {
            Inovout.View.get(element);
        });
    }
});