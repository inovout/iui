Inovout.HAML.CommandBinder = Class.create(Inovout.HAML.EventAdapter, {
    initialize: function ($super, event, buildFunction) {
        $super(event, buildFunction);
        return this;
    }
});
Inovout.HAML.Parsers.CommandBinderParser = {
    parse: function (scopeElement) {
        Inovout.Element.eventNames.each(function (eventName) {
            scopeElement.find("[data-" + eventName + "-command]").each(function (seletedElement) {
                //解析data-*-command标识
                var eventAdapterExpression = seletedElement.attr("data-" + eventName + "-command");
                //获取event
                var event = seletedElement[eventName];
                //获取监听对象
                var eventAdapter = new Inovout.HAML.CommandBinder(event, Inovout.View.buildFunction);
                eventAdapter.addListener(eventAdapterExpression, seletedElement);
            });
        })
    }
}
