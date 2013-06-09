Inovout.Widget.List = List = Class.create({
    initialize: function (dom) {
        this.element = Element.create(dom);
        this.selectedChanged = new Event("selectedChanged", this);
        var owner = this;//通过call来解决this指针问题
        this.element.click.addListener(function (sender, args) {
            var clickItem = $(args.target).closest("li");//点击的li
            var activeItem = sender.jqDom.find("li.selected");//当前活动的li
            if (clickItem[0] != activeItem[0]) {
                activeItem.removeClass("selected");
                clickItem.addClass("selected");
                var eventArgs = {
                    text: clickItem.text()
                }
                var attributes = clickItem[0].attributes;
                for (var i = 0; i < attributes.length; i++) {
                    var attrName = attributes[i].name;
                    var dataAttrIndex = attrName.indexOf("data-");
                    if (dataAttrIndex > -1) {
                        eventArgs[attrName.substring(5, attrName.length)] = attributes[i].value;
                    }
                }
                eventArgs.value = eventArgs.value || clickItem.text();

                owner.selectedChanged.fire(owner, eventArgs);
            }
        });
        return this;
    }
});
