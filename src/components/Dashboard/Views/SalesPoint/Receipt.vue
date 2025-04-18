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
        <div class="TotalCalc bordered border-dark" v-if="summary != null">
          <div class="row ">
            <div class="col-8">Subotadl:</div>
            <div class="col-12">&#8358; {{summary?.amount}}</div>
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
            <div class="col-8">To</div>
            <div class="col-12">&#8358; {{Math.ceil(summary?.total)}} {{ summary.payment_method }}</div>
          </div>
          <div class="row"  v-if="summary?.payment_method == 'part_payment'">
            <div class="col-8">Paid</div>
            <div class="col-12">&#8358; {{Math.ceil(summary?.part_payment)}}</div>
          </div>
          <div class="row" v-if="summary?.payment_method == 'part_payment'">
            <div class="col-8" >Balance</div>
            <div class="col-12">&#8358; {{Math.ceil(summary?.total - summary?.part_payment)}}</div>
          </div>
        </div>
      </div>
      <div class="footnote mt-5">
        <center>
          <small>
            <p>{{ numberToWords(Math.ceil(summary?.total)) }}</p>
            <p><i>thank you for your patronage! see you next time.</i></p>
            <b>{{ this.details }}</b>
          </small>
        </center>
      </div>
    </div>

  </div>
</template>
<script>
import html2pdf from 'html2pdf.js';

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

        // setTimeout(()=> {
        //   window.print()
        //   localStorage.removeItem('products')
        //   localStorage.removeItem('summary')
        //   localStorage.removeItem('details')
        //   this.$router.push('/sales-point')
        // }, 2000)

      }
    },
    created(){
      this.printReceipt()
    }
,numberToWords(num) {
    if (num === 0) return "zero";

    const belowTwenty = [
        "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
        "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"
    ];
    const tens = [
        "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"
    ];
    const thousands = ["", "thousand", "million", "billion", "trillion"];

    function helper(n) {
        if (n === 0) return "";
        else if (n < 20) return belowTwenty[n] + " ";
        else if (n < 100) return tens[Math.floor(n / 10)] + " " + helper(n % 10);
        else return belowTwenty[Math.floor(n / 100)] + " hundred " + helper(n % 100);
    }

    let result = "";
    let i = 0;

    while (num > 0) {
        if (num % 1000 !== 0) {
            result = helper(num % 1000) + thousands[i] + " " + result;
        }
        num = Math.floor(num / 1000);
        i++;
    }

    return result.trim();
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
