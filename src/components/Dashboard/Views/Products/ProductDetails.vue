<template>
  <div class="table-responsive"><br>
    <div class="card table-responsive">
      <div class="card-body">
        <h5 class="card-title">product details</h5>
        <table class="table" >
          <thead>
            <tr>
              <th></th>
              <th>name</th>
              <th>code</th>
              <th>category_id</th>
              <th>price</th>
              <th>stock</th>
              <th>Availability</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{product.id}}</td>
              <td>{{product.name}}</td>
              <td>{{product.code}}</td>
              <td>{{product.category.name}}</td>
              <td>{{product.price}}</td>
              <td>{{product.stock}}</td>
              <td v-if="product.stock < 1 && product.category_id ==2" class="bg-danger">Out of Stock</td>
              <td v-else class="bg-success">Available</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="card table-responsive">
      <div class="card-body">
        <h5 class="card-title">Periodic Report</h5>
        <form @submit.prevent="generateReport">
          <div class="form-group">
            <label for="my-input">Start Date</label>
            <input id="my-input" v-model="form.start_date" class="form-control" type="date" name="">
          </div>
          <div class="form-group">
            <label for="my-input">End Date</label>
            <input id="my-input" v-model="form.end_date" class="form-control" type="date" name="">
          </div>
            <button class="btn btn-info"><i class="fa fa-book" aria-hidden="true"></i></button>
        </form>
      </div>
    </div>

    <div class="card mr-3 table-responsive">
        <div class="card-body">
          <h5 class="card-title">Purchase Items</h5>
          <table id="purchase" class="table table-stripped">
            <thead>
              <tr>
                <th>Cost</th>
                <th>Qty</th>
                <th>Date</th>
                <th>Purchased By</th>
              </tr>
            </thead>
            <tbody :key="purchaseKey">
              <tr v-for="purchase in purchase_detail" :key="purchase.id">
                <td>
                  {{purchase.cost.toLocaleString()}}
                </td>
                <td>
                  {{purchase.qty.toLocaleString()}}
                </td>
                <td>
                  {{dateTime(purchase.created_at)}}
                </td>
                <td>
                  {{ purchase.fullname }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
    </div>
    <div class="card table-responsive">
        <div class="card-body">
          <h5 class="card-title">Sales History</h5>
          <table id="sales" class="table table-stripped">
            <thead>
              <tr>
                <th>Ref</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Sold By</th>
                <th>Date Sold</th>
              </tr>
            </thead>
            <tbody :key="salesKey">

              <tr v-for="sale in sales" :key="sale.id">
                <td>{{sale.ref}}</td>
                <td>{{sale.qty.toLocaleString()}}</td>
                <td>{{sale.price.toLocaleString()}}</td>
                <td>{{sale.fullname}}</td>
                <td>{{dateTime(sale.created_at)}}</td>
              </tr>
            </tbody>
          </table>
        </div>
    </div>
  </div>
</template>

<script>
import Product from '@/javascript/Api/Product';
import helpers from '@/javascript/helpers';
import Purchases from '@/javascript/Api/Purchases';
  export default{
    data(){
      return {
        purchase_detail:null,
        sales:null,
        product:null,
        purchaseKey:0,
        salesKey:0,
        form:{
          start_date:null,
          end_date:null
        }
      }
    },
    methods: {
      dateTime(date){
        return helpers.dateTime(date)
      },
      get_product(){
        Product.all_report(this.$route.params.id).then((result) => {
            this.product = result.data.data
            this.purchase_detail = result.data.data['purchases']
            this.sales = result.data.data['sales']
            this.datatable()
        })
      },
      generateReport(){
        Product.periodic_report(this.form, this.$route.params.id).then((result) => {
            this.product = result.data.data
            this.purchase_detail = result.data.data['purchases']
            this.sales = result.data.data['sales']
            this.purchaseKey++
            this.salesKey++
            this.datatable()
        })
      },
      datatable(){
        $(function() {
          $('.table').DataTable({
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
      datatable_purchase(){
        $(function() {
          $('#myPurchases').DataTable({
            dom: 'Bfrtip',
          buttons: ['excel', 'pdf', 'print'],
            "bDestroy": true,
                pageLength: 5,
                lengthMenu: [[5,10,20], [5, 10, 20]],
            });
        });
      },
      datatable_sales(){
        $(function() {
          $('#sales').DataTable({
            dom: 'Bfrtip',
          buttons: ['excel', 'pdf', 'print'],
            "bDestroy": true,
                pageLength: 5,
                lengthMenu: [[5,10,20], [5, 10, 20]],
            });
        });
      },
    },
    created(){
      this.get_product()
    }
  }
</script>
