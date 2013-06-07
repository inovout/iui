var Car = Class.create({
    initialize: function () {
        this.runned = new Event("runned", this);
    },
    run: function (value) {
        this.runned.fire(this, value);
    }
});

test("Create Event", function () {
    var car = new Car();
    ok(!Object.isUndefined(car.runned), "event object is not null!");
    ok(car.runned.name == "runned", "event name!");
    ok(car.runned.observable == car, "event observable!");
});
test("Add Event Listener", function () {
    var car = new Car();
    var listener = function () { };
    car.runned.addListener(listener);
    var listenerIndex = car.runned.findListener(listener);
    ok(car.runned.listeners.length == 1, "event listeners count!");
    ok(listenerIndex == 0, "event listener has added!");
});
test("Fire Event", function () {
    var car = new Car();
    var value = "car run args";
    car.runned.addListener(function (sender, args) {
        ok(!Object.isUndefined(sender), "sender object is not null!");
        ok(!Object.isUndefined(args), "args object is not null!");
        ok(sender == car, "sender object is car!");
        ok(args == value, "args value is not empty!");
    });
    car.run(value);
});
