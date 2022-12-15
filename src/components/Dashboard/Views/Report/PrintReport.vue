<template>
    <div>
        <div class="card">
            <div class="card-body">
              <h5 class="card-title">Bijou Cafe Sales Report <br/> from {{form.start_date}} - {{form.end_date}}</h5>


              <table id="table" class="table table-striped" v-if="all_sales != null">
                <thead>
                  <tr>
                    <th></th>
                    <th>EXPECTED AMOUNT</th>
                    <th>PAID AMOUNT</th>
                    <th>COMPLEMENTARY TRANSACTIONS</th>
                    <th>CASH TRANSACTIONS</th>
                    <th>TRANSFER TRANSACTIONS</th>
                    <th>CARD TRANSACTIONS</th>
                    <th>SPLIT TRANSACTIONS</th>
                    <th>SPLIT CASH TRANSACTIONS</th>
                    <th>SPLIT TRANSFER TRANSACTIONS</th>
                    <th>SPLIT CARD TRANSACTIONS</th>
                  </tr>
                </thead>
                <tbody :key="tableKey">
                  <tr>
                    <td>{{1}}</td>
                    <td>{{all_sales.expected_amount.toLocaleString()}}</td>
                    <td>{{all_sales.paid_amount.toLocaleString()}}</td>
                    <td>{{all_sales.complementary.toLocaleString()}}</td>
                    <td>{{all_sales.cash.toLocaleString()}}</td>
                    <td>{{all_sales.transfer.toLocaleString()}}</td>
                    <td>{{all_sales.card.toLocaleString()}}</td>
                    <td>{{all_sales.split_payments.toLocaleString()}}</td>
                    <td>{{all_sales.split_payments_cash.toLocaleString()}}</td>
                    <td>{{all_sales.split_payments_transfer.toLocaleString()}}</td>
                    <td>{{all_sales.split_payments_card.toLocaleString()}}</td>
                  </tr>
                </tbody>
              </table>
              <h3 v-if="all_sales != null">BANK TRANSACTION REMITANCE</h3>
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
              <h3 v-if="oustanding != null">Outstanding Orders</h3>
              <table id="table" class="table table-striped" v-if="all_sales != null">
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
  export default{

    data() {
      return {
        form:{start_date:null, end_date:null, platform:'all'},
        all_sales:null,
        tableKey:0,
        total:0,
        oustanding:0
      }
    },
    methods: {
      getData(){
        var all_sales = localStorage.getItem('sales')
        var form = localStorage.getItem('form')
        var outstanding = localStorage.getItem('outstanding')
        this.all_sales = JSON.parse(all_sales)
        this.form = JSON.parse(form)
        this.oustanding = JSON.parse(outstanding)

        setTimeout(()=> {
        window.print()
          localStorage.removeItem('sales')
          localStorage.removeItem('form')
          localStorage.removeItem('outstanding')
        this.$router.push('/report/sales')
        }, 2000)
      },
    },
    created() {
      this.getData()
    },
  }
</script>


