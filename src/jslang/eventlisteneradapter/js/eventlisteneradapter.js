var EventListenerAdapter = Class.create({
    initialize: function (event,scope, listener, map) {
        this.event = event;
        this.listener = listener;
        this.map = map;
        this.event.addListener(function (sender, args) {
            var listenerArgs = [];
            var propertyNames = Object.propertyNames(map);
            $(propertyNames).each(function (index,propertyName) {
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
            listener.apply(scope, listenerArgs);
        });
    }
});