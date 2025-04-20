<template>
  <div><br>
    <span class="loader" v-if="loading"></span>    <h4>New Expenditure</h4>
    <section class="col-12">
      <form @submit.prevent="submit">
        <div class="form-group">
          <label for="">Type</label>
          <select v-model="form.expenditure_type_id"  class="form-control" id="">
            <option value="null">Select</option>
            <option v-for="type in types" :key="type.id"  :value="type.id">
              {{ type.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="">Amount <small>(total amount)</small></label>
          <input type="number" step="any" class="form-control" v-model="form.amount" required>
        </div>
        <div class="form-group">
          <label for="">Quantity</label>
          <input type="number" step="any" class="form-control" v-model="form.qty" required>
        </div>
        <button class="btn btn-success col-8" type="submit">Submit</button>
      </form>
    </section>
  </div>
</template>

<script>
import User from '@/javascript/Api/User';
import Expenditure from '@/javascript/Api/Expenditure';
import ExpTypes from '@/javascript/Api/Expenditure';
import Swal from 'sweetalert2';
  export default{
    data(){
      return {
        form:{
          expenditure_type_id:null,
          amount:null,
          qty:1
        },
        types: null,
        loading:false
      }
    },
    methods: {
      submit(){
        this.loading = true
        Expenditure.create(this.form).then((result) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
        this.loading = false
          this.form = {
            expenditure_type_id:null,
            amount:null,
        }
        }).catch((err) => {
        this.loading = false

         Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: err?.response?.data?.error ?? err.response.data.message,
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000
            })
        });
      },

      expenditureTypes(){
        ExpTypes.all_types().then((result) => {
          this.types = result.data.data
        })
      }

    },
    created(){
      this.expenditureTypes()
    }
  }
</script>
