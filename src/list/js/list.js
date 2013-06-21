
Inovout.Widget.TabList = Class.create(Inovout.View, {
    initialize: function ($super, element) {
        $super(element);
        this.selectedChanged = new Event("selectedChanged", this);
        var me = this;
        this.element.children().each(function (liElement) {
            liElement.click.addListener(function (sender, args) {
                var clickItem = sender;//点击的li
                var activeItem = me.element.find("li.selected")[0];//当前活动的li
                if (!clickItem.equals(activeItem)) {
                    activeItem.removeClass("selected");
                    clickItem.addClass("selected");
                    var eventArgs = {
                        text: clickItem.text()
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
                }
            });
        });
        return this;
    },
    valueKeys: undefined
});
