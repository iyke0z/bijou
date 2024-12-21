<template>
  <div><br>
    <h4>New Expenditure Type</h4>
    <section class="col-12">
      <form @submit.prevent="submit">
        <div class="form-group">
          <label for="">Type</label>
          <input type="text" step="any" class="form-control" v-model="form.name" placeholder="Enter Expenditure Type Name" required>
        </div>
        <div class="form-group">
          <label for="">Category</label>
          <select step="any" class="form-control" v-model="form.expenditure_type" placeholder="Enter Expenditure Type Name" required>
            <option value="cogs">COGS</option>
            <option value="opex">OPEX</option>
            <option value="capex">CAPEX</option>
          </select>
        </div>
        <div class="form-group" v-if="form.expenditure_type == 'capex'">
          <label for="">Useful Life</label>
          <input type="number" step="any" class="form-control" v-model="form.useful_life" placeholder="How long will this asset be valuable to your business (in years)" required>
        </div>
        <div class="form-group" v-if="form.expenditure_type == 'capex'">
          <label for="">Salvage Value <small>(this is how much this item will cost when the item is sold, put this in percentage)</small></label>
          <input type="number" step="any" class="form-control" v-model="form.salvage_value" placeholder="How long will this asset be valuable to your business (in years)" required>
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
          expenditure_type:'cogs',
          useful_life: null,
          salvage_value: null
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
            expenditure_type:'cogs'

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
