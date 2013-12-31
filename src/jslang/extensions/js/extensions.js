Object.extend(Function, {
    build: function (args, fnExpression) {
        if (typeof fnExpression == "object") {
            return Function(args, fnExpression);
        }
        fnExpression = fnExpression.trim();
        var dot = fnExpression.indexOf("."),
            bracket = fnExpression.indexOf("(");
        if (dot == -1 || dot > bracket) {
            //this.alert?this.alert():alert();
            fnExpression = "this." + fnExpression.substring(0, bracket) + "?" + "this." + fnExpression + ":" + fnExpression;
        }
        return Function(args, fnExpression);
    }
});