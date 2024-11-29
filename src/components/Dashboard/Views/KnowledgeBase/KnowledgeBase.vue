<template>
    <div><br>
      <h4>Frequently Asked Questions</h4>
      <div class="row">
        <!-- <div class="md-3"> -->
  
      <nav class="nav  flex-column flex-sm-row ml-2 col-12 col-sm-6 col-md-8 col-lg-12 mb-4">
        <a class="flex-sm-fill btn btn-secondary text-sm-center mr-1" aria-current="page" @click="currentTab = 'product_management'">Product Managment</a>
        <a class="flex-sm-fill  btn btn-secondarytext-sm-center mr-1 "  @click="currentTab = 'staff_management'">User Managment</a>
        <a class="flex-sm-fill  btn btn-secondarytext-sm-center mr-1 "  @click="currentTab = 'customer_management'">Customer Managment</a>
        <a class="flex-sm-fill  btn btn-secondarytext-sm-center mr-1 "  @click="currentTab = 'expenditure_management'">Expenditure Managment</a>
        <a class="flex-sm-fill  btn btn-secondarytext-sm-center mr-1 "  @click="currentTab = 'sales_management'">Sales Point</a>
        <a class="flex-sm-fill  btn btn-secondarytext-sm-center mr-1 "  @click="currentTab = 'subscription_management'">Subscription</a>
        <a class="flex-sm-fill  btn btn-secondarytext-sm-center mr-1 "  @click="currentTab = 'reports'">Reports</a>
        <a class="flex-sm-fill  btn btn-secondarytext-sm-center mr-1 "  @click="currentTab = 'accounting_education'">Basic Accounting Education</a>
      </nav>
    </div>

    <div v-if="currentTab == 'product_management'">
      <ProductManagement />
    </div>
    <div v-if="currentTab == 'staff_management'">
      <StaffManagement />
    </div>
    <div v-if="currentTab == 'customer_management'">
      <CustomerManagement />
    </div>
    <div v-if="currentTab == 'expenditure_management'">
      <ExpenditureManagement />
    </div>
    <div v-if="currentTab == 'sales_management'">
      <SalesManagement />
    </div>
    <div v-if="currentTab == 'subscription_management'">
      <SubscriptionManagement />
    </div>
    <div v-if="currentTab == 'reports'">
      <Report />
    </div>
    <div v-if="currentTab == 'accounting_education'">
      <Accounting />
    </div>

     
    </div>
  </template>
  <script>
  import ProductManagement from './ProductManagement.vue';
  import SalesManagement from './SalesManagement.vue';
  import CustomerManagement from './CustomerManagement.vue';
  import ExpenditureManagement from './ExpenditureManagement.vue';
  import StaffManagement from './StaffManagement.vue';
  import SubscriptionManagement from './SubscriptionManagement.vue';
  import Report from './Report.vue';
  import Accounting from './Accounting.vue';
  
  export default {
    components: {
      ProductManagement,
      SalesManagement,
      CustomerManagement,
      ExpenditureManagement,
      StaffManagement,
      SubscriptionManagement, 
      Accounting, Report
    },
    data() {
      return {
        rows: {
          products: [
            {
              name: null,
              category_id: null,
              stock: 0,
              price: null,
              code: null,
            },
          ],
        },
        currentTab: 'product_management',
        loading: false,
        categories: null,
        details: null,
        packages: null,
        business: null,
        code: null,
      };
    },
  };
  </script>
  