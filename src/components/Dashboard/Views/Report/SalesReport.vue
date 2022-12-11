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

        <table id="table" class="table table-striped" v-if="all_sales != null">
          <thead>
            <tr>
              <th></th>
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
              <td>{{1}}</td>
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
        total:0
      }
    },
    methods: {
      printReceipt(){
        this.$router.push('/report-print')
      },
      sales(){
        Reports.generate_report(this.form).then((result) => {
          this.all_sales = result.data.data
          this.tableKey++
          localStorage.setItem('sales', JSON.stringify(result.data.data))
          localStorage.setItem('form', JSON.stringify(this.form))
          this.datatable()
        })
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

