var EventListenerAdapter = Class.create({
    initialize: function (lfn, lfnArgs, scope) {
        this.lfn = lfn;
        this.lfnArgs = lfnArgs;
        this.scope = scope;
        return this;
    },
    inovke: function (sender, args) {
        var listenerArgs = [];
        var propertyNames = this.lfnArgs.split(",")
        propertyNames.each(function (propertyName) {
            var propertyNameArray = propertyName.split(".");
            var propertyValue;
            if (propertyNameArray[0] == "sender") {
                propertyValue = sender;
            }
            else if (propertyNameArray[0] == "args") {
                propertyValue = args;
                for (var i = 1; i < propertyNameArray.length; i++) {
                    propertyValue = propertyValue[propertyNameArray[i]]
                }
            }
            listenerArgs.push(propertyValue);

        });
        this.lfn.apply(this.scope, listenerArgs);

    }
});