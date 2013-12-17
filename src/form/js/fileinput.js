Inovout.Widgets.FileInput = Class.create(Inovout.View, {
    initialize: function ($super, element) {

        $super(element);
        var me = this, option = {
            browse_button: element.find(".fileInput_browse_button")[0].dom, // or document.getElementById('file-picker')
            container: element.dom
        };
        if (!!element.data("multiple")) {
            option.multiple = true;
        }
        this.selectedChanged = new Event("selectedChanged", this);

        this.fileInput = new o.FileInput(option);
        this.fileInput.onchange = function (e) {
            me.selectedChanged.fire(me, e.target.files);
        };
        this.fileInput.init();

        //element.change.addListener(function (sender, args) {
        //    alert("e.c")
        //    me.selectedChanged.fire(me, me.fileInput.files);
        //});
        return this;
    }
});
