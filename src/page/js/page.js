var Page = Class.create(View, {

    initialize: function () {
        $super("Page");//定义ViewClass
    },
    getView: function (id) {
        /// <summary>
        /// 根据Id获取View对象
        /// </summary>
        /// <param name="id" type="String">
        /// View对象Id
        /// </param>
        /// <returns type="View" />
        return id;
    }
});