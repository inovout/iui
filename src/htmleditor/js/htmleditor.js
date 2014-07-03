Inovout.Widgets.HtmlEditor = Class.create(Inovout.View, {
    initialize: function ($super, element) {
        debugger;
        $super(element);
        element.attr("id")
        return CKEDITOR.replace(element.attr("id"));
    }
});