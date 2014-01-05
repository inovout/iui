Inovout.HAML.Parses = {};

Inovout.HAML.Parses = Class.create({
    initialize: function (element) {
        this.element = element
        return this;
    }
});

Object.extend(Inovout.HAML.Parses, {
    markElements: new Array(),
    selected: function (scopElement, mark) {
        scopElement.find(mark).each(function (seletedElement) {
            this.markElements.push(seletedElement);
        })
    },
    parsed: function (mark) {
        for (var element in this.markElements) {
            if (mark == "[data-event-adapter]") {
                var eventAdapters = dedElement.attr("data-event-adapter").split(";");
                eventAdapters.each(function (eventAdapterStatement) {
                    if (eventAdapterStatement != "") {
                        var eventAdapterExpression = eventAdapterStatement.split("=");
                        //获取event
                        var eventExpression = eventAdapterExpression[0].split(".");
                        var event = Inovout.View.get(eventExpression[0])[eventExpression[1]];
                        var eventAdapter = new Inovout.HAML.EventAdapter(event);
                        //获取监听对象
                        var view = Inovout.View.get(dedElement);
                        eventAdapter.addListener(eventAdapterExpression[1], view);
                    }
                });
            }
            if (mark == "[data-encrypt]") {
                new Inovout.HAML.EncryptInput(dedElement);
            }
            if (mark.indexOf("command") != -1) {
                //解析data-*-command标识
                var eventAdapterExpression = dedElement.attr("data-" + eventName + "-command");
                //获取event
                var event = dedElement[eventName];
                var eventAdapter = new Inovout.HAML.CommandBinder(event, Inovout.View.buildFunction);
                //获取监听对象
                eventAdapter.addListener(eventAdapterExpression, dedElement);
            }
        }
    }
});

Inovout.HAML.Parses.DataEventAdapt = Class.create({
    initialize: function ($super, element) {
        $super(element);
        Inovout.HAML.Parses.markElements = null;
        Inovout.HAML.Parses.selected("[data-event-adapter]", element);
        Inovout.HAML.Parses.parsed("[data-event-adapter]");
        return this;
    }
});

Inovout.HAML.Parses.DataCommandBinder = Class.create({
    initialize: function ($super, element) {
        $super(element);
        Inovout.HAML.Parses.markElements = null;
        this.selected(element);
        Inovout.HAML.Parses.parsed("command");
        return this;
    },
    selected: function (element) {
        Inovout.Element.eventNames.each(function (eventName) {
            element.find("[data-" + eventName + "-command]").each(function (dedElement) {
                Inovout.HAML.Parses.markElements.push(dedElement)
            });
        })
    }
});

Inovout.HAML.Parses.DataMark = Class.create({
    initialize: function ($super, element) {
        $super(element);
        Inovout.HAML.Parses.markElements = null;
        Inovout.HAML.Parses.selected("[data-encrypt]", element);
        Inovout.HAML.Parses.parsed("[data-encrypt]");
        return this;
    }
});