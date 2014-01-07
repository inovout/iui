Inovout.HAML = {};
Inovout.HAML.EventAdapter = Class.create({
    initialize: function (event, buildFunction) {
        this.event = event;
        buildFunction = buildFunction || Function.build;
        this.buildFunction = buildFunction;
        return this;
    },
    listen: function (sender, args) {
        this.buildFunction("sender,args", this.fnExpression).call(this.scope, sender, args);
     },
    addListener: function (fnExpression, scope, options) {
        this.fnExpression = fnExpression;
        this.scope = scope;
        this.event.addListener(this.listen, this, options);
    }
});

Inovout.HAML.Parsers = {};
Inovout.HAML.Parsers.EventAdapterParser = {
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

Inovout.HAML.Parser = {
    parse: function (scopeElement) {
        for (var parser in Inovout.HAML.Parsers) {
            Inovout.HAML.Parsers[parser].parse(scopeElement);
        }
    }
};