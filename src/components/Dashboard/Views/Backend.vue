<template>
    <div><br>
      <h4>Backend Management</h4>
      <div class="row">
        <!-- <div class="md-3"> -->
  
      <nav class="nav  flex-column flex-sm-row ml-2 col-12 col-sm-6 col-md-8 col-lg-12 mb-4">
        <a class="flex-sm-fill btn btn-secondary text-sm-center mr-1" aria-current="page" @click="currentTab = 'product_management'">Product Managment</a>
        <a class="flex-sm-fill  btn btn-secondarytext-sm-center mr-1 "  @click="currentTab = 'staff_management'">Staff Managment</a>
        <a class="flex-sm-fill  btn btn-secondarytext-sm-center mr-1 "  @click="currentTab = 'customer_management'">Customer Managment</a>
        <a class="flex-sm-fill  btn btn-secondarytext-sm-center mr-1 "  @click="currentTab = 'purchase_management'">Purchases Managment</a>
        <a class="flex-sm-fill  btn btn-secondarytext-sm-center mr-1 "  @click="currentTab = 'expenditure_management'">Expenditure Managment</a>
        <a class="flex-sm-fill  btn btn-secondarytext-sm-center mr-1 "  @click="currentTab = 'sales_management'">Sales Management</a>
      </nav>
    </div>

    <div :key="currentTab">
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
    <div v-if="currentTab == 'purchase_management'">
      <PurchaseManagement />
    </div>
    </div>

    

     
    </div>
  </template>
  <script>
  import ProductManagement from './Backend/Product.vue';
  import SalesManagement from './Backend/Sales.vue';
  import CustomerManagement from './Backend/Customer.vue';
  import ExpenditureManagement from './Backend/Expenditure.vue';
  import StaffManagement from './Backend/Staff.vue';
  import PurchaseManagement from './Backend/Purchases.vue';

  
  export default {
    components: {
        ProductManagement,
        SalesManagement,
        CustomerManagement,
        ExpenditureManagement,
        StaffManagement,
        PurchaseManagement,
    },
    data() {
      return {
        rows: {
          products: [
            {
              name: null,
              contentKey:null,
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
  