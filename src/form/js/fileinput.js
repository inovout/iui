Inovout.Widgets.FileInput = Class.create(Inovout.View, {
    initialize: function ($super, element) {
        $super(element);
        var me = this;
        this.fileInput = new o.FileInput({
            browse_button: element.find(".fileInput_browse_button")[0].dom, // or document.getElementById('file-picker')
            container: element.dom
        });
        this.fileInput.init();

        return this;
    }
});
