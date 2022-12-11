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
      getData(){
        var all_sales = localStorage.getItem('sales')
        var form = localStorage.getItem('form')
        this.all_sales = JSON.parse(all_sales)
        this.form = JSON.parse(form)

        setTimeout(()=> {
        window.print()
          localStorage.removeItem('sales')
          localStorage.removeItem('form')
        this.$router.push('/report/sales')
        }, 2000)
      },
    },
    created() {
      this.getData()
    },
  }
</script>


