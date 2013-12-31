Inovout.HAML.CommandBinder = Class.create(Inovout.HAML.EventAdapter, {
    initialize: function ($super, event, buildFunction) {
        $super(event, buildFunction);
        return this;
    }
});
