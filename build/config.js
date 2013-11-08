//一个JS文件表示一个module，
//一个module当中至少有一个component，即类。
//依赖关系只局限于component没有module的依赖。
//若没有配置componet，则componet的名称与模块名相同，不过这种情况应该相对较少。
iui.define({
    name: "jQuery",
    path: "../../../lib/jQuery.js"
});
iui.define({
    name: "prototype-lang",
    path: "../../jslang/prototype-lang.js",
    components: [
        { name: "Object" },
        { name: "Class" }
    ]
});
iui.define({
    name: "iui-lang",
    path: "../../jslang/iui-lang.js",
    components: [
        { name: "Event", depens: ["Class"] },
        { name: "EventAdapter" },
        { name: "HashMap", depens: ["Class"] }
    ]
});
iui.define({
    name: "element",
    path: "../../element/js/element.js",
    components: [
        {
            name: "Inovout.Element",
            depens: ["jQuery", "Class", "HashMap"]
        }
    ]
});
iui.define({
    name: "view",
    path: "../../view/js/view.js",
    //loaded: "Inovout.View.loadWidget",
    components: [
        {
            name: "Inovout.View",
            depens: ["Inovout.Element"],
        }
    ]
});
iui.define({
    name: "page",
    path: "../../page/js/page.js",
    components: [
        {
            name: "Page",
            depens: ["Inovout.View"]
        }
    ]
});
iui.define({
    name: "list",
    path: "../../list/js/list.js",
    components: [
                {
                    name: "Inovout.View.List",
                    depens: ["Inovout.View", "Page"]
                },
                {
                    name: "Inovout.View.TabList",
                    test: function (ele) { return ele.find(".tabList").length > 0; },
                    depens: ["Inovout.View.List"]
                }
    ]
});