var Page = Class.create({

    initialize: function () {
        return this;
    },
    init: function () {
        this.parseEventAdapter(document);
    },
    parseEventAdapter: function (selector) {
        $(selector).find("[ data-event-adapter]").each(function (i, dom) {
            var eventAdapters = $(dom).attr("data-event-adapter").split(";");
            $(eventAdapters).each(function (j, eventAdapterStatement) {
                if (eventAdapterStatement != "") {
                    var eventAdapterExpression = eventAdapterStatement.split("=");
                    var eventExpression = eventAdapterExpression[0].split(".");
                    var listenerExpression = eventAdapterExpression[1];
                    var lBracketIndex = listenerExpression.indexOf("(");
                    var functionName = listenerExpression.substring(0, lBracketIndex);
                    var functionArgs = listenerExpression.substring((lBracketIndex + 1), (listenerExpression.length - 1));
                    debugger;
                    var event = View.get(eventExpression[0])[eventExpression[1]];
                    var view = View.get(dom);
                    //searcherList.selectedChanged=update(args.tip)
                    Event.adapte(event, view, view[functionName], functionArgs);
                }
            });
        });
    }
});
$(function () {
    window.page = new Page();
    window.page.init();
});
