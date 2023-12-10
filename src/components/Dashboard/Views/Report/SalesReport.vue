<template>
  <div>
    <div class="card">
      <center>
        <button @click="printReceipt" v-show="all_sales != null" class="btn btn-dark">
          <i class="fa fa-print    "></i>
        </button>
      </center>
      <div class="card-body">
        <h5 class="card-title">Sales Report <br/> from {{form.start_date}} - {{form.end_date}}</h5>
        <h6>Filter</h6>
        <form action="" @submit.prevent="sales">
          <div class="form-group">
            <label for="">Start Date</label>
          <input type="datetime-local" v-model="form.start_date" class="form-control col-6"  required>
          </div>
          <div class="form-group">
            <label for="">End Date</label>
            <input type="datetime-local" v-model="form.end_date" class="form-control col-6" required>
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
        <table id="table" class="table table-striped" v-if="all_sales != null">
          <thead>
            <tr>
              <th>BANK NAME</th>
              <th>AMOUNT</th>
            </tr>
          </thead>
          <tbody :key="tableKey">
            <tr v-for="(bank, index) in all_sales.banks" :key="bank.id">
              <td>{{bank.bank_name}}</td>
              <td>{{bank.amount.toLocaleString()}}</td>
            </tr>
          </tbody>
        </table>
        <table id="table" class="table table-striped" v-if="all_sales != null">
          <h5>Outstanding Orders</h5>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Payable</th>
              <th>Waiter</th>
            </tr>
          </thead>
          <tbody :key="tableKey">
            <tr v-for="oustanding in oustanding" :key="oustanding.id">
              <td>{{oustanding.product}}</td>
              <td>{{oustanding.price.toLocaleString()}}</td>
              <td>{{oustanding.quantity.toLocaleString()}}</td><td>{{(oustanding.price*oustanding.quantity).toLocaleString()}}</td>
              <td>{{oustanding.waiter}}</td>
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
import Reports from '@/javascript/Api/Reports'
import helpers from '@/javascript/helpers'
  export default{

    data() {
      return {
        form:{start_date:null, end_date:null, platform:'all'},
        all_sales:null,
        tableKey:0,
        total:0,
        oustanding:[]

      }
    },
    methods: {
      printReceipt(){
        this.$router.push('/report-print')
      },
      sales(){
        Reports.generate_report(this.form).then((result) => {
          this.all_sales = result.data.data
          var res = []
          res.push(result.data.data)

          var outstanding = []

          for (let index = 0; index < res.length; index++) {
            if(res[index].oustanding.length > 0){
              outstanding.push(res[index].oustanding)
            }
          }
          this.getOutstanding(outstanding)
          this.tableKey++
          localStorage.setItem('sales', JSON.stringify(result.data.data))
          localStorage.setItem('form', JSON.stringify(this.form))
          this.datatable()
        })
      },
      getOutstanding(data){
        this.oustanding = []
        if(data.length > 0){
          data[0].forEach(element => {
            console.log(element)
            element.sales.forEach(sale => {
              this.oustanding.push({
                product: sale.product.name,
                quantity: sale.qty,
                price: (sale.price*0.075) + sale.price,
                waiter:element.user.fullname
              })
            })
          });
        }
        localStorage.setItem('outstanding', JSON.stringify(this.oustanding))

      },
      datatable(){
        $(function() {
          $('#table').DataTable({
            dom: 'Bfrtip',
            buttons: [
                'pdf', 'print'
            ],

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

