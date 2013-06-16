var Page = Class.create({

    initialize: function () {
        return this;
    },
    init: function () {
        this.parseEventAdapter(document);
    },
    parseEventAdapter: function (selector) {
        var selectorElement = Inovout.Element.get(selector);
        selectorElement.find("[ data-event-adapter]").each(function (dedElement) {
            var eventAdapters = dedElement.attr("data-event-adapter").split(";");
            eventAdapters.each( function (eventAdapterStatement) {
                if (eventAdapterStatement != "") {
                    var eventAdapterExpression = eventAdapterStatement.split("=");
                    var listenerExpression = eventAdapterExpression[1];
                    var lBracketIndex = listenerExpression.indexOf("(");
                    var functionName = listenerExpression.substring(0, lBracketIndex);
                    var functionArgs = listenerExpression.substring((lBracketIndex + 1), (listenerExpression.length - 1));
                    var view = Inovout.View.get(dedElement);
                    if (view) {
                        var eventExpression = eventAdapterExpression[0].split(".");
                        var event = Inovout.View.get(eventExpression[0])[eventExpression[1]];
                        var ela = new EventListenerAdapter(view[functionName], functionArgs, view);
                        event.addListener(ela.inovke, ela);
                    }
                    //searcherList.selectedChanged=update(args.tip)
                    //Event.adapte(event, view, view[functionName], functionArgs);
                }
            });
        });
    }
});
inits["page"] = function () {
    window.page = new Page();
    window.page.init();
}