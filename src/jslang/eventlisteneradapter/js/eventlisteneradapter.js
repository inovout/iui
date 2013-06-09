jQuery.extend(Event, {
    adapte: function (event, scope, listener, argMap) {
        event.addListener(function (sender, args) {
            var listenerArgs = [];
            var propertyNames = argMap.split(",")
            $(propertyNames).each(function (index, propertyName) {
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