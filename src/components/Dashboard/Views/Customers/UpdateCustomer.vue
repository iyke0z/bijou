<template>
  <div class="table-responsive"><br>
    <h4>Create Customer</h4>
    <section class="col-6">
      <form @submit.prevent="submit">
        <div class="form-group">
          <label for="">Fullname</label>
          <input type="text" class="form-control" v-model="form.fullname" required>
        </div>

        <div class="form-group">
          <label for="">Email</label>
          <input type="email" class="form-control" v-model="form.email" required>
        </div>

        <div class="form-group">
          <label for="">Phone</label>
          <input type="text" class="form-control" v-model="form.phone" required>
        </div>
        <div class="form-group">
          <label for="">address</label>
          <textarea name="" class="form-control" id="" cols="30" rows="10" v-model="form.address" required></textarea>
        </div>
        <button class="btn btn-success col-8" type="submit">Submit</button>
      </form>
    </section>
  </div>
</template>

<script>
import Customer from '@/javascript/Api/Customer';
import Swal from 'sweetalert2';
  export default{
    data(){
      return {
        form:{
          fullname:null,
          email:null,
          phone:null,
          address:null,
        },
      }
    },
    methods: {
      submit(){
        Customer.update(this.form, this.$route.params.id).then((result) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
           this.$router.push("/customer/all")
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
      get_customer(){
        Customer.details(this.$route.params.id).then((result) => {
          this.form.fullname = result.data.data['fullname']
          this.form.email = result.data.data['email']
          this.form.phone = result.data.data['phone']
          this.form.address = result.data.data['address']
        })
      }

    },
    created(){
      this.get_customer()
    }
  }
</script>
