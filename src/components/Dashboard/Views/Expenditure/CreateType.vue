<template>
  <div>
    <h4>New Expenditure</h4>
    <section class="col-6">
      <form @submit.prevent="submit">
        <div class="form-group">
          <label for="">Type</label>
          <input type="text" step="any" class="form-control" v-model="form.name" placeholder="Enter Expenditure Type Name" required>
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
          name:null,
        },
        types: null
      }
    },
    methods: {
      submit(){
        Expenditure.create_type(this.form).then((result) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.form = {
            name:null,
        }
        }).catch((err) => {
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
      // this.expenditureTypes()
    }
  }
</script>
