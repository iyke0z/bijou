import RolesPriviledge from "./javascript/Api/RolesPriviledge";

const menuItems = [
    {
      name: 'Dashboard',
      icon: 'fa fa-tachometer',
      perimssionRequired: false,
      permissions: [],
      path: '/admin/overview',
      title: 'View a summarized dashboard of your business performance',
    },
    {
      name: 'Point of Sale',
      icon: 'fa fa-money',
      perimssionRequired: false,
      permissions: [],
      path: '/sales-point',
      title: 'Access the sales point interface to process transactions',
    },
    {
      name: 'Products',
      icon: 'fa fa-product-hunt',
      perimssionRequired: true,
      permissions: ['can_manage_products', 'can_manage_categories'],
      collapsed: true,
      title: 'Manage your products and categories',  // Added parent title
      children: [
        { name: 'All Products', path: '/product/all', title: 'View and manage all available products' },
        { name: 'New Product', path: '/product/create', title: 'Add a new product to your inventory' },
        { name: 'Categories', path: '/category/all', title: 'Organize products into relevant categories' },
        { name: 'Transfers', path: '/product/transfer-products', title: 'Transfer products between locations or branches' },
        { name: 'Sales Orders', path: '/report/sales-orders', title: 'View customer orders and fulfillment status' }
      ]
    },
    {
      name: 'Purchases',
      icon: 'fa fa-refresh',
      perimssionRequired: true,
      permissions: ['can_manage_purchases'],
      collapsed: true,
      title: 'Manage purchases and suppliers',  // Added parent title
      children: [
        { name: 'All Purchases', path: '/purchase/all', title: 'View all historical and ongoing purchases' },
        { name: 'New Purchase', path: '/purchase/create', title: 'Create a new purchase record' }
      ]
    },
    {
      name: 'Customers',
      icon: 'fa fa-user',
      perimssionRequired: true,
      permissions: ['can_manage_customers'],
      collapsed: true,
      title: 'Manage customer profiles and data',  // Added parent title
      children: [
        { name: 'All Customers', path: '/customer/all', title: 'Browse and manage all customer profiles' },
        { name: 'Add Customer', path: '/customer/create', title: 'Add a new customer to the system' }
      ]
    },
    {
      name: 'Shops',
      icon: 'fa fa-home',
      perimssionRequired: true,
      permissions: ['can_manage_shops'],
      collapsed: true,
      title: 'Manage shop locations',  // Added parent title
      children: [
        { name: 'Manage Shops', path: '/shops', title: 'Add, update, or remove shop locations' }
      ]
    },
    {
      name: 'Staff',
      icon: 'fa fa-users',
      perimssionRequired: true,
      permissions: ['can_manage_users'],
      collapsed: true,
      title: 'Manage staff and employees',  // Added parent title
      children: [
        { name: 'All Staff', path: '/user/all', title: 'View and manage all staff members' },
        { name: 'Add Staff', path: '/user/create', title: 'Create a new staff profile' }
      ]
    },
    {
      name: 'Roles & Access',
      icon: 'fa fa-lock',
      perimssionRequired: true,
      permissions: ['can_manage_roles_priviledges'],
      collapsed: true,
      title: 'Manage roles and access privileges',  // Added parent title
      children: [
        { name: 'Roles', path: '/roles', title: 'Define and edit user roles' },
        { name: 'Privileges', path: '/priviledges', title: 'Manage access rights and permissions' }
      ]
    },
    {
      name: 'Expenses',
      icon: 'fa fa-plus',
      perimssionRequired: true,
      permissions: ['can_manage_expenditure'],
      collapsed: true,
      title: 'Track and manage business expenses',  // Added parent title
      children: [
        { name: 'All Expenses', path: '/expenditure/all', title: 'View and manage all recorded expenses' },
        { name: 'New Expense', path: '/expenditure/create', title: 'Record a new business expense' },
        { name: 'Expense Types', path: '/expenditure/alltype', title: 'List of categorized expense types' },
        { name: 'Add Expense Type', path: '/expenditure/type', title: 'Create a new type of expense' }
      ]
    },
    {
        name: 'Budget Manager',
        icon: 'fa fa-bank',
        perimssionRequired: true,
        permissions: ['can_manage_budget'],
        collapsed: true,
        title: 'Manage Budget',  // Added parent title
        children: [
            {
                name: 'budget',
                path: '/budget',
                title: 'Manage Budget'
            },
        ]
    }, 
    {
      name: 'Reports',
      icon: 'fa fa-bar-chart',
      perimssionRequired: true,
      permissions: ['can_view_reports'],
      collapsed: true,
      title: 'Generate and view business reports',  // Added parent title
      children: [
        { name: 'General Reports', path: '/report/general', title: 'Overview of general business performance' },
        { name: 'Bank Statements', path: '/report/statement', title: 'Check income and expenditures by bank transactions' },
        { name: 'Logistics Reports', path: '/report/logistics', title: 'Track movement of goods and deliveries' }
      ]
    },
    {
        name: 'Backend Manager',
        icon: 'fa fa-database',
        perimssionRequired: true,
        permissions: ['can_manage_backend'],
        collapsed: true,
        title: 'Manage backend records and settings',  // Added parent title
        children: [
            {
                name: 'Manage',
                path: '/backend/manage',
                title: 'Delete and manage stored backend records'
            },
        ]
    },    
    {
      name: 'Support & Help',
      icon: 'fa fa-question-circle',
      perimssionRequired: false,
      permissions: [],
      collapsed: true,
      title: 'Access help resources and support',  // Added parent title
      children: [
        { name: 'How to Use', path: '/business/knowledge-base', title: 'View user guides and tutorials' },
        { name: 'Support', path: '/business/customer-service', title: 'Reach out for help or raise an issue' }
      ]
    },
    {
      name: 'Business Settings',
      icon: 'fa fa-wrench',
      perimssionRequired: false,
      permissions: [],
      collapsed: true,
      title: 'Adjust business settings and billing',  // Added parent title
      children: [
        { name: 'Settings', path: '/business/settings', title: 'Adjust general business settings' },
        { name: 'Billing', path: '/business/billing', title: 'Manage your billing and payment plan' }
      ]
    },
    {
      name: 'Manage Website Content',
      icon: 'fa fa-internet-explorer',
      perimssionRequired: false,
      permissions: ['can_manage_backend'],
      collapsed: true,
      title: 'Adjust website content',  // Added parent title
      children: [
        { name: 'Hero Banner', path: '/website/herobanner', title: 'Home page image banner' },
        { name: 'About', path: '/website/about', title: 'Learn more about your business' },
        { name: 'Contact', path: '/website/contact', title: 'Provide your business contact details' },
        { name: 'Return Policy', path: '/website/return-policy', title: 'Set rules for product returns and refunds' },
        { name: 'Theme Settings', path: '/website/themesettings', title: 'Define your shipping methods and delivery details' },
        { name: 'Payment Config', path: '/website/payment-config', title: 'Define your shipping methods and delivery details' },
        { name: 'FAQ', path: '/website/faq', title: 'Answer common customer questions' },
        { name: 'Website Settings', path: '/website/website-settings', title: 'Manage Website Brand Settings' },
      ]
    },
   
    
];

const filterMenu = (menuItems, access = []) => {
    // Function to check if an item has required permissions
    const hasAccess = (itemPermissions, access) => {
        return access.some(accessItem => 
            itemPermissions.includes(accessItem.priviledge.name)
        );
    };

    // Recursive function to filter menu items
    const filterMenuItems = (items) => {
        if (!items || items.length === 0) {
            // If items is empty, return only the ones that don't require permission
            return items.filter(item => !item.permissionRequired);
        }
    
        return items
            .map(item => {
                // Check if the item doesn't require permission or has required permissions
                const hasPermission = !item.permissionRequired || hasAccess(item.permissions, access);
    
                // If the item has children, filter them recursively
                const children = item.children ? filterMenuItems(item.children) : [];
    
                // Include the item if it has permission or any valid children
                if (hasPermission || children.length > 0) {
                    return {
                        ...item,
                        children: children.length > 0 ? children : undefined,
                    };
                }
    
                return null;
            })
            .filter(Boolean); // Remove null values
    };

    return filterMenuItems(menuItems);
};

const getMenu = async () => {
    const role = localStorage.getItem('role');
    if (role) {
        const res = await RolesPriviledge.get_role_priviledges(role);
        if (res.status === 200 && res.data.data) {
            const access = res.data.data;
            if (access && access.length > 0) {
                // User has permissions, filter based on those permissions
                return filterMenu(menuItems, access);
            } else {
                // User has no permissions, show only items that don't require permission
                return filterMenu(menuItems);
            }
        } else {
            // Fallback if fetching the role privileges fails
            return filterMenu(menuItems);
        }
    } else {
        // If no role is found, show only items that don't require permission
        return filterMenu(menuItems);
    }
};

export default getMenu;