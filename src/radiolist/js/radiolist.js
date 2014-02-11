Inovout.Widgets.RadioList = Class.create(Inovout.Widgets.List, {
    initialize: function ($super, element) {
        $super(element);
        this.selectedChanged = new Event("selectedChanged", this);
        var me = this;
        element.find("input[type=radio]").each(function (selectdElement) {
            selectdElement.click.addListener(function (sender, args) {
                var clickItem = sender;
                var eventArgs = {
                    text: clickItem.value
                }
                if (!me.valueKeys) {
                    me.valueKeys = [];
                    var attributes = clickItem.getAttributes();
                    for (var i = 0; i < attributes.length; i++) {
                        var attrName = attributes[i].name;
                        var dataAttrIndex = attrName.indexOf("data-");
                        if (dataAttrIndex > -1) {
                            me.valueKeys.push(attrName.substring(5, attrName.length));
                        }
                    }
                }
                for (var i = 0; i < me.valueKeys.length; i++) {
                    eventArgs[me.valueKeys[i]] = clickItem.attr("data-" + me.valueKeys[i]);
                }
                eventArgs.value = eventArgs.value || clickItem.text();
                me.selectedChanged.fire(me, eventArgs);
            })
        });
        return this;
    }
});