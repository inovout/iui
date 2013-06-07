var Tabs = Class.create({
    initialize: function (element) {
        if (typeof element == "string") {
            this.viewObject = $("#" + element);
        } else {
            this.viewObject = $(element);
        }
        this.selectedChanged = new Event("selectedChanged", this);

        this.viewObject.bind('click', function() {
            alert($(this).text());
        });
    }
});