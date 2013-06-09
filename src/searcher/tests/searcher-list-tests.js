

test("List Tests", function () {
    var list = View.get("searcherList");
    var item0 = list.element.jqDom.find("li").eq(0);
    var item1 = list.element.jqDom.find("li").eq(1);
    ok(!Object.isUndefined(list), "listtabs is not null!");
    ok(item0.hasClass("selected"), "list 0 有selected");
    ok(!item1.hasClass("selected"), "list 1 没有selected");
    var tip = View.get("searcherTip");
    ok(tip.getText() == "", "Tip text为空");

    list.element.jqDom.find("li").eq(1).trigger("click");
    ok(!item0.hasClass("selected"), "list 1 没有selected");
    ok(item1.hasClass("selected"), "list 1 有selected");
    item1.trigger("click");
    ok(!item0.hasClass("selected"), "list 1 没有selected");
    ok(item1.hasClass("selected"), "list 1 有selected");
    ok(tip.getText() == item1.attr("data-tip"), "Tip text已更新");

});

