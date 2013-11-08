//一个JS文件表示一个module，
//一个module当中至少有一个component，即类。
//依赖关系只局限于component没有module的依赖。
//若没有配置componet，则componet的名称与模块名相同，不过这种情况应该相对较少。
define({
    name: "jQuery",
    path: "../../../lib/jQuery.js"
});
define({
    name: "prototype-lang",
    path: "../../jslang/prototype-lang.js",
    components: [
        { name: "Object" },
        { name: "Class" }
    ]
});
define({
    name: "iui-lang",
    path: "../../jslang/iui-lang.js",
    components: [
        { name: "Event", depens: ["Class"] },
        { name: "EventAdapter" },
        { name: "HashMap", depens: ["Class"] }
    ]
});
define({
    name: "element",
    path: "../../element/js/element.js",
    components: [
        {
            name: "Inovout.Element",
            depens: ["jQuery", "Class", "HashMap"]
        }
    ]
});
define({
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
define({
    name: "page",
    path: "../../page/js/page.js",
    components: [
        {
            name: "Page",
            depens: ["Inovout.View"]
        }
    ]
});
define({
    name: "list",
    path: "../../list/js/list.js",
    components: [
                {
                    name: "Inovout.View.List",
                    depens: ["Inovout.View", "Page"]
                },
                {
                    name: "Inovout.View.TabList",
                    test: iui.hasClass("tabList"),
                    depens: ["Inovout.View.List"]
                }
    ]
});
define({
    name: "serializeJSON",
    path: "../../../lib/jquery.serializeJSON.js"
});
define({
    name: "form",
    path: "../../form/js/form.js",
    components: [
                {
                    name: "Inovout.Controls.Form",
                    test: iui.hasAttr("form","data-async"),
                    depens: ["Inovout.View", "serializeJSON"]
                }
    ]
});
define({
    name: "http",
    path: "../../http/js/http.js",
    components: [
        {
            name: "Http",test:true,
            depens: ["Class"]
        }
    ]
});