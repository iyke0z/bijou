<template>
  <div><br>
    <span class="loader" v-if="loading"></span>
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">User Details</h5>
        <section class="row">
          <section class="col-6">
              <div class="form-group">
                <label for="">Fullname</label>
                <input type="text" class="form-control" readonly v-model="user.fullname" required>
              </div>
              <div class="form-group">
                <label for="">Email</label>
                <input type="text" class="form-control" readonly v-model="user.email" required>
              </div>
              <div class="form-group">
                <label for="">Phone</label>
                <input type="text" class="form-control" readonly v-model="user.phone" required>
              </div>
              <div class="form-group">
                <label for="">Address</label>
                <input type="text" class="form-control" readonly v-model="user.address" required>
              </div>
            </section>
            <section class="col-6">
              <div class="form-group">
                <label for="">Role</label>
                <input type="text" class="form-control" readonly v-model="user.role.name" required>
              </div>
              <div class="form-group">
                <label for="">Gender</label>
                <input type="text" class="form-control" readonly v-model="user.gender" required>
              </div>
              <div class="form-group">
                <label for="">Date of Birth</label>
                <input type="text" class="form-control" readonly v-model="user.dob" required>
              </div>
          </section>
        </section>
      </div>
    </div>

    <!-- <section class="row"> -->
      <div class="card col-12  mr-3">
        <div class="card-body">
          <h5 class="card-title">Access Log</h5>
          <table id="myTable" class="table table-stripped">
            <thead>
              <tr>
                <th>Id</th>
                <th>Action</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in user.access_log" :key="log.id">
                <td>{{log.id}}</td>
                <td>{{log.action}}</td>
                <td>{{dateTime(log.created_at)}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card col-12">
        <div class="card-body">
          <h5 class="card-title">Priviledges</h5>
          <table id="priviledges" class="table table-stripped">
            <thead>
              <tr>
                <th>Id</th>
                <th>Priviledge</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(access, index) in user.user_priviledges" :key="access.id">
                <td>{{index+1}}</td>
                <td>{{access.name}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    <!-- </section> -->

    <!-- <section class="row"> -->
      <div class="card col-12 mr-3">
        <div class="card-body">
          <h5 class="card-title">Purchase History</h5>
          <table id="myPurchases" class="table table-stripped">
            <thead>
              <tr>
                <th>Purchase Id</th>
                <th>Price</th>
                <th>Added Costs</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="purchase in user.purchase" :key="purchase.id">
                <td>{{purchase.id}}</td>
                <td>{{purchase.price?.toLocaleString()}}</td>
                <td>{{purchase.added_costs?.toLocaleString()}}</td>
                <td>
                  <button @click="purchase_detail(purchase.id)" class="btn btn-info">
                    <i class="fa fa-search" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card col-12">
        <div class="card-body">
          <h5 class="card-title">Purchase Items</h5>
          <table id="purchase" class="table table-stripped">
            <thead>
              <tr>
                <th>Product</th>
                <th>Cost</th>
                <th>Qty</th>
                <th>Date</th>
              </tr>
            </thead>
            <!-- {{ purchase_details[0]['purchase_detail']}} -->
            <tbody>
              <tr v-for="purchase in purchase_details" :key="purchase.id">
                <td >
                  {{purchase.name}}
                </td>
                <td>
                  {{purchase.cost.toLocaleString()}}
                </td>
                <td>
                  {{purchase.qty.toLocaleString()}}
                </td>
                <td>
                  {{dateTime(purchase.created_at)}}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    <!-- </section> -->
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Sales History</h5>
        <table id="sales" class="table table-stripped">
          <thead>
            <tr>
              <th>Ref</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Date</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in user.sales" :key="sale.id">
              <td>{{sale.ref}}</td>
              <td>{{sale.name}}</td>
              <td>{{sale.qty.toLocaleString()}}</td>
              <td>{{ dateTime(sale.created_at) }}</td>
              <td>{{sale.price.toLocaleString()}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <h5 class="card-title text-center">
          Sales Report <br /> 
          from {{ dateTime(form.start_date) }} - {{ dateTime(form.end_date) }}
        </h5>
        
        <!-- Filters -->
        <h6>Filter</h6>
        <form @submit.prevent="sales" class="grid gap-4 sm:grid-cols-2">
          <div class="form-group">
            <label for="">Start Date</label>
            <input 
              type="datetime-local" 
              v-model="form.start_date" 
              class="form-control" 
              required />
          </div>
          <div class="form-group">
            <label for="">End Date</label>
            <input 
              type="datetime-local" 
              v-model="form.end_date" 
              class="form-control" 
              required />
          </div>
          <div class="form-group">
            <label for="">Platform</label>
            <select 
              v-model="form.platform" 
              class="form-control">
              <option value="all">All</option>
              <option value="offline">Offline</option>
              <option value="online">Online</option>
            </select>
          </div>
          <button class="btn btn-success sm:col-span-2" type="submit">Generate <span v-if="loading" class="loader"></span></button>
        </form>

        <!-- Sales Tables -->
        <div v-if="all_sales" class="mt-4">
          <h5 class="mb-2">Sales Summary</h5>
          <div class="table-responsive">
            <table class="table table-striped w-full">
              <thead>
                <tr>
                  <th>Expected Amount</th>
                  <th>Paid Amount</th>
                  <th>Cash Transactions</th>
                  <th>Transfer Transactions</th>
                  <th>Card Transactions</th>
                  <th>Split Transactions</th>
                  <th>Split Cash</th>
                  <th>Split Transfer</th>
                  <th>Split Card</th>
                  <th>Complementary</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ all_sales.expected_amount.toLocaleString() }}</td>
                  <td>{{ all_sales.paid_amount.toLocaleString() }}</td>
                  <td>{{ all_sales.cash.toLocaleString() }}</td>
                  <td>{{ all_sales.transfer.toLocaleString() }}</td>
                  <td>{{ all_sales.card.toLocaleString() }}</td>
                  <td>{{ all_sales.split_payments.toLocaleString() }}</td>
                  <td>{{ all_sales.split_payments_cash.toLocaleString() }}</td>
                  <td>{{ all_sales.split_payments_transfer.toLocaleString() }}</td>
                  <td>{{ all_sales.split_payments_card.toLocaleString() }}</td>
                  <td>{{ all_sales.complementary.toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Other Tables (Reusable)
        <div v-for="(table, tableTitle) in dynamicTables" :key="tableTitle" v-if="table.data.length" class="mt-4">
          <h5 class="mb-2">{{ table.title }}</h5>
          <div class="table-responsive">
            <table class="table table-striped w-full">
              <thead>
                <tr>
                  <th v-for="header in table.headers" :key="header">{{ header }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in table.data" :key="row.id">
                  <td v-for="value in row" :key="value">{{ value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div> -->
      </div>
    </div>
    
  </div>
</template>

<script>
import User from '@/javascript/Api/User';
import helpers from '@/javascript/helpers';
import Purchases from '@/javascript/Api/Purchases';
  export default{
    data(){
      return {
        user:null,
        purchase_details:[],
        purchaseid:null,
        form:{start_date:null, end_date:null, platform:'all', user_id:null},
        all_sales:null,
        tableKey:0,
        oustanding: [],
        void_items: [],
        sold_items: [],
        loading: false
      }
    },
    methods: {
      printReceipt() {
      this.$router.push('/report-print')
    },

    dateTime(data) {
      return helpers.dateTime(data)
    },
    
    sales() {
      this.loading = true;
      User.generate_user_report(this.form, this.$route.params.id).then((result) => {
        this.all_sales = result.data.data
        var res = []
        res.push(result.data.data)

        var outstanding = []
        var void_items = []
        var sold_items = []

        for (let index = 0; index < res.length; index++) {
          if (res[index].oustanding.length > 0) {
            outstanding.push(res[index].oustanding)
          }
          if (res[index].void_items.length > 0) {
            void_items.push(res[index].void_items)
          }
          if (res[index].sold_items.length > 0) {
            sold_items.push(res[index].sold_items)
          }
        }
        this.getOutstanding(outstanding)
        this.getVoidItems(void_items)
        this.getSoldItems(sold_items)

        this.tableKey++
        localStorage.setItem('sales', JSON.stringify(result.data.data))
        localStorage.setItem('form', JSON.stringify(this.form))

        this.datatable()
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    getVoidItems(data) {
      this.void_items = []
      if (data.length > 0) {
        data[0].forEach(element => {
          element.sales.forEach(sale => {
            this.void_items.push({
              product: sale.product.name,
              quantity: sale.qty,
              price: (sale.price * 0.075) + sale.price,
              waiter: element.user.fullname,
              ref: element.id
            })
          })
        });
      }
      localStorage.setItem('void_items', JSON.stringify(this.void_items))
      this.voided_table()
    },
    getOutstanding(data) {
      this.oustanding = []
      if (data.length > 0) {
        data[0].forEach(element => {
          element.sales.forEach(sale => {
            this.oustanding.push({
              product: sale.product.name,
              quantity: sale.qty,
              price: (sale.price * 0.075) + sale.price,
              ref: element.id,
              waiter: element.user.fullname
            })
          })
        });
      }
      localStorage.setItem('outstanding', JSON.stringify(this.oustanding))
      this.outstanding_table()
    },
    getSoldItems(data) {
      this.sold_items = []
      if (data.length > 0) {
        data[0].forEach(element => {
          element.sales.forEach(sale => {
            this.sold_items.push({
              product: sale.product.name,
              quantity: sale.qty,
              price: (sale.price * 0.075) + sale.price,
              ref: element.id,
              waiter: element.user.fullname
            })
          })
        });
      }
      localStorage.setItem('sold_items', JSON.stringify(this.oustanding))
      this.sold_table()
    },
      // 
      dateTime(date){
        return helpers.dateTime(date)
      },
      get_user(){
        User.details(this.$route.params.id).then((result) => {
            this.user = result.data.data
            this.datatable()
            this.datatable_purchase()
            this.datatable_sales()
            this.datatable_priviledges()
        })
      },
      datatable(){
        $(function() {
          $('#myTable').DataTable({
            "bDestroy": true,
                pageLength: 5,
                lengthMenu: [[5,10,20], [5, 10, 20]],
            });
        });
      },
      datatable_purchase(){
        $(function() {
          $('#myPurchases').DataTable({
            "bDestroy": true,
                pageLength: 5,
                lengthMenu: [[5,10,20], [5, 10, 20]],
            });
        });
      },
      datatable_sales(){
        $(function() {
          $('#sales').DataTable({
            "bDestroy": true,
                pageLength: 5,
                lengthMenu: [[5,10,20], [5, 10, 20]],
            });
        });
      },
      datatable_priviledges(){
        $(function() {
          $('#priviledges').DataTable({
            "bDestroy": true,
                pageLength: 5,
                lengthMenu: [[5,10,20], [5, 10, 20]],
            });
        });
      },

      purchase_detail(id){
        this.purchaseid = id
        Purchases.purchases().then((result) => {
          var res  = result.data.data
          for (let index = 0; index < res.length; index++) {
            if(res[0].id == id){
              this.purchase_details = res[index]['purchase_detail']
            }
          }
          $(function() {
            $('#purchase').DataTable({
              "bDestroy": true,
                  pageLength: 5,
                  lengthMenu: [[5,10,20], [5, 10, 20]],
              });
          });
        })
      }


    },
    created(){
      this.get_user()
    }
  }
</script>
