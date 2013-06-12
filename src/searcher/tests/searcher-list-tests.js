

test("Searcher-List Tests", function () {
    var list = new Inovout.Widget.List("searcherList");
    var tip = new Inovout.Widget.Tip("searcherTip");
    ok(list != tip, "list!=tip");
    ok(list.element != tip.element, "list.element!=tip.element");
    var cache = {};
    cache[list.element.dom] = 1;
    cache[tip.element.dom] = 2;
    ok(cache[list.element.dom] == 1, "list.cache ok");
    ok(cache[tip.element.dom] == 2, "tip.cache ok");

    ok(tip.getText() == "", "Tip text为空");
    var item1 = list.element.find("li")[1];
    item1.trigger("click")
    ok(tip.getText() == item1.attr("data-tip"), "Tip text已更新");

});

