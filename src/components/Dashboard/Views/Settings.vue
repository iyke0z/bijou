<template>
  <div><br>
      <h4>Settings</h4>
      <form action="" @submit.prevent="submit">
        <div class="mb">
            <label for="">Business Name</label>
            <input type="text" class="form-control col-8"  placeholder="input name" v-model="details.name" required>
        </div> <br>

        <div >
            <label for="">V.A.T</label>
            <input type="number" step="any" min="0" class="form-control col-8"  placeholder="input VAT" v-model="details.vat" required>
        </div>
        <br>

        <div >
            <label for="">Phone number 1</label>
            <input type="string" step="any" min="0" class="form-control col-8"  placeholder="Phone Number" v-model="details.phone_one"  required>
        </div>

        <br>
        <div >
            <label for="">Phone number 2</label>
            <input type="string" step="any" min="0" class="form-control col-8"  placeholder="Phone Number" v-model="details.phone_two"  required>
        </div>
        <br>
        <!-- <div >
            <label for="">Email Address</label>
            <input type="email" step="any" min="0" class="form-control col-8"  placeholder="Email Address" v-model="details.email"  required>
        </div> -->

        <br>

        <div >
            <label for="">Motto</label>
            <input type="motto" step="any" min="0" class="form-control col-8"  placeholder="Motto" v-model="details.motto"  required>
        </div>
        <button class="btn btn-success" type="submit">Update <span v-if="loading" class="loader"></span></button>
      </form>
    </div>
  </template>
  <script>
    import Categories from '@/javascript/Api/Categories';
    import Product from '@/javascript/Api/Product';
    import Swal from 'sweetalert2';
    import Details from '@/javascript/Api/BusinessDetails'
    import Auth from '@/javascript/Api/Auth'
    export default{
      data(){
        return{
          rows: {products:[{
              name:null,
              category_id:null,
              stock:0,
              price:null,
              code:null
            }]},
            loading: false,
            categories:null,
            details:null
        }
      },
      methods: {
        business_details(){
        Details.details().then((result) => {
          this.details = result.data
        })
      },

        submit(){
          this.loading = true
          Details.update(this.details, this.details.id).then((result) => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: result.data.message,
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000
            })
            window.location.reload()
          this.loading = false
          }).catch((err) => {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: err.response.data.message,
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000
            })
          });
          this.loading = false
  
        }
      },
      created(){
        this.business_details()
      }
    }
  </script>
  