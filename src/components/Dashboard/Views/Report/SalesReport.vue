<template>
  <div class="table-responsive">
    <Loader :loading="isLoading" />
    <div class="card">
      <center>
        <button @click="printReceipt" v-show="all_sales != null" class="btn btn-dark">
          <i class="fa fa-print"></i>
        </button>
      </center>
      <div class="card-body">
        <h5 class="card-title">Sales Report <br/> from {{form.start_date}} - {{form.end_date}}</h5>
        <h6>Filter</h6>
        <form action="" @submit.prevent="sales">
          <div class="form-group">
            <label for="">Start Date</label>
            <input type="datetime-local" v-model="form.start_date" class="form-control col-6" required>
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

        <!-- Sales Table -->
        <div v-if="all_sales">
          <h5>Sales Summary</h5>
          <table id="table" class="table table-responsive table-striped">
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

        <!-- Banks Table -->
        <div v-if="all_sales">
          <h5>Bank Transactions</h5>
          <table id="table" class="table table-striped">
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
        </div>

        <!-- Outstanding Orders Table -->
        <div v-if="oustanding.length">
          <h5>Unpaid Orders</h5>
          <table id="outstanding_table" class="table table-striped">
            <thead>
              <tr>
                <th>Transaction Reference</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Payable</th>
                <th>Waiter</th>
              </tr>
            </thead>
            <tbody :key="tableKey">
              <tr v-for="oustanding in oustanding" :key="oustanding.id">
                <td>{{oustanding.ref}}</td>
                <td>{{oustanding.product}}</td>
                <td>{{oustanding.price.toLocaleString()}}</td>
                <td>{{oustanding.quantity.toLocaleString()}}</td>
                <td>{{(oustanding.price * oustanding.quantity).toLocaleString()}}</td>
                <td>{{oustanding.waiter}}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Voided Orders Table -->
        <div v-if="void_items.length">
          <h5>Voided Orders</h5>
          <table id="voided_table" class="table table-striped">
            <thead>
              <tr>
                <th>Transaction Reference</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Payable</th>
                <th>Waiter</th>
              </tr>
            </thead>
            <tbody :key="tableKey">
              <tr v-for="void_items in void_items" :key="void_items.id">
                <td>{{void_items.ref}}</td>
                <td>{{void_items.product}}</td>
                <td>{{void_items.price.toLocaleString()}}</td>
                <td>{{void_items.quantity.toLocaleString()}}</td>
                <td>{{(void_items.price * void_items.quantity).toLocaleString()}}</td>
                <td>{{void_items.waiter}}</td>
              </tr>
            </tbody>
          </table>
        </div>

          <!-- Sales Table -->
          <div v-if="void_items.length">
          <h5>Sold Items</h5>
          <table id="sold_table" class="table table-striped">
            <thead>
              <tr>
                <th>Transaction Reference</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Payable</th>
                <th>Waiter</th>
              </tr>
            </thead>
            <tbody :key="tableKey">
              <tr v-for="sold_items in sold_items" :key="sold_items.id">
                <td>{{sold_items.ref}}</td>
                <td>{{sold_items.product}}</td>
                <td>{{sold_items.price.toLocaleString()}}</td>
                <td>{{sold_items.quantity.toLocaleString()}}</td>
                <td>{{(sold_items.price * sold_items.quantity).toLocaleString()}}</td>
                <td>{{sold_items.waiter}}</td>
              </tr>
            </tbody>
          </table>
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
