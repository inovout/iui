Inovout.Widget.DataChart = Class.create(Inovout.View, {
    initialize: function ($super, element) {
        $super(element);
        element.highcharts(element.html().toJSON());
        element.css("visibility", "visible");
    }
});