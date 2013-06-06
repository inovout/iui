var View = Class.create({

    initialize: function (viewClass) {
        /// <field type = 'String'>View Class Name</field>
        this.viewClass = viewClass;
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