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
            <p class="label">Goods Received Note</p>
          </div>
          <h5 v-if="summary != null">#{{ String(ref_no).padStart(7, '0') }}</h5>
        </center>
      </div>
      <div class="body">
        <!-- Customer (Receiver) Details Section -->
                  <div class="customerDetails" v-if="customer != null">
            <div class="row">
              <div class="col-8"><span class="mr-8"><b>RECIEVER:</b></span> {{ customer.fullname }}</div>
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
              <div class="col-8"><span class="mr-8"><b>SALES ORDER:</b></span>SO-{{ ref_no || 'N/A' }}</div>
            </div>
            <div class="row">
              <div class="col-8"><span class="mr-8"><b>DATE LEFT WAREHOUSE:</b></span> {{ dateTime(deliveryNote.date_left_warehouse) }}</div>
            </div>

          </div>

        <div class="tableArea">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty Ordered</th>
                <th>Received</th>
                <th>Condition</th>
              </tr>
            </thead>
            <tbody v-if="products != null">
              <tr v-for="item in products" :key="item.id">
                <td>{{ item.name }}</td>
                <td>{{ item.qty }}</td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="TotalCalc">
          <div class="row">
            <div class="col-4">Received By:</div>
            <div class="col-8"></div>
          </div>
          <div class="row">
            <div class="col-4"><b>CARRIER</b>:{{deliveryNote.delivery_details}}</div>
          </div>
          <div class="row">
            <div class="col-8"><b>NOTE</b>: {{ deliveryNote.note }}</div>
          </div>
        </div>
      </div>
      <div class="footnote mt-5">
        <center>
          <small>
            <p><i>Goods received and verified.</i></p>
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
      ref_no: null,
      customer: null,
      details: null,
      deliveryNote:null,
    };
  },
  methods: {
    loadGRN() {
      const customerData = localStorage.getItem('customer');
      this.ref_no = localStorage.getItem('ref_no');
      this.customer = customerData ? JSON.parse(customerData) : null;
      this.details = localStorage.getItem('details');
      this.products = JSON.parse(localStorage.getItem('products'));
      this.deliveryNote = JSON.parse(localStorage.getItem('deliverynote'));
    },

    dateTime(date) {
        var date = new Date(date)
        var time = new Date(date)
        let hours = time.getHours()
        let minutes = time.getMinutes()
        let seconds = time.getSeconds()
        var ampm = hours >= 12 ? 'pm' : 'am'
        return date.toDateString() + " " + hours + ":" + minutes + " " + ampm
    },
    printPage() {
  window.print();
},

downloadPDF() {
  const element = this.$el.querySelector('.paper');
  const opt = {
    margin:       0.5,
    filename:     `GRN-${this.ref_no || 'receipt'}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
}

  },
  created() {
    this.loadGRN();
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
button {
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
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