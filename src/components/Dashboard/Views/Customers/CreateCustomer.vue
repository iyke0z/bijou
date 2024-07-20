<template>
  <div>
    <h4>Create Customer</h4>
    <section class="col-6">
      <form @submit.prevent="submit">
        <div class="form-group">
          <label for="">Fullname</label>
          <input type="text" class="form-control" v-model="form.fullname" required>
        </div>

        <div class="form-group">
          <label for="">Email</label>
          <input type="email" class="form-control" v-model="form.email">
        </div>

        <div class="form-group">
          <label for="">Phone</label>
          <input type="text" class="form-control" v-model="form.phone" required>
        </div>
        <div class="form-group">
          <label for="">address</label>
          <textarea name="" class="form-control" id="" cols="30" rows="10" v-model="form.address" required></textarea>
        </div>
        <div class="form-group">
          <label for="">Wallet Balance</label>
          <input type="number" step="any" class="form-control" v-model="form.wallet_balance" required>
        </div>
        <button class="btn btn-success col-8" type="submit">Submit</button>
      </form>
    </section>
  </div>
</template>

<script>
import User from '@/javascript/Api/User';
import Customer from '@/javascript/Api/Customer';
import RolesPriviledge from '@/javascript/Api/RolesPriviledge';
import Swal from 'sweetalert2';
  export default{
    data(){
      return {
        form:{
          fullname:null,
          email:null,
          phone:null,
          address:null,
          wallet_balance:0
        },
      }
    },
    methods: {
      submit(){
        Customer.create(this.form).then((result) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.form = {
          fullname:null,
          email:null,
          phone:null,
          address:null,
          wallet_balance:0
        }
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
      }

    },
    created(){
      // this.get_roles()
    }
  }
</script>
