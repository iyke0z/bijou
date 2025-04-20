<template>
<!-- START RECEIPT -->
<div class="receipt">
  <div class="orderNo">
    <b>{{ this.details }}</b><br />
    {{ getDate() }}<br />
    {{ summary.payment_method }} receipt<br />
    Receipt ID# <span>{{ String(summary?.ref_no).padStart(7, 0) }}</span>
  </div>

  <table class="table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Qty</th>
        <th>Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in products" :key="item.name">
        <td>{{ item.name }}</td>
        <td>{{ item.qty }}</td>
        <td>{{ item.price.toLocaleString() }}</td>
        <td>{{ (item.qty * item.price).toLocaleString() }}</td>
      </tr>
    </tbody>
  </table>

  <div class="totals">
    <div>Subtotal: &#8358; {{ summary?.amount.toLocaleString() }}</div>
    <div>Discount: {{ summary?.discount }}%</div>
    <div>VAT: {{ summary?.vat }}</div>
    <div>Logistics: &#8358; {{ summary?.logistics }}</div>
    <div><strong>Total: &#8358; {{ Math.ceil(summary?.total + parseFloat(summary?.logistics)).toLocaleString() }}</strong></div>

    <div v-if="summary?.payment_method === 'part_payment'">
      Paid: &#8358; {{ Math.ceil(summary?.part_payment).toLocaleString() }}<br />
      Balance: &#8358; {{ Math.ceil(summary?.total - summary?.part_payment).toLocaleString() }}
    </div>
  </div>

  <div class="footer">
    <i>{{ numberToWords(Math.ceil(summary?.total + parseFloat(summary?.logistics))) }} naira only</i><br />
    <i>Thank you for your patronage!<br />See you next time.</i>
  </div>
</div>

</template>
<script>
import helpers from '@/javascript/helpers'
  export default{
    data() {
      return {
        products:null,
        summary:null,
        details:null
      }
    },
    methods: {
      numberToWords(num) {
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
},

      getDate(){
        var date = new Date()
        return date.toDateString()
        this.printReceipt()
      },
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

          this.$router.go(-1);
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
.receipt {
  font-family: 'Courier New', monospace;
  width: 80mm;
  max-width: 100%;
  padding: 5mm;
  font-size: 10pt;
  color: #000;
}

.orderNo {
  text-align: center;
  margin-bottom: 5mm;
  font-weight: bold;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 9pt;
}

.table th, .table td {
  border-bottom: 1px dashed #000;
  padding: 2pt;
  text-align: left;
}

.table th {
  font-weight: bold;
}

.totals {
  margin-top: 5mm;
  border-top: 1px solid #000;
  padding-top: 3mm;
  font-size: 9pt;
}

.totals div {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2mm;
}

.footer {
  margin-top: 5mm;
  text-align: center;
  font-style: italic;
  font-size: 9pt;
}

/* Hide screen-only elements when printing */
@media print {
  body {
    margin: 0;
  }

  .receipt {
    margin: 0 auto;
    page-break-after: always;
  }

  * {
    background: none !important;
    color: #000 !important;
    box-shadow: none !important;
    text-shadow: none !important;
  }
}
</style>
