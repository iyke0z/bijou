<template>
  <div class="table-responsive">
    <p-button type="success" size="lg" icon @click.native="createPurchaseRoute()">
      Add New
    </p-button>
    <div>
      <span class="loader" v-if="loading"></span>
    </div>
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Purchases</h5>
        <h6>Filter</h6>
        <form action="" @submit.prevent="filter">
          <div class="form-group">
            <label for="">Start Date</label>
          <input type="date" v-model="form.start_date" class="form-control col-6"  required>
          </div>
          <div class="form-group">
            <label for="">End Date</label>
            <input type="date" v-model="form.end_date" class="form-control col-6" required>
          </div>
          <button class="btn btn-success" type="submit">Fiter</button>
        </form>
        <div class="table-responsive">
          <table id="table" class="table table-striped">
          <thead>
            <tr>
              <th></th>
              <th>price</th>
              <th>added costs</th>
              <th>date</th>
              <th>Logged By</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody :key="tableKey">
            <tr v-for="(purchase, index) in all_purchases" :key="purchase.id">
              <td>{{index+1}}</td>
              <td>{{purchase.price.toLocaleString()}}</td>
              <td>{{purchase.added_costs.toLocaleString()}}</td>
              <td>{{dateTime(purchase.created_at)}}</td>
              <td>{{purchase.user.fullname}}</td>
              <td>
                <!-- <p-button class="mr-2" title="details" type="warning" size="sm" icon @click.prevent="goToRoute(purchase)">
                  <i class="fa fa-eye"></i>
                </p-button> -->
                <p-button class="mr-2" title="update" type="info" size="sm" icon @click.native="goToRoute(purchase)">
                  <i class="fa fa-edit"></i>
                </p-button>
                <p-button class="mr-2" title="delete" type="danger" size="sm" icon @click.prevent="delete_purchase(purchase)">
                  <i class="fa fa-trash"></i>
                </p-button>
                <p-button class="mr-2" title="details" type="primary" size="sm" icon @click="purchase_detail(purchase.id)">
                  <i class="fa fa-search" aria-hidden="true"></i>
                </p-button>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
       
      </div>
    </div>
    <div class="card col-12 mr-3">
      <div class="card-body table-responsive">
        <h5 class="card-title">Purchase Items</h5>
        <table id="purchase" class="table table-stripped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Cost</th>
              <th>Qty</th>
              <!-- <th>Action</th> -->
            </tr>
          </thead>
          <tbody :key="purchaseKey">
            <tr v-for="purchase in purchase_details" :key="purchase.id">
              <td>
                {{ purchase.product.name}}
              </td>
              <td>
                {{purchase.cost.toLocaleString()}}
              </td>
              <td>
                {{purchase.qty.toLocaleString()}}
              </td>
              <!-- <td>
                <p-button class="mr-2" title="delete" type="danger" size="sm" icon @click.prevent="delete_purchase_detail(purchase)">
                  <i class="fa fa-trash"></i>
                </p-button>
              </td> -->
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>
<script>
import { Button, Modal } from '@/components/UIComponents'
import Category from '@/javascript/Api/Categories'
import Purchases from '@/javascript/Api/Purchases'
import Swal from 'sweetalert2'
import helpers from '@/javascript/helpers'
  export default{
    components: {
      Modal
    },
    data() {
      return {
        updateMode:false,
        tableKey:0,
        purchaseKey:0,
        rowCount:1,
        category:null,
        form:{start_date:null, end_date:null},
        modals: {
          classic: false,
          notice: false,
          mini: false
        },
        loading: false,
        purchase_details:null,
        all_purchases: null,
        modalTitle:null,
        modalAction:null,
        modalContent:null,
      }
    },
    methods: {
      openModal(type, title, action, category){
        this.modalTitle = title
        this.modals[type] = true
        this.modalAction = action
        if(action == 'update'){
          this.updateMode = true
          this.category = category.id
          this.form = {name:category.name}
        }
      },
      createPurchaseRoute(){
        this.$router.push('/purchase/create')
      },
      goToRoute(purchase){
        this.$router.push('/purchase/update/'+purchase.id)
      },
      delete_purchase(purchase){
        this.loading = true
        Purchases.delete_purchase(purchase.id).then((result) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.allpurchases()
          this.purchase_details = null
          this.loading = false
        }).catch((err) => {
          this.loading = false
         Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: err?.response?.data?.error ?? err.response.data.message,
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000
            })
        });
      },
      allpurchases(){
        Purchases.purchases().then((result) => {
            this.all_purchases = result.data.data
            this.tableKey++
            this.datatable()
        })
      },
      datatable(){
        $(function() {
          $('#table').DataTable({
            dom: 'Bfrtip',
            buttons: ['excel', 'pdf', 'print'],
            "bDestroy": true,
                pageLength: 5,
                lengthMenu: [[5,10,20], [5, 10, 20]],
            });
        });
      },
      dateTime(date){
        return helpers.dateTime(date)
      },
      filter(){
        Purchases.report(this.form).then((result) => {
          this.all_purchases = result.data.data
            this.tableKey++
            this.datatable()
        })
      },
      delete_purchase_detail(purchase){
        Purchases.delete_details(purchase.id).then((result) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.purchase_detail(purchase.purchase_id)
        }).catch((err) => {
         Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: err?.response?.data?.error ?? err.response.data.message,
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000
            })
        });
      },
      purchase_detail(id){
        for (let index = 0; index < this.all_purchases.length; index++) {
          if(this.all_purchases[index].id == id){
            this.purchase_details = this.all_purchases[index]['purchase_detail']
          }
        }
        this.purchaseKey++
        $(function() {
          $('#purchase').DataTable({
            "bDestroy": true,
                pageLength: 5,
                lengthMenu: [[5,10,20], [5, 10, 20]],
            });
        });
      },
        api_refresh(){
            this.allpurchases()
        },
    },
    created(){
      this.allpurchases()
    }

  }
</script>

