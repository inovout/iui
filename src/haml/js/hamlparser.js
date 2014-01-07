Inovout.HAML.Parsers = {};
Inovout.HAML.Parsers.DataEventAdapter = {
    parse: function (scopeElement) {
        scopeElement.find("[data-event-adapter]").each(function (seletedElement) {
            var eventAdapters = seletedElement.attr("data-event-adapter").split(";");
            eventAdapters.each(function (eventAdapterStatement) {
                if (eventAdapterStatement != "") {
                    var eventAdapterExpression = eventAdapterStatement.split("=");
                    //获取event
                    var eventExpression = eventAdapterExpression[0].split(".");
                    var event = Inovout.View.get(eventExpression[0])[eventExpression[1]];
                    var eventAdapter = new Inovout.HAML.EventAdapter(event);
                    //获取监听对象
                    var view = Inovout.View.get(seletedElement);
                    eventAdapter.addListener(eventAdapterExpression[1], view);
                }
            });
        })
    }
}


Inovout.HAML.Parsers.DataCommandBinder = {
    parse: function (scopeElement) {
        Inovout.Element.eventNames.each(function (eventName) {
            scopeElement.find("[data-" + eventName + "-command]").each(function (seletedElement) {
                //解析data-*-command标识
                var eventAdapterExpression = seletedElement.attr("data-" + eventName + "-command");
                //获取event
                var event = seletedElement[eventName];
                var eventAdapter = new Inovout.HAML.CommandBinder(event, Inovout.View.buildFunction);
                //获取监听对象
                eventAdapter.addListener(eventAdapterExpression, seletedElement);
            });
        })
    }
}


Inovout.HAML.Parsers.EncryptInputParser = {
    parse: function (scopeElement) {
        scopeElement.find("[data-encrypt]").each(function (dedElement) {
            new Inovout.HAML.EncryptInput(dedElement);
        });
    }
}

Inovout.HAML.Parser = {
    parse: function (scopeElement) {
        for (var parser in Inovout.HAML.Parsers) {
            Inovout.HAML.Parsers[parser].parse(scopeElement);
        }
    }
};
