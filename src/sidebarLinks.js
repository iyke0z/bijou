import RolesPriviledge from "./javascript/Api/RolesPriviledge";

const menuItems = [
    {
        name: 'Dashboard',
        icon: 'fa fa-tachometer',
        perimssionRequired: false,
        permissions: [],
        path: '/admin/overview'
    },
    {
        name: 'Shops',
        icon: 'fa fa-home',
        perimssionRequired: true,
        permissions: ["can_manage_shops"],
        collapsed: true,
        children: [
            {
                name: 'Manage Shops',
                path: '/shops'
            },
        ]
    },
    {
        name: 'Staff Management',
        icon: 'fa fa-users',
        permissions: ["can_manage_users"],
        perimssionRequired: true,
        collapsed: true,
        children: [
            {
                name: 'Staff',
                path: '/user/all'
            },
            {
                name: 'Add New Staff',
                path: '/user/create'
            },
        ]
    },
    {
        name: 'Product Management',
        permissions: ["can_manage_products", "can_manage_categories"],
        perimssionRequired: true,
        icon: 'fa fa-product-hunt',
        collapsed: true,
        children: [
            {
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
        perimssionRequired: true,
        name: 'Product Purchases',
        permissions: ['can_manage_purchases'],
        icon: 'fa fa-refresh',
        collapsed: true,
        children: [
            {
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
        perimssionRequired: true,
        permissions: ['can_manage_customers'],
        name: 'Customer Management',
        icon: 'fa fa-user',
        collapsed: true,
        children: [
            {
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
        perimssionRequired: true,
        permissions: ['can_manage_roles_priviledges'],
        name: 'Role & Privileges',
        icon: 'fa fa-lock',
        collapsed: true,
        children: [
            {
                name: 'Roles',
                path: '/roles'
            },
            {
                name: 'Privileges',
                path: '/priviledges'
            },
        ]
    },
    {
        perimssionRequired: true,
        name: 'Expenditure Management',
        permissions: ['can_manage_expenditure'],
        icon: 'fa fa-plus',
        collapsed: true,
        children: [
            {
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
        perimssionRequired: false,
        permissions: [],
        path: '/sales-point'
    },
    {
        name: 'Reports',
        permissions: ["can_view_reports"],
        icon: 'fa fa-book',
        perimssionRequired: true,
        collapsed: true,
        children: [
            {
                name: 'Daily Report',
                path: '/report/sales'
            },
            {
                name: 'Periodic Report',
                path: '/report/general'
            },
            {
                name: 'Bank Statement',
                path: '/report/statement'
            },
        ]
    },
    {
        name: 'Self Service',
        perimssionRequired: false,
        permissions: [],
        icon: 'fa fa-wrench',   
        collapsed: true,
        children: [
            {
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
        ]
    }
];

const filterMenu = (menuItems, access) => {
    const filteredMenu = [];

    access.forEach(element => {
        menuItems.forEach(item => {
            // Check if the item does not require permission
            if (!item.perimssionRequired) {
                // Check if the item is already in the filteredMenu
                const exists = filteredMenu.some(filteredItem => filteredItem.name === item.name);
                if (!exists) {
                    filteredMenu.push(item);
                }
            }


            // Additional logic to filter based on permissions
            // Uncomment and modify this part if needed
            item.permissions.forEach(permission => {
                // console.log(permission, element.priviledge.name)
                // return filteredMenu
                if (element.priviledge.name === permission) {
                    const exists = filteredMenu.some(filteredItem => filteredItem.name === item.name);
                    if (!exists) {
                        filteredMenu.push(item);
                    }
                }
            });
        });
    });

    return filteredMenu;
};


const getMenu = async () => {
    const role = localStorage.getItem('role');
    if (role) {
        const res = await RolesPriviledge.get_role_priviledges(role);
        const access = res.data.data;
        return filterMenu(menuItems, access);
    }
};


export default getMenu;
