<template>
  <div class="p-4"><br>
    <Loader :loading="isLoading" />
    <div class="card">
      <center class="mb-4">
        <button 
          @click="printReceipt" 
          v-show="all_sales != null" 
          class="btn btn-dark">
          <i class="fa fa-print"></i> Print Report
        </button>
      </center>
      <div class="card-body">
        <h5 class="card-title text-center">
          Sales Report <br /> 
          from {{ form.start_date }} - {{ form.end_date }}
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
          <button class="btn btn-success sm:col-span-2" type="submit">Generate</button>
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

        <!-- Other Tables (Reusable) -->
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Button, Modal } from '@/components/UIComponents'
import Sales from '@/javascript/Api/Sales'
import Reports from '@/javascript/Api/Reports'
import helpers from '@/javascript/helpers'
import Loader from '@/components/Loader.vue'

export default {
  components: {
    Loader
  },
  data() {
    return {
      form: { start_date: null, end_date: null, platform: 'all' },
      all_sales: null,
      tableKey: 0,
      total: 0,
      oustanding: [],
      void_items: [],
      sold_items: [],
      isLoading: false
    }
  },
  methods: {
    printReceipt() {
      this.$router.push('/report-print')
    },
    sales() {
      this.isLoading = true;
      Reports.generate_report(this.form).then((result) => {
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
        this.isLoading = false;
      }).catch(() => {
        this.isLoading = false;
      });
    },
    getVoidItems(data) {
      this.void_items = []
      if (data.length > 0) {
        data[0].forEach(element => {
          console.log(element)
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
          console.log(element)
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
          console.log(element)
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
    datatable() {
      $(function () {
        $('#table').DataTable({
          dom: 'Bfrtip',
          buttons: ['excel', 'pdf', 'print'],
          pageLength: 5,
          lengthMenu: [[5, 10, 20], [5, 10, 20]]
        });
      });
    },
    voided_table() {
      $(function () {
        $('#voided_table').DataTable({
          dom: 'Bfrtip',
          buttons: ['excel', 'pdf', 'print'],
          pageLength: 5,
          lengthMenu: [[5, 10, 20], [5, 10, 20]]
        });
      });
    },
    outstanding_table() {
      $(function () {
        $('#outstanding_table').DataTable({
          dom: 'Bfrtip',
          buttons: ['excel', 'pdf', 'print'],
          pageLength: 5,
          lengthMenu: [[5, 10, 20], [5, 10, 20]]
        });
      });
    },

    sold_table() {
      $(function () {
        $('#sold_table').DataTable({
          dom: 'Bfrtip',
          buttons: ['excel', 'pdf', 'print'],
          pageLength: 5,
          lengthMenu: [[5, 10, 20], [5, 10, 20]]
        });
      });
    }
  },
  created() {
    this.datatable()
  }
}
</script>

<style scoped>
.card-body {
  margin: 20px;
}
.table {
  margin-top: 20px;
}
h5 {
  margin-top: 20px;
  margin-bottom: 15px;
}
</style>
