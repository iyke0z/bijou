<template>
<!-- START RECEIPT -->
<div class="receipt">
  <div class="orderNo">
    <b>{{ this.details }}</b><br/>
    {{getDate()}} <br/>
    {{ summary.payment_method }} receipt <br>
   Receipt ID# <span id="Order #">{{ String(summary?.ref_no).padStart(7, 0)}}</span>
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
            <td>{{item.price.toLocaleString()}}</td>
            <td>{{(item.price * item.qty).toLocaleString()}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="TotalCalc" v-if="summary != null">
      <div class="row">
        <div class="col-4">Subotal:</div>
        <div class="col-4"><b>&#8358; {{(summary?.amount).toLocaleString()}}</b></div>
      </div>
      <div class="row">
        <div class="col-4">Discount</div>
        <div class="col-4">{{summary?.discount}} %</div>
      </div>
      <div class="row">
        <div class="col-4">V.A.T</div>
        <div class="col-4">{{summary?.vat}}</div>
      </div>
      <div class="row">
        <div class="col-4">Total</div>
        <div class="col-4"> <b>&#8358; {{Math.ceil(summary?.total).toLocaleString()}}</b></div>
      </div>
      <div class="row"  v-if="summary?.payment_method == 'part_payment'">
        <div class="col-4">Paid</div>
        <div class="col-4">&#8358; {{Math.ceil((summary?.part_payment)).toLocaleString()}}</div>
      </div>
      <div class="row" v-if="summary?.payment_method == 'part_payment'">
        <div class="col-4" >Balance</div>
        <div class="col-4">&#8358; {{Math.ceil((summary?.total - summary?.part_payment)).toLocaleString()}}</div>
      </div>
    </div>
  </div>

 <div class="keepIt">
  <i>{{ numberToWords(Math.ceil(summary?.total)) }} naira only</i><br>

  <i>thank you for your patronage! <br>see you next time.</i>

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
/* TODO: optimize */

body {
  font-family: 'Roboto', sans-serif;
  margin: 0px;
  padding: 0px;
}

.receipt {
    padding: 3mm;
    width: 80mm;
}
.orderNo {
  width: 100%;
  text-align: center;
  padding-bottom: 1mm;
  font-size: 8pt;
  font-weight: bold;
}

.orderNo:empty {
  display: none;
}

.headerSubTitle {
  font-family: 'Equestria', 'Permanent Marker', cursive;
  text-align: center;
  font-size: 12pt;
}

.headerTitle {
  font-family: 'Equestria', 'Permanent Marker', cursive;
  text-align: center;
  font-size: 24pt;
  font-weight: bold;
}

#location {
  margin-top: 5pt;
  text-align: center;
  font-size: 16pt;
  font-weight: bold;
}

#date {
  margin: 5pt 0px;
  text-align: center;
  font-size: 8pt;
}

#barcode {
  display: block;
  margin: 0px auto;
}

#barcode:empty {
  display: none;
}

.watermark {
   position: absolute;
   left: 7mm;
   top: 60mm;
   width: 75mm;
   opacity: 0.1;
}

.keepIt {
  margin-top: 3%;
  text-align: center;
  font-size: 10pt;
}

.keepItBody {
  text-align: justify;
  font-size: 8pt;
}

.item {
  margin-bottom: 1mm;
}

.itemRow {
  display: flex;
  font-size: 8pt;
  align-items: baseline;
}

.itemRow > div {
  align-items: baseline;
}

.itemName {
  font-weight: bold;
}

.itemPrice {
  text-align: right;
  flex-grow: 1;
}

.itemColor {
  width: 10px;
  height: 100%;
  background: yellow;
  margin: 0px 2px;
  padding: 0px;
}

.itemColor:before {
  content: "\00a0";
}


.itemData2 {
  text-align: right;
  flex-grow: 1;
}

.itemData3 {
  width: 15mm;
  text-align: right;
}

.itemQuantity:before {
  content: "x";
}

.itemTaxable:after {
  content: " T";
}

.flex {
  display: flex;
  justify-content: center;
}

#qrcode {
  align-self: center;
  flex: 0 0 100px
}

.totals {
  flex-grow: 1;
  align-self: center;
  font-size: 8pt;
}

.totals .row {
  display: flex;
  text-align: right;
}

.totals .section {
  padding-top: 2mm;
}

.totalRow > div, .total > div {
  text-align: right;
  align-items: baseline;
  font-size: 8pt;
}

.totals .col1 {
  text-align: right;
  flex-grow: 1;
}

.totals .col2 {
   width: 22mm;
}

.totals .col2:empty {
  display: none;
}

.totals .col3 {
  width: 15mm;
}

.footer {
  overflow: hidden;
  margin-top: 5mm;
  border-radius: 7px;
  width: 100%;
  background: black;
  color: white;
  text-align: center;
  font-weight: bold;
  text-transform: uppercase;
}

.footer:empty {
    display: none;
}

.eta {
  padding: 1mm 0px;
}

.eta:empty {
    display: none;
}

.eta:before {
    content: "Estimated time order will be ready: ";
  font-size: 8pt;
  display: block;
}

.etaLabel {
  font-size: 8pt;
}

.printType {
  padding: 1mm 0px;
  width: 100%;
  background: grey;
  color: white;
  text-align: center;
  font-weight: bold;
  text-transform: uppercase;
}

.about {
  font-size: 12pt;
  overflow: hidden;
  background: #FCEC52;
  color: #3A5743;
  border-radius: 7px;
  padding: 0px;
  position: absolute;
  width: 500px;
  text-align: center;
  left: 50%;
  margin-top: 50px;
  margin-left: -250px;
}

.arrow_box h3, ul {
  margin: 5px;
}

.about li {
  text-align: left;
}

.arrow_box {
	position: absolute;
	background: #88b7d5;
  padding: 5px;
  margin-top: 20px;
  left: 95mm;
  top: 2;
  width: 500px;
	border: 4px solid #c2e1f5;
}
.arrow_box:after, .arrow_box:before {
	right: 100%;
	top: 50%;
	border: solid transparent;
	content: " ";
	height: 0;
	width: 0;
	position: absolute;
	pointer-events: none;
}

.arrow_box:after {
	border-color: rgba(136, 183, 213, 0);
	border-right-color: #88b7d5;
	border-width: 30px;
	margin-top: -30px;
}
.arrow_box:before {
	border-color: rgba(194, 225, 245, 0);
	border-right-color: #c2e1f5;
	border-width: 36px;
	margin-top: -36px;
}
</style>
