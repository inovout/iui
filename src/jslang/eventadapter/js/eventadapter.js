var EventAdapter = Class.create({
    initialize: function (event,wrapFunction) {
        this.event = event;
        this.wrapFunction = wrapFunction;
        return this;
    },
    listen: function (sender, args) {
        var fnArgs = "sender,args";
        if (this.wrapFunction) {
            this.wrapFunction(fnArgs, this.fnExpression).call(this.scope, sender, args);
        } else {
            Function(fnArgs,this.fnExpression).call(this.scope, sender, args);

        }
    },
    addListener: function (fnExpression, scope, options) {
        this.fnExpression = fnExpression;
        this.scope = scope;
        this.event.addListener(this.listen, this, options);
    }
});