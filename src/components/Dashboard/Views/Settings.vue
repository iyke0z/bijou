<template>
  <div><br>
    <span v-if="loading" class="loader"></span>
    <h4>Settings</h4>
    <form @submit.prevent="submit">
      <div class="mb">
        <label>Business Name</label>
        <input type="text" class="form-control col-8" placeholder="Input name" v-model="details.name" required>
      </div> <br>

      <div>
        <label>V.A.T</label>
        <input type="number" step="any" min="0" class="form-control col-8" placeholder="Input VAT" v-model="details.vat" required>
      </div>
      <br>

      <div>
        <label>Phone number 1</label>
        <input type="text" class="form-control col-8" placeholder="Phone Number" v-model="details.phone_one" required>
      </div>
      <br>

      <div>
        <label>Phone number 2</label>
        <input type="text" class="form-control col-8" placeholder="Phone Number" v-model="details.phone_two" required>
      </div>
      <br>

      <div>
        <label>Set Negative Stock</label>
        <select v-model="details.is_negative_stock" class="form-control col-8">
          <option :value="1">Yes</option>
          <option :value="0">No</option>
        </select>
      </div>
      <br>

      <div>
        <label>Motto</label>
        <input type="text" class="form-control col-8" placeholder="Motto" v-model="details.motto" required>
      </div>
      <br>

      <div>
        <label>Business Opening Time</label>
        <input type="time" class="form-control col-8" v-model="details.times.start_time" required>
      </div>
      <br>

      <div>
        <label>Business Closing Time</label>
        <input type="time" class="form-control col-8" v-model="details.times.closing_time" required>
      </div>
      <br>

      <div>
        <label>Owner Equity</label>
        <input type="number" step="any" min="0" class="form-control col-8" placeholder="Owner Equity" v-model="details.owner_equity" required>
      </div> <br>
      <div>
        <label>Shipping Fee</label>
        <input type="number" step="any" min="0" class="form-control col-8"  v-model="details.logistics_fee" required>
      </div>
      <br>

      <button class="btn btn-success" type="submit">
        Update
        <span v-if="loading" class="loader"></span>
      </button>
    </form>
  </div>
</template>

<script>
import Details from '@/javascript/Api/BusinessDetails'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      loading: false,
      details: {
        name: '',
        vat: '',
        phone_one: '',
        phone_two: '',
        is_negative_stock: 0,
        motto: '',
        owner_equity: '',
        logistics_fee: '',
        times: {
          start_time: '',
          closing_time: ''
        }
      }
    }
  },
  methods: {
    business_details() {
      Details.details().then((result) => {
        this.details = result.data;
        // Ensure nested structures exist
        if (!this.details.times) {
          this.details.times = { start_time: '', closing_time: '' };
        }
      });
    },

    submit() {
      this.loading = true;
      Details.update(this.details, this.details.id).then((result) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: result.data.message,
          customClass: 'Swal-wide',
          showConfirmButton: false,
          timer: 3000
        });
        this.loading = false;
      }).catch((err) => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: err.response?.data?.message || "Something went wrong",
          customClass: 'Swal-wide',
          showConfirmButton: false,
          timer: 3000
        });
        this.loading = false;
      });
    }
  },
  created() {
    this.business_details();
  }
}
</script>
