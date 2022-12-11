<template>
  <div>
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Sales Report</h5>
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
        <div>
          <h4>total sales</h4>
          <h5>	&#8358; {{this.total.toLocaleString()}}</h5>
        </div>
        <table id="table" class="table table-striped">
          <thead>
            <tr>
              <th></th>
              <th>product</th>
              <th>qty</th>
              <th>price</th>
              <th>amount payable</th>
              <th>payment method</th>
              <th>status</th>
              <th>ref</th>
              <th>discount</th>
              <th>date</th>
              <th>Logged By</th>
            </tr>
          </thead>
          <tbody :key="tableKey">
            <tr v-for="(sale, index) in all_sales" :key="sale.id">
              <td>{{index+1}}</td>
              <td>{{sale.product.name}}</td>
              <td>{{sale.qty}}</td>
              <td>{{sale.price.toLocaleString()}}</td>
              <td>{{(sale.price * sale.qty).toLocaleString()}}</td>
              <td>{{sale.payment_method}}</td>
              <td>{{sale.status}}</td>
              <td>{{sale.ref}}</td>
              <td>{{sale.discount}}</td>
              <td>{{dateTime(sale.created_at)}}</td>
              <td>{{sale.user.fullname}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>
<script>
import { Button, Modal } from '@/components/UIComponents'
import Sales from '@/javascript/Api/Sales'
import helpers from '@/javascript/helpers'
  export default{
    components: {
      Modal
    },
    data() {
      return {
        form:{start_date:null, end_date:null, platform:'all'},
        all_sales:null,
        tableKey:0,
        total:0
      }
    },
    methods: {
      sales(){
        Sales.periodic_report(this.form).then((result) => {
          this.all_sales = result.data.data
          this.tableKey++
          this.datatable()
          this.calculateTotal()
        })
      },
      calculateTotal(){
        var total = 0
        for (let index = 0; index < this.all_sales.length; index++) {
          total = total + this.all_sales[index].price * this.all_sales[index].qty
        }
        this.total = total
      },
      dateTime(date){
        return helpers.dateTime(date)
      },
      datatable(){
        $(function() {
          $('#table').DataTable({
            "bDestroy": true,
                pageLength: 5,
                lengthMenu: [[5,10,20], [5, 10, 20]],
            });
        });
      },
    },
    created() {
      this.datatable()
    },
  }
</script>

