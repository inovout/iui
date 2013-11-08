var EventAdapter = Class.create({
    initialize: function (event) {
        this.event = event;
        return this;
    },
    listen: function (sender, args) {
        Function("sender,args", "this." + this.fnExpression).call(this.scope, sender, args);

        //var me = this;
        //var listenerArgs = [];
        //var propertyNames = this.lfnArgs.split(",")
        //propertyNames.each(function (propertyName) {
        //    var propertyNameArray = propertyName.split(".");
        //    var propertyValue = propertyName;
        //    if (propertyNameArray[0] == "sender") {
        //        propertyValue = sender;
        //    }
        //    else if (propertyNameArray[0] == "args") {
        //        propertyValue = args;
        //        for (var i = 1; i < propertyNameArray.length; i++) {
        //            propertyValue = propertyValue[propertyNameArray[i]]
        //        }
        //    }
        //    listenerArgs.push(propertyValue);

        //});
        //this.lfn.apply(this.scope, listenerArgs);

    },
    addListener: function (fnExpression, scope, options) {
        this.fnExpression = fnExpression;
        this.scope = scope;
        this.event.addListener(this.listen, this, options);
    }
});