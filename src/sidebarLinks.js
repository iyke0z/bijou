export default [{
        name: 'Dashboard',
        icon: 'fa fa-tachometer',
        path: '/admin/overview'
    },
    {
        name: 'Staff Management',
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
        name: 'Product Management',
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
        name: 'Product Purchases',
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
        name: 'Customer Management',
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
        name: 'Expenditure Management',
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
    {
        name: 'Sales Point',
        icon: 'fa fa-money',
        path: '/sales-point'
    },
    // {
    //     name: 'Restuarant Sales Point',
    //     icon: 'fa fa-money',
    //     path: '/waiter'
    // },
    {
        name: 'Reports',
        icon: 'fa fa-book',
        collapsed: true,
        children: [{
                name: 'Daily Report',
                path: '/report/sales'
            },
            {
                name: 'Periodic Report',
                path: '/report/general'
            },

        ]
    },
    {
        name: 'Self Service',
        icon: 'fa fa-wrench',
        collapsed: true,
        children: [{
                name: 'Business Settings',
                path: '/business/settings'
            },
            {
                name: 'Billing',
                path: '/business/billing'
            },
            {
                name: 'Frequently Asked Questions',
                path: '/business/knowledge-base'
            },
            {
                name: 'Support',
                path: '/business/customer-service'
            },
            // {
            //     name: 'AI Analyst',
            //     path: '/business/analyst'
            // },
            
            
        ]
    }
    
]