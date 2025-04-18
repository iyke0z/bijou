<template>
    <div class="container table-responsive">
      <div class="d-flex justify-content-end mb-3">
      <button class="btn btn-sm btn-dark mr-2" @click="printPage">🖨️ Print</button>
      <button class="btn btn-sm btn-success" @click="downloadPDF">⬇️ Download PDF</button>
    </div>
      <div class="paper">
        <div class="head">
          <center>
            <div class="receipt_label">
              <p class="label">Sales Order</p>
            </div>
            <h5 v-if="summary != null">#{{ String(summary.ref_no).padStart(7, '0') }}</h5>
          </center>
        </div>
        <div class="body">
          <!-- Customer Details Section -->
          <div class="customerDetails" v-if="customer != null">
            <div class="row">
              <div class="col-8"><span class="mr-8"><b>CUSTOMER:</b></span> {{ customer.fullname }}</div>
            </div>
            <div class="row">
              <div class="col-8">
                <span class="mr-8"><b>ADDRESS:</b></span>
                {{ customer.address }}</div>
            </div>
            <div class="row">
              <div class="col-8"><span class="mr-8"><b>CONTACT:</b></span>
                {{ customer.phone }} | {{ customer.email }}</div>
            </div>
            <div class="row">
                <div class="col-8"><span class="mr-8"><b>PURCHASE ORDER:</b></span>PO-{{ summary.ref_no || 'N/A' }}</div>
            </div>
          </div>
  
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
                <tr v-for="item in products" :key="item.id">
                  <td>{{ item.name }}</td>
                  <td>{{ item.qty }}</td>
                  <td>₦ {{ (item.price).toLocaleString() }}</td>
                  <td>₦ {{ (item.price * item.qty).toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="TotalCalc" v-if="summary != null">
            <div class="row">
              <div class="col-8">Subtotal: ₦ {{ (summary.amount)?.toLocaleString() }}</div>
            </div>
            <div class="row">
              <div class="col-8">Discount: {{ summary.discount }} %</div>
            </div>
            <div class="row">
              <div class="col-8">Logistics: ₦ {{(summary.logistics)?.toLocaleString()}}</div>
            </div>
            <div class="row">
              <div class="col-8">V.A.T: {{ summary.vat }} %</div>
            </div>
            <div class="row">
              <div class="col-8">Total: ₦ {{ (Math.ceil(summary.total + parseFloat(summary.logistics)))?.toLocaleString() }}</div>
            </div>
          </div>
        </div>
        <div class="footnote mt-5">
          <center>
            <small>
              <p>{{ numberToWords(Math.ceil(summary?.total)) }} naira only</p>
              <p><i>Order confirmed. Please prepare for shipment.</i></p>
              <b>{{ details }}</b>
            </small>
          </center>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import html2pdf from 'html2pdf.js';

  export default {
    data() {
      return {
        products: null,
        summary: null,
        customer: null,
        details: null
      };
    },
    methods: {
      printPage() {
  window.print();
},

downloadPDF() {
  const element = this.$el.querySelector('.paper');
  const opt = {
    margin:       0.5,
    filename:     `SALES-ORDER-${this.ref_no || 'receipt'}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
},
      loadSalesOrder() {
        const productData = localStorage.getItem('products');
        const summaryData = localStorage.getItem('summary');
        const customerData = localStorage.getItem('customer');
        this.products = productData ? JSON.parse(productData) : null;
        this.summary = summaryData ? JSON.parse(summaryData) : null;
        this.customer = customerData ? JSON.parse(customerData) : null;
        this.details = localStorage.getItem('details') || 'Acme Electronics Ltd., 123 Tech Street, City, Country';
  
        // Sample data for demonstration
        if (!this.products || !this.summary || !this.customer) {
          this.customer = {
            name: 'John Doe Enterprises',
            address: '456 Commerce Ave, City, Country',
            phone: '(987) 654-3210',
            email: 'john.doe@email.com',
            purchase_order: 'PO-98765'
          };
        }
      },
      numberToWords(num) {
        if (num === 0) return 'zero';
  
        const belowTwenty = [
          '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
          'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
        ];
        const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
        const thousands = ['', 'thousand', 'million', 'billion', 'trillion'];
  
        function helper(n) {
          if (n === 0) return '';
          else if (n < 20) return belowTwenty[n] + ' ';
          else if (n < 100) return tens[Math.floor(n / 10)] + ' ' + helper(n % 10);
          else return belowTwenty[Math.floor(n / 100)] + ' hundred ' + helper(n % 100);
        }
  
        let result = '';
        let i = 0;
        while (num > 0) {
          if (num % 1000 !== 0) {
            result = helper(num % 1000) + thousands[i] + ' ' + result;
          }
          num = Math.floor(num / 1000);
          i++;
        }
        return result.trim();
      }
    },
    created() {
      this.loadSalesOrder();
    }
  };
  </script>
  
  <style scoped>
  .receipt_label {
    border: 1px solid black;
    border-radius: 100%;
    width: 70px;
    height: 60px;
    padding: 5px;
    color: white;
    background-color: black;
    margin-bottom: 2%;
  }
  
  .label {
    position: relative;
    margin-top: 10px;
  }
  
  .customerDetails, .TotalCalc {
    margin: 10px 0;
  }
  
  td, th {
    font-size: smaller;
  }
  </style>