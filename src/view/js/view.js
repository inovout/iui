Inovout.Widgets = {};

Inovout.View = Class.create({
    initialize: function (element) {
        this.element = Inovout.Element.get(element);
        return this;
    }
});
Object.extend(Inovout.View, {
    cache: new HashMap(),
    tryGet: function (element) {
        for (var widget in Inovout.Widgets) {
            var view, wc = widget.substring(0, 1).toLowerCase() + widget.substring(1, widget.length);
            if (element.hasClass(wc) || widget.toLowerCase() == element.dom.tagName.toLowerCase()) {
                view = new Inovout.Widgets[widget](element);
                Inovout.View.cache.add(element, view);
                return view;
            }
        }
    },
    get: function (element) {
        if (element instanceof Inovout.View) {
            return element;
        }
        element = Inovout.Element.get(element);
        var view = Inovout.View.cache.get(element) || Inovout.View.tryGet(element);
        if (!view) {
            view = new Inovout.View(element);
            Inovout.View.cache.add(element, view);
            Object.extend(view, element);
        }
        return view;
    },
    buildFunction: function (args, fnExpression) {
        fnExpression = fnExpression.trim();
        var dot = fnExpression.indexOf(".");
        var owner = fnExpression.substring(0, dot);
        if (owner != "this" && owner != "" && owner != "page") {
            //view.bindData(args.value);
            fnExpression = "Inovout.View.get(" + owner + ")." + fnExpression.substring(dot + 1, fnExpression.length);
            return Function(args, fnExpression);
        }
        return Function.build(args, fnExpression);
    }
});
