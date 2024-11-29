<template>
  <div><br>
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
                <td>{{purchase.price.toLocaleString()}}</td>
                <td>{{purchase.added_costs.toLocaleString()}}</td>
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
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in user.sales" :key="sale.id">
              <td>{{sale.ref}}</td>
              <td>{{sale.name}}</td>
              <td>{{sale.qty.toLocaleString()}}</td>
              <td>{{sale.price.toLocaleString()}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Sales Report <br/> from {{form.start_date}} - {{form.end_date}}</h5>
        <h6>Filter</h6>
        <form action="" @submit.prevent="sales">
          <div class="form-group">
            <label for="">Start Date</label>
          <input type="date" v-model="form.start_date" class="form-control col-6"  required>
          </div>
          <div class="form-group">
            <label for="">End Date</label>
            <input type="date" v-model="form.end_date" class="form-control col-6" required>
          </div>
          <div class="form-group">
            <label for="">Platform</label>
            <select name="" id="" v-model="form.platform" class="form-control col-6">
              <option value="all">All</option>
              <option value="offline">Offline</option>
              <option value="online">Online</option>
            </select>
          </div>
          <button class="btn btn-success" type="submit">Generate</button>
        </form>

        <table id="table" class="table-responsive table-striped" v-if="all_sales != null">
          <thead>
            <tr>
              <th>EXPECTED AMOUNT</th>
              <th>PAID AMOUNT</th>
              <th>CASH TRANSACTIONS</th>
              <th>TRANSFER TRANSACTIONS</th>
              <th>CARD TRANSACTIONS</th>
              <th>SPLIT TRANSACTIONS</th>
              <th>SPLIT CASH TRANSACTIONS</th>
              <th>SPLIT TRANSFER TRANSACTIONS</th>
              <th>SPLIT CARD TRANSACTIONS</th>
              <th>COMPLEMENTARY TRANSACTIONS</th>
            </tr>
          </thead>
          <tbody :key="tableKey">
            <tr>
              <td>{{all_sales.expected_amount.toLocaleString()}}</td>
              <td>{{all_sales.paid_amount.toLocaleString()}}</td>
              <td>{{all_sales.cash.toLocaleString()}}</td>
              <td>{{all_sales.transfer.toLocaleString()}}</td>
              <td>{{all_sales.card.toLocaleString()}}</td>
              <td>{{all_sales.split_payments.toLocaleString()}}</td>
              <td>{{all_sales.split_payments_cash.toLocaleString()}}</td>
              <td>{{all_sales.split_payments_transfer.toLocaleString()}}</td>
              <td>{{all_sales.split_payments_card.toLocaleString()}}</td>
              <td>{{all_sales.complementary.toLocaleString()}}</td>
            </tr>
          </tbody>
        </table>
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
      }
    },
    methods: {
      sales(){
        this.all_sales = null
        this.form.user_id = this.$route.params.id
        User.user_repot(this.form).then((result) => {
          this.all_sales = result.data.data
          this.tableKey++
        })
      },
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
