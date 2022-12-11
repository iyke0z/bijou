import DashboardLayout from '@/components/Dashboard/Layout/DashboardLayout.vue'
// GeneralViews
import NotFound from '../components/GeneralViews/NotFoundPage.vue'
// Dashboard pages
const Overview = () =>
    import ( /* webpackChunkName: "widgets" */ '../components/Dashboard/Views/Dashboard/Overview.vue')
const Widgets = () =>
    import ( /* webpackChunkName: "widgets" */ '../components/Dashboard/Views/Dashboard/Widgets.vue')

import Login from '../components/Dashboard/Views/Pages/Login.vue'
import Lock from '../components/Dashboard/Views/Pages/Lock.vue'
import Users from '../components/Dashboard/Views/Users/Users.vue'
import CreateUser from '../components/Dashboard/Views/Users/CreateUser.vue'
import UserDetails from '../components/Dashboard/Views/Users/UserDetails.vue'
import UpdateUser from '../components/Dashboard/Views/Users/UpdateUser.vue'
import User from '@/javascript/Api/User'
import Category from '../components/Dashboard/Views/Products/Categories.vue'
import CategoryDetails from '../components/Dashboard/Views/Products/CategoryDetails.vue'
import Products from '../components/Dashboard/Views/Products/Product.vue'
import CreateProduct from '../components/Dashboard/Views/Products/CreateProduct.vue'
import ProductDetails from '../components/Dashboard/Views/Products/ProductDetails.vue'
import Purchases from '../components/Dashboard/Views/Purchases/Purchases.vue'
import CreatePurchase from '../components/Dashboard/Views/Purchases/CreatePurchase.vue'
import UpdatePurchase from '../components/Dashboard/Views/Purchases/UpdatePurchase.vue'
import Customers from '../components/Dashboard/Views/Customers/Customers.vue'
import CustomerDetails from '../components/Dashboard/Views/Customers/CustomerDetails.vue'
import UpdateCustomer from '../components/Dashboard/Views/Customers/UpdateCustomer.vue'
import CreateCustomer from '../components/Dashboard/Views/Customers/CreateCustomer.vue'
import CreateExpType from '../components/Dashboard/Views/Expenditure/CreateType.vue'
import AllExpType from '../components/Dashboard/Views/Expenditure/AllTypes.vue'
import CreateExpenditure from '../components/Dashboard/Views/Expenditure/NewExpenditure.vue'
import AllExpenditure from '../components/Dashboard/Views/Expenditure/AllExpenditure.vue'
import SalesPoint from '../components/Dashboard/Views/SalesPoint/PointOfSale.vue'
import SalesReport from '../components/Dashboard/Views/Report/SalesReport.vue'
import GeneralReport from '../components/Dashboard/Views/Report/GeneralReport.vue'
import Receipt from '../components/Dashboard/Views/Waiter/Receipt.vue'
import Waiter from '../components/Dashboard/Views/Waiter/Index.vue'
import Kitchen from '../components/Dashboard/Views/Kitchen/Index.vue'
import Bar from '../components/Dashboard/Views/Bar/Index.vue'


let loginPage = {
    path: '/',
    name: 'Login',
    component: Login
}
let waiter = {
    path: '/waiter',
    name: 'waiter',
    component: Waiter
}
let kitchen = {
    path: '/kitchen',
    name: 'kitchen',
    component: Kitchen
}
let bar = {
    path: '/bar',
    name: 'bar',
    component: Bar
}
let receipt = {
    path: '/receipt',
    name: 'receipt',
    component: Receipt
}

let lockPage = {
    path: '/lock',
    name: 'Lock',
    component: Lock
}

let user = {
    path: '/user',
    name: 'user',
    component: DashboardLayout,
    beforeEnter: (to, from, next) => {
        User.auth().then((result) => {
            if (result) {
                if (result.data.role_id == 1) {
                    next()
                } else {
                    return next({ name: 'dashboard' })
                }
            } else {
                return next({ name: 'Login' })
            }
        }).catch((err) => {
            return next({ name: 'Login' })
        })
    },
    children: [{
            path: 'create',
            name: 'CreateUser',
            component: CreateUser
        },
        {
            path: 'all',
            name: 'AllUsers',
            component: Users
        },
        {
            path: 'update/:id',
            name: 'UpdateUser',
            component: UpdateUser
        },
        {
            path: 'details/:id',
            name: 'UserDetails',
            component: UserDetails
        },

    ]
}

let category = {
    path: '/category',
    name: 'Category',
    component: DashboardLayout,
    children: [{
        path: 'all',
        name: 'all categories',
        component: Category
    }, {
        path: 'details/:id',
        name: 'categories details',
        component: CategoryDetails
    }]
}

let product = {
    path: '/product',
    name: 'products',
    component: DashboardLayout,
    children: [{
            path: 'all',
            name: 'all products',
            component: Products
        },
        {
            path: 'create',
            name: 'add new product',
            component: CreateProduct
        },
        {
            path: 'detail/:id',
            name: 'product detail',
            component: ProductDetails
        },
        // {
        //     path: 'update/:id',
        //     name: 'update product',
        //     component: UpdateProduct

        // }
    ]
}

let purchase = {
    path: '/purchase',
    name: 'purchases',
    component: DashboardLayout,
    children: [{
            path: 'all',
            name: 'all_purchases',
            component: Purchases
        },
        {
            path: 'create',
            name: 'add new purchase',
            component: CreatePurchase
        },
        {
            path: 'update/:id',
            name: 'update purchase',
            component: UpdatePurchase

        }
    ]
}

let customers = {
    path: '/customer',
    name: 'Customers',
    component: DashboardLayout,
    children: [{
            path: 'all',
            name: 'all_customers',
            component: Customers
        },
        {
            path: 'create',
            name: 'create_customer',
            component: CreateCustomer
        },
        {
            path: 'details/:id',
            name: 'customer_details',
            component: CustomerDetails
        },
        {
            path: 'update/:id',
            name: 'update_customer',
            component: UpdateCustomer
        }
    ]

}

let expenditure = {
    path: '/expenditure',
    name: 'Expenditure',
    component: DashboardLayout,
    children: [{
            path: 'all',
            name: 'all_expenditure',
            component: AllExpenditure
        },
        {
            path: 'create',
            name: 'new_expenditure',
            component: CreateExpenditure
        },
        {
            path: 'alltype',
            name: 'exp_type',
            component: AllExpType
        },
        {
            path: 'type',
            name: 'create_type',
            component: CreateExpType
        }
    ]

}

let salesPoint = {
    path: '/sales-point',
    name: 'SalesPoint',
    component: SalesPoint,
    beforeEnter: (to, from, next) => {
        User.auth().then((result) => {
            if (result) {
                next()
            } else {
                return next({ name: 'Login' })
            }
        }).catch((err) => {
            return next({ name: 'Login' })
        })
    },
}

let report = {
    path: '/report',
    name: 'Report',
    component: DashboardLayout,
    beforeEnter: (to, from, next) => {
        User.auth().then((result) => {
            if (result) {
                if (result.data.role_id == 1) {
                    next()
                } else {
                    return next({ name: 'dashboard' })
                }
            } else {
                return next({ name: 'Login' })
            }
        }).catch((err) => {
            return next({ name: 'Login' })
        })
    },
    children: [{
            path: 'sales',
            name: 'sales_report',
            component: SalesReport
        },
        {
            path: 'general',
            name: 'general_report',
            component: GeneralReport
        }
    ]
}

const routes = [
    loginPage,
    user,
    report,
    category,
    product,
    salesPoint,
    purchase,
    customers,
    expenditure,
    receipt,
    kitchen,
    waiter,
    bar,
    lockPage,
    {
        path: '/admin',
        component: DashboardLayout,
        name: 'dashboard',
        redirect: '/admin/overview',
        beforeEnter: (to, from, next) => {
            User.auth().then((result) => {
                if (result) {
                    next()
                } else {
                    return next({ name: 'Login' })
                }
            }).catch((err) => {
                return next({ name: 'Login' })
            })
        },
        children: [{
                path: 'overview',
                name: 'Overview',
                component: Overview
            },
            {
                path: 'widgets',
                name: 'Widgets',
                component: Widgets
            }
        ]
    },
    { path: '*', component: NotFound }
];

export default routes