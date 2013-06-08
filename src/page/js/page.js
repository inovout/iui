var Page = Class.create({

    initialize: function () {
        return this;
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
$(function () {
    window.page = new Page();
});
