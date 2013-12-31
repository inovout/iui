var Page = Class.create(Inovout.View, {
    initialize: function ($super, element) {
        $super(element);
        return this;
    },
    init: function () {
        this.parseEventAdapter(this.element);
    },
    parseEventAdapter: function (selector) {
        var selectorElement = Inovout.Element.get(selector);
        selectorElement.find("[ data-event-adapter]").each(function (dedElement) {
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
        });
        selectorElement.find("[data-encrypt]").each(function (dedElement) {
            new Inovout.HAML.EncryptInput(dedElement);
        });

        selectorElement.find("input[data-click-command]").each(function (dedElement) {
            //解析data-*-command标识
            var eventAdapterExpression = dedElement.attr("data-click-command");
            //获取event
            var event = dedElement["click"];
            var eventAdapter = new Inovout.HAML.CommandBinder(event, Inovout.View.buildFunction);
            //获取监听对象
            eventAdapter.addListener(eventAdapterExpression, dedElement);
        });
    }
});
//应由专门的main来处理，以后再来重构
//(function (window, document, undefined) {
//iui.main(function () {
if (!iui) {
    var iui = {};
    iui.load = iui.load || jQuery(window).ready;
    iui.context = {};
}

iui.context.page = new Page(document);
iui.load(function () {
    iui.context.page.init();
});
