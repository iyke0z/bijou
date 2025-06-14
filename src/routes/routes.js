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
import Settings from '../components/Dashboard/Views/Settings.vue'
import Subscribe from '../components/Dashboard/Views/Subscribe.vue'
import KnowledgeBase from '../components/Dashboard/Views/KnowledgeBase/KnowledgeBase.vue'
import CustomerService from '../components/Dashboard/Views/CustomerService.vue'
import SalesReport from '../components/Dashboard/Views/Report/SalesReport.vue'
import GeneralReport from '../components/Dashboard/Views/Report/GeneralReport.vue'
import Receipt from '../components/Dashboard/Views/Waiter/Receipt.vue'
import Waiter from '../components/Dashboard/Views/Waiter/Index.vue'
import Kitchen from '../components/Dashboard/Views/Kitchen/Index.vue'
import Bar from '../components/Dashboard/Views/Bar/Index.vue'
import ReportPrint from '../components/Dashboard/Views/Report/PrintReport.vue'
import Role from '@/components/Dashboard/Views/Roles/Roles.vue'
import Priviledges from '@/components/Dashboard/Views/Roles/Priviledges.vue'
import Shops from '@/components/Dashboard/Views/Shops/Shops.vue'
import axios from 'axios'
import RolesPriviledge from '@/javascript/Api/RolesPriviledge'
import BankStatement from '@/components/Dashboard/Views/Report/BankStatement.vue'
import Prompt from '@/components/Dashboard/Views/AI/Prompt.vue'
import Invoice from '@/components/Dashboard/Views/SalesPoint/Invoice.vue'
import SalesOrder from '@/components/Dashboard/Views/SalesPoint/SalesOrder.vue'
import SaleOrder from '@/components/Dashboard/Views/Products/SalesOrder.vue'
import GoodsRecievedNote from '@/components/Dashboard/Views/SalesPoint/GoodsRecievedNote.vue'
import ProductDistribution from '@/components/Dashboard/Views/Products/ProductDistribution.vue'
import Logistics from '@/components/Dashboard/Views/Report/Logistics.vue'
import Backend from '@/components/Dashboard/Views/Backend.vue'
import Budget from '@/components/Dashboard/Views/Budget/Budget.vue'
import HeroBanner from '@/components/Dashboard/Views/website/HeroBanner.vue'
import About from '@/components/Dashboard/Views/website/About.vue'
import Contact from '@/components/Dashboard/Views/website/Contact.vue'
import ReturnPolicy from '@/components/Dashboard/Views/website/ReturnPolicy.vue'
import ThemeSettings from '@/components/Dashboard/Views/website/ThemeSettings.vue'
import PaymentConfig from '@/components/Dashboard/Views/website/PaymentConfig.vue'
import Faq from '@/components/Dashboard/Views/website/FAQ.vue'
import FooterAdmin from '@/components/Dashboard/Views/website/FooterAdmin.vue'
import NavBarAdmin from '@/components/Dashboard/Views/website/NavBarAdmin.vue'


let loginPage = {
    path: '/',
    name: 'Login',
    component: Login
}
let waiter = {
    path: '/waiter',
    name: 'waiter',
    component: Waiter,
    beforeEnter: (to, from, next) => {
        User.auth().then((result) => {
            if (result) {
                // if (result.data.role_id == 1) {
                    next()
                // } else {
                //     return next({ name: 'dashboard' })
                // }
            } else {
                return next({ name: 'Login' })
            }
        }).catch((err) => {
            return next({ name: 'Login' })
        })
    },
}
let kitchen = {
    path: '/kitchen',
    name: 'kitchen',
    component: Kitchen,
    beforeEnter: (to, from, next) => {
        User.auth().then((result) => {
            if (result) {
                // if (result.data.role_id == 1) {
                    next()
                // } else {
                //     return next({ name: 'dashboard' })
                // }
            } else {
                return next({ name: 'Login' })
            }
        }).catch((err) => {
            return next({ name: 'Login' })
        })
    },
}
let prompt = {
    path: '/',
    name: 'prompt',
    component: DashboardLayout,
    beforeEnter: (to, from, next) => {
        User.auth().then((result) => {
            if (result) {
                // if (result.data.role_id == 1) {
                    next()
                // } else {
                //     return next({ name: 'dashboard' })
                // }
            } else {
                return next({ name: 'Login' })
            }
        }).catch((err) => {
            return next({ name: 'Login' })
        })
    },
    children: [{
        path: 'prompt',
        name: 'prompt',
        component: Prompt
    }],
}
let bar = {
    path: '/bar',
    name: 'bar',
    component: Bar,
    beforeEnter: (to, from, next) => {
        User.auth().then((result) => {
            if (result) {
                // if (result.data.role_id == 1) {
                    next()
                // } else {
                //     return next({ name: 'dashboard' })
                // }
            } else {
                return next({ name: 'Login' })
            }
        }).catch((err) => {
            return next({ name: 'Login' })
        })
    },
}
let receipt = {
    path: '/receipt',
    name: 'receipt',
    component: Receipt,
    beforeEnter: (to, from, next) => {
        User.auth().then((result) => {
            if (result) {
                // if (result.data.role_id == 1) {
                    next()
                // } else {
                //     return next({ name: 'dashboard' })
                // }
            } else {
                return next({ name: 'Login' })
            }
        }).catch((err) => {
            return next({ name: 'Login' })
        })
    },
}
let goodsRecivedNote = {
    path: '/goods-received-note',
    name: 'goods-received-note',
    component: GoodsRecievedNote,
    beforeEnter: (to, from, next) => {
        User.auth().then((result) => {
            if (result) {
                // if (result.data.role_id == 1) {
                    next()
                // } else {
                //     return next({ name: 'dashboard' })
                // }
            } else {
                return next({ name: 'Login' })
            }
        }).catch((err) => {
            return next({ name: 'Login' })
        })
    },
}
let invoice = {
    path: '/report/invoice',
    name: 'invoice',
    component: Invoice,
    beforeEnter: (to, from, next) => {
        User.auth().then((result) => {
            if (result) {
                // if (result.data.role_id == 1) {
                    next()
                // } else {
                //     return next({ name: 'dashboard' })
                // }
            } else {
                return next({ name: 'Login' })
            }
        }).catch((err) => {
            return next({ name: 'Login' })
        })
    },
}
let salesOrder = {
    path: '/report/sales-order',
    name: 'sales-order',
    component: SalesOrder,
    beforeEnter: (to, from, next) => {
        User.auth().then((result) => {
            if (result) {
                // if (result.data.role_id == 1) {
                    next()
                // } else {
                //     return next({ name: 'dashboard' })
                // }
            } else {
                return next({ name: 'Login' })
            }
        }).catch((err) => {
            return next({ name: 'Login' })
        })
    },
}

let reporprint = {
    path: '/report-print',
    name: 'print',
    component: ReportPrint,
    beforeEnter: (to, from, next) => {
        User.auth().then((result) => {
            if (result) {
                // if (result.data.role_id == 1) {
                    next()
                // } else {
                //     return next({ name: 'dashboard' })
                // }
            } else {
                return next({ name: 'Login' })
            }
        }).catch((err) => {
            return next({ name: 'Login' })
        })
    },
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
                // if (result.data.role_id == 1) {
                    next()
                // } else {
                //     return next({ name: 'dashboard' })
                // }
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

let roles = {
    path: "/",
    name: 'roles',
    component: DashboardLayout,
    beforeEnter: (to, from, next) => {
        User.auth().then((result) => {
            if (result) {
                // if (result.data.role_id == 1) {
                    next()
                // } else {
                //     return next({ name: 'dashboard' })
                // }
            } else {
                return next({ name: 'Login' })
            }
        }).catch((err) => {
            return next({ name: 'Login' })
        })
    },
    children: [{
        path: 'roles',
        name: 'all-roles',
        component: Role
    }]

}

let priviledges = {
    path: "/",
    name: 'priviledges',
    component: DashboardLayout,
    beforeEnter: (to, from, next) => {
        User.auth().then((result) => {
            if (result) {
                // if (result.data.role_id == 1) {
                    next()
                // } else {
                //     return next({ name: 'dashboard' })
                // }
            } else {
                return next({ name: 'Login' })
            }
        }).catch((err) => {
            return next({ name: 'Login' })
        })
    },
    children: [{
        path: 'priviledges',
        name: 'all-priviledges',
        component: Priviledges
    }]
}

let shops = {
    path: "/",
    name: 'shops',
    component: DashboardLayout,
    beforeEnter: (to, from, next) => {
        User.auth().then((result) => {
            if (result) {
                // if (result.data.role_id == 1) {
                    next()
                // } else {
                //     return next({ name: 'dashboard' })
                // }
            } else {
                return next({ name: 'Login' })
            }
        }).catch((err) => {
            return next({ name: 'Login' })
        })
    },
    children: [{
        path: 'shops',
        name: 'all-shops',
        component: Shops
    }]
}

let category = {
    path: '/category',
    name: 'Category',
    component: DashboardLayout,
    beforeEnter: (to, from, next) => {
        User.auth().then((result) => {
            if (result) {
                // if (result.data.role_id == 1) {
                    next()
                // } else {
                //     return next({ name: 'dashboard' })
                // }
            } else {
                return next({ name: 'Login' })
            }
        }).catch((err) => {
            return next({ name: 'Login' })
        })
    },
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
    beforeEnter: (to, from, next) => {
        User.auth().then((result) => {
            if (result) {
                // if (result.data.role_id == 1) {
                    next()
                // } else {
                //     return next({ name: 'dashboard' })
                // }
            } else {
                return next({ name: 'Login' })
            }
        }).catch((err) => {
            return next({ name: 'Login' })
        })
    },
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
        {
            path: 'transfer-products',
            name: 'transfer-products',
            component: ProductDistribution
        }
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
    beforeEnter: (to, from, next) => {
        User.auth().then((result) => {
            if (result) {
                // if (result.data.role_id == 1) {
                    next()
                // } else {
                //     return next({ name: 'dashboard' })
                // }
            } else {
                return next({ name: 'Login' })
            }
        }).catch((err) => {
            return next({ name: 'Login' })
        })
    },
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
    beforeEnter: (to, from, next) => {
        User.auth().then((result) => {
            if (result) {
                // if (result.data.role_id == 1) {
                    next()
                // } else {
                //     return next({ name: 'dashboard' })
                // }
            } else {
                return next({ name: 'Login' })
            }
        }).catch((err) => {
            return next({ name: 'Login' })
        })
    },
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
    beforeEnter: (to, from, next) => {
        User.auth().then((result) => {
            if (result) {
                // if (result.data.role_id == 1) {
                    next()
                // } else {
                //     return next({ name: 'dashboard' })
                // }
            } else {
                return next({ name: 'Login' })
            }
        }).catch((err) => {
            return next({ name: 'Login' })
        })
    },
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
    children: [
        {
            path: 'sales-orders',
            name: 'sales-orders',
            component: SaleOrder
        },
        {
            path: 'sales',
            name: 'sales_report',
            component: SalesReport
        },
        {
            path: 'general',
            name: 'general_report',
            component: GeneralReport
        },
        {
            path: 'statement',
            name: 'bank_statement',
            component: BankStatement
        },
        {
            path: 'logistics',
            name: 'logistics',
            component: Logistics
        }
    ]
}

let settings = {
    path: '/business',
    name: 'Settings',
    component: DashboardLayout,
    beforeEnter: (to, from, next) => {
        User.auth().then((result) => {
            if (result) {
                // if (result.data.role_id == 1) {
                    next()
                // } else {
                //     return next({ name: 'dashboard' })
                // }
            } else {
                return next({ name: 'Login' })
            }
        }).catch((err) => {
            return next({ name: 'Login' })
        })
    },
    children: [{
        path: 'settings',
        name: 'settings',
        component: Settings
    },
    {
        path: 'billing',
        name: 'billing',
        component: Subscribe
    },
    {
        path: 'customer-service',
        name: 'subscribe',
        component: CustomerService
    },{
        path: 'knowledge-base',
        name: 'knowledgebase',
        component: KnowledgeBase
    }]
}

let website = {
    path: '/website',
    name: 'website',
    component: DashboardLayout,
    beforeEnter: (to, from, next) => {
        User.auth().then((result) => {
            if (result) {
                // if (result.data.role_id == 1) {
                    next()
                // } else {
                //     return next({ name: 'dashboard' })
                // }
            } else {
                return next({ name: 'Login' })
            }
        }).catch((err) => {
            return next({ name: 'Login' })
        })
    },
    children: [
        {
            path: 'herobanner',
            name: 'manage',
            component: HeroBanner
        },
        {
            path: 'about',
            name: 'manage',
            component: About
        },
        {
            path: 'contact',
            name: 'manage',
            component: Contact
        },
        {
            path: 'return-policy',
            name: 'manage',
            component: ReturnPolicy
        },
        {
            path: 'themesettings',
            name: 'manage',
            component: ThemeSettings
        },
        {
            path: 'payment-config',
            name: 'manage',
            component: PaymentConfig
        },
        {
            path: 'faq',
            name: 'manage',
            component: Faq
        },
        {
            path: 'website-settings',
            name: 'manage',
            component: NavBarAdmin
        }
       
    ]
}

let backend = {
    path: '/backend',
    name: 'backend',
    component: DashboardLayout,
    beforeEnter: (to, from, next) => {
        User.auth().then((result) => {
            if (result) {
                // if (result.data.role_id == 1) {
                    next()
                // } else {
                //     return next({ name: 'dashboard' })
                // }
            } else {
                return next({ name: 'Login' })
            }
        }).catch((err) => {
            return next({ name: 'Login' })
        })
    },
    children: [{
        path: 'manage',
        name: 'manage',
        component: Backend
    },]
}

let budget = {
    path: '/budget',
    name: 'budget',
    component: DashboardLayout,
    beforeEnter: (to, from, next) => {
        User.auth().then((result) => {
            if (result) {
                // if (result.data.role_id == 1) {
                    next()
                // } else {
                //     return next({ name: 'dashboard' })
                // }
            } else {
                return next({ name: 'Login' })
            }
        }).catch((err) => {
            return next({ name: 'Login' })
        })
    },
    children: [{
        path: '/',
        name: 'budget',
        component: Budget
    },]
}


const routes = [
    loginPage,
    roles,
    budget,
    priviledges,
    user,
    backend,
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
    website,
    bar,
    goodsRecivedNote,
    reporprint,
    shops,
    lockPage,
    prompt,
    invoice,
    salesOrder,
    settings,
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