var Car = Class.create({
    initialize: function () {
        this.whistling = new Event("runned", this);
    },
    whistle: function (value) {
        this.whistling.fire(this, {value:value});
    }
});
var Passer = Class.create({
    initialize: function () {
    },
    update: function (value) {
        this.text = value;
    }
});
test("Create Event", function () {
    debugger;
    var car = new Car();
    var passer = new Passer();
    var eventListenerAdapter = new EventListenerAdapter(car.whistling,passer, passer.update, { "args.value": "value" });
    var value = "hello";
    car.whistle(value);

    ok(!Object.isUndefined(car), "car object is not null!");
    ok(!Object.isUndefined(car), "passer object is not null!");
    ok(passer.text == value, "passer.text");
});