<template>
  <div class="container-fluid"><br>
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">General Report</h5>
        <div class="row">
          <!-- Generate Report Section -->
          <div class="col-12 col-md-4 mb-3">
            <h6>Generate Report</h6>
            <form @submit.prevent="filter">
              <div class="form-group">
                <label for="start-date">Start Date</label>
                <input 
                  type="datetime-local" 
                  id="start-date" 
                  v-model="form.start_date" 
                  class="form-control w-100" 
                  required>
              </div>
              <div class="form-group">
                <label for="end-date">End Date</label>
                <input 
                  type="datetime-local" 
                  id="end-date" 
                  v-model="form.end_date" 
                  class="form-control w-100" 
                  required>
              </div>
              <div class="form-group">
                <label for="platform">Platform</label>
                <select 
                  id="platform" 
                  v-model="form.platform" 
                  class="form-control w-100" 
                  required>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="all">All</option>
                </select>
              </div>
              <button class="btn btn-success btn-block" type="submit">
                Generate 
              </button>
            </form>
          </div>

          <!-- Summary Report Section -->
          <div class="col-12 col-md-4 mb-3">
            <h6>Summary Report from <br> {{ form.start_date }} - {{ form.end_date }}</h6>
            <table class="table table-bordered table-sm">
              <tr>
                <td>Total Purchases</td>
                <td>&#8358; {{ totalcost.toLocaleString() }}</td>
              </tr>
              <tr>
                <td>Total Expenditure</td>
                <td>&#8358; {{ totalexp.toLocaleString() }}</td>
              </tr>
              <tr>
                <td>Total Sales</td>
                <td>&#8358; {{ totalsales.toLocaleString() }}</td>
              </tr>
              <!-- <tr>
                <td>Profit</td>
                <td>&#8358; {{ profit.toLocaleString() }}</td>
              </tr> -->
            </table>
          </div>

          <!-- Product Trend Section -->
          <div class="col-12 col-md-4 mb-3">
            <h6>Product Trend</h6>
            <div class="table-responsive">
              <table id="trendtable" class="table table-bordered table-sm">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Count</th>
                    <th>Current Stock</th>
                  </tr>
                </thead>
                <tbody :key="trendKey">
                  <tr v-for="product in productTrend" :key="product.id">
                    <td>{{ product.name }}</td>
                    <td>{{ product.count }}</td>
                    <td>{{ product.stock }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Transactions Table -->
        <div class="table-responsive">
          <table id="table" class="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Ref No</th>
                <th>Transaction Type</th>
                <th>Transaction Status</th>
                <th>Payment Method</th>
                <th>Amount</th>
                <th>Customer</th>
                <th>Waiter</th>
                <th>Date</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody :key="tableKey">
              <tr v-for="transaction in transactions" :key="transaction.id">
                <td>{{ String(transaction.id).padStart(9, '0') }}</td>
                <td>{{ transaction.type ?? "Awaiting staff closing transaction" }}</td>
                <td>{{ transaction.status }}</td>
                <td>{{ transaction.payment_method ?? "--" }}</td>
                <td>{{ transaction.amount.toLocaleString() }}</td>
                <td>{{ transaction.customer?.fullname ?? "N/A" }}</td>
                <td>{{ transaction.user.fullname }}</td>
                <td>{{ dateTime(transaction.created_at) }}</td>
                <td>{{ transaction.table_description }}</td>
                <td>
                  <button @click.prevent="details(transaction.id)" class="btn btn-info btn-sm">
                    <i class="fa fa-eye"></i>
                  </button>
                  <button @click.prevent="deleteSale(transaction.id)" class="btn btn-danger btn-sm">
                    <i class="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="card col-12 mr-3 table-responsive">
      <div class="card-body">
        <h5 class="card-title">Sales Details</h5>
        <table id="purchase" class="table table-stripped">
          <thead>
            <tr>
              <th></th>
              <th>product</th>
              <th>qty</th>
              <th>price</th>
              <th>amount payable</th>
              <th>status</th>
              <th>ref</th>
              <th>discount</th>
            </tr>
          </thead>
          <tbody :key="detailsKey">
            <tr v-for="(sale, index) in sales_details" :key="sale.id">
              <td>{{index+1}}</td>
              <td>{{sale.name}}</td>
              <td>{{sale.qty}}</td>
              <td>{{sale.price.toLocaleString()}}</td>
              <td>{{(sale.price * sale.qty).toLocaleString()}}</td>
              <td>{{sale.status}}</td>
              <td>{{sale.ref}}</td>
              <td>{{sale.discount}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { Button, Modal } from '@/components/UIComponents'
import Purchases from '@/javascript/Api/Purchases'
import Report from '@/javascript/Api/Reports'
import helpers from '@/javascript/helpers'
import Sales from '@/javascript/Api/Sales'
  export default{
    components: {
      Modal
    },
    data() {
      return {
        form:{start_date:null, end_date:null, platform:"all"},
        transactions:null,
        purchases:null,
        expenditures: null,
        sales_details:null,
        tableKey:0,
        detailsKey:0,
        profit:0,
        sales:null,
        totalcost:0,
        totalexp:0,
        totalsales:0,
        productTrend:null,
        trendKey:0,
        loading: false


      }
    },
    methods: {
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
      datatableTrend(){
        $(function() {
          $('#trendtable').DataTable({
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
        this.loading = true
        Report.general_report(this.form).then((result) => {
          this.transactions = result.data.data['transaction']
          this.sales = result.data.data['sales']
          this.expenditures = result.data.data['expenditures']
            this.tableKey++
            this.datatable()
            this.getSummary()
        })
        this.loading = false
      },
      getProductTrend(){
        let product = []
        this.sales.forEach(element => {
          if(product.length > 0){
            var getProduct = product.map(function(x) {return x.id; }).indexOf(element.product_id);
            if(getProduct >= 0){
              product[getProduct].count++
            }else{
              product.push({
                id:element.product_id,
                name:element.product.name,
                count:1,
                stock:element.product.stock
              })
            }
          }else{
              product.push({
                id:element.product_id,
                name:element.product.name,
                count:1,
                stock:element.product.stock
              })
            }
        });
        this.productTrend = product
        this.datatableTrend()
        this.trendKey++

      },
      details(id){
        for (let index = 0; index < this.transactions.length; index++) {
          this.transactions[index].sales.forEach( element => {
            if(element['ref'] == id){
              this.sales_details = this.transactions[index].sales
              this.detailsKey++
            }
          })
        }
      },

      getSummary(){
        // getCost
        this.loading = true
        Purchases.purchases().then((result) => {
          this.loading = false
          var totalsales = 0
          var totalcost = 0
          var expenditure = 0
          this.purchases = result.data.data
          for (let index = 0; index < this.sales.length; index++) {
            this.purchases.forEach(element => {

              element.purchase_detail.forEach(item => {
                if(item.product_id == this.sales[index].product_id){
                  totalcost = totalcost + item.cost
                }
              })
            });
          }
          // getExpenditure
          this.expenditures.forEach(element => {
            expenditure = expenditure + element.amount
          });
          // getTotalSales
          this.transactions.forEach(element => {
            totalsales = totalsales + element.amount
          })
          var profit = totalsales - (totalcost + expenditure)
          this.profit = profit
          this.totalcost = totalcost
          this.totalexp = expenditure
          this.totalsales = totalsales

          this.getProductTrend()
        }).catch(() => {
          this.loading = false
        })
      },

      deleteSale(id){
        Sales.cancel_sale({ref:id}).then((result) => {
          this.filter()
          this.sales_details = null
        })
      }



    },
    created(){
      this.datatable()
      this.datatableTrend()
    }

  }
</script>

