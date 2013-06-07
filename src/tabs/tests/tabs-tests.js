test("Tabs Tests", function () {
    var car = new Car();
    ok(!Object.isUndefined(car.runned), "event object is not null!");
    ok(car.runned.name == "runned", "event name!");
    ok(car.runned.observable == car, "event observable!");
});

