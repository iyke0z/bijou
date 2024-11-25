<template>
  <div class="table-responsive">
    <div class="paper">
      <div class="head">
        <center>
          <div class="receipt_label">
            <p class="label">Receipt</p>
          </div>
          <h5 v-if="summary != null">#{{ String(summary.ref_no).padStart(7, 0)}}</h5>
        </center>
      </div>
      <div class="body">
        <div class="tableArea">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody v-if="products != null">
              <tr v-for="item in products" :key="item">
                <td>{{item.name}}</td>
                <td>{{item.qty}}</td>
                <td>{{item.price}}</td>
                <td>{{item.price * item.qty}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="TotalCalc" v-if="summary != null">
          <div class="row">
            <div class="col-8">Subotal:</div>
            <div class="col-8">&#8358; {{summary?.amount}}</div>
          </div>
          <div class="row">
            <div class="col-8">Discount</div>
            <div class="col-8">{{summary?.discount}} %</div>
          </div>
          <div class="row">
            <div class="col-8">V.A.T</div>
            <div class="col-8">{{summary?.vat}}</div>
          </div>
          <div class="row">
            <div class="col-8">Total</div>
            <div class="col-8">&#8358; {{Math.ceil(summary?.total)}}</div>
          </div>
        </div>
      </div>
      <div class="footnote mt-5">
        <center>
          <small>
            <p><i>thank you for your patronage! see you next time.</i></p>
            <b>{{ this.details }}</b>
          </small>
        </center>
      </div>
    </div>

  </div>
</template>
<script>
  export default{
    data() {
      return {
        products:null,
        summary:null,
        details:null
      }
    },
    methods: {
      printReceipt(){
        var product = localStorage.getItem('products')
        var summary = localStorage.getItem('summary')
        this.products = JSON.parse(product)
        this.summary = JSON.parse(summary)
        this.details = localStorage.getItem('details')
        setTimeout(()=> {
        window.print()
          localStorage.removeItem('products')
        localStorage.removeItem('summary')
        localStorage.removeItem('details')

        this.$router.push('/sales-point')
        }, 2000)

      }
    },
    created(){
      this.printReceipt()
    }
    // watch: {
    //   items(){

    //     if(this.items != null){
    //       window.print()
    //     }
    //   }
    // }
  }
</script>
<style scoped>
.receipt_label{
  border: 1px solid black;
  border-radius: 100%;
  width: 70px;
  height: 60px;
  padding: 5px;
  color: white;
  background-color:black;
  margin-bottom:2%
}

.label{
  position:relative;
  margin-top: 10px;
}

td,th{
  font-size: smaller;
}
</style>
