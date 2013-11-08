


test("List Tests", function () {
    var list = new Inovout.Widget.List("testList");
    var item0 = list.element.find("li")[0];
    var item1 = list.element.find("li")[1];
    ok(!Object.isUndefined(list), "listtabs is not null!");
    ok(item0.hasClass("selected"), "list 0 有selected");
    ok(!item1.hasClass("selected"), "list 1 没有selected");

    list.selectedChanged.addListener(function (sender, args) {
        ok(sender == list, "事件sender==list");
        ok("测点" == args.text, "选中的text值");
        ok("node" == args.value, "选中的value值");

    });
    item1.trigger("click");
    ok(!item0.hasClass("selected"), "list 0 没有selected");
    ok(item1.hasClass("selected"), "list 1 有selected");
    item1.trigger("click");
    ok(!item0.hasClass("selected"), "list 0 没有selected");
    ok(item1.hasClass("selected"), "list 1 有selected");
});

