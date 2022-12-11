export default [{
        name: 'Dashboard',
        icon: 'fa fa-tachometer',
        path: '/admin/overview'
    },
    {
        name: 'Users',
        icon: 'fa fa-users',
        collapsed: true,
        children: [{
                name: 'Users',
                path: '/user/all'
            },
            {
                name: 'Add New User',
                path: '/user/create'
            },
        ]
    },
    {
        name: 'Product',
        icon: 'fa fa-product-hunt',
        collapsed: true,
        children: [{
                name: 'Categories',
                path: '/category/all'
            },
            {
                name: 'Products',
                path: '/product/all'
            },
            {
                name: 'Add New Product',
                path: '/product/create'
            },

        ]
    },
    {
        name: 'Purchases',
        icon: 'fa fa-refresh',
        collapsed: true,
        children: [{
                name: 'Purchases',
                path: '/purchase/all'
            },
            {
                name: 'Add New Purchase',
                path: '/purchase/create'
            },

        ]
    },
    {
        name: 'Customers',
        icon: 'fa fa-user',
        collapsed: true,
        children: [{
                name: 'Customers',
                path: '/customer/all'
            },
            {
                name: 'New Customer',
                path: '/customer/create'
            },

        ]
    },
    {
        name: 'Expenditure',
        icon: 'fa fa-plus',
        collapsed: true,
        children: [{
                name: 'All Expenditures',
                path: '/expenditure/all'
            },
            {
                name: 'New Expenditure',
                path: '/expenditure/create'
            },
            {
                name: 'All Expenditure Types',
                path: '/expenditure/alltype'
            },
            {
                name: 'New Expenditure Type',
                path: '/expenditure/type'
            },

        ]
    },
    // {
    //     name: 'Sales Point',
    //     icon: 'fa fa-bars',
    //     path: '/sales-point'
    // },
    {
        name: 'Report',
        icon: 'fa fa-book',
        collapsed: true,
        children: [{
                name: 'Sales Report',
                path: '/report/sales'
            },
            {
                name: 'General Report',
                path: '/report/general'
            },

        ]
    },
]