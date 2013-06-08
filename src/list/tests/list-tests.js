


test("List Tests", function () {
    debugger;
    var list = new List("testList");
    var item0 = list.element.jqDom.find("li").eq(0);
    var item1 = list.element.jqDom.find("li").eq(1);
    ok(!Object.isUndefined(list), "listtabs is not null!");
    ok(item0.hasClass("selected"), "list 0 有selected");
    ok(!item1.hasClass("selected"), "list 1 没有selected");

    list.selectedChanged.addListener(function (sender, args) {
        ok(sender==list, "事件sender==list");
        ok(args.value==item1.text(), "选中的值");

    });
    item1.trigger("click");
    ok(!item0.hasClass("selected"), "list 1 没有selected");
    ok(item1.hasClass("selected"), "list 1 有selected");
    item1.trigger("click");
    ok(!item0.hasClass("selected"), "list 1 没有selected");
    ok(item1.hasClass("selected"), "list 1 有selected");
});

