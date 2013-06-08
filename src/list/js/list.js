var List = Class.create({
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
                owner.selectedChanged.fire(owner, {
                    text: clickItem.text(),
                    value: clickItem.attr("value") || clickItem.text()
                });
            }
        });
        return this;
    }
});
