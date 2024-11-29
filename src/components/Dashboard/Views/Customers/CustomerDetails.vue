<template>
  <div class="table-responsive"><br>
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Customer Details</h5>
        <p class="card-text">Content</p><section class="col-6">
          <form @submit.prevent="submit">
            <div class="form-group">
              <label for="">Fullname</label>
              <input readonly type="text" class="form-control" v-model="form.fullname" required>
            </div>

            <!-- <div class="form-group">
              <label for="">Email</label>
              <input readonly type="email" class="form-control" v-model="form.email" required>
            </div> -->

            <div class="form-group">
              <label for="">Phone</label>
              <input readonly type="text" class="form-control" v-model="form.phone" required>
            </div>
            <!-- <div class="form-group">
              <label for="">address</label>
              <textarea readonly name="" class="form-control" id="" cols="30" rows="10" v-model="form.address" required></textarea>
            </div> -->
            <div class="form-group">
              <label for="">Wallet Balance</label>
              <input readonly type="text" class="form-control" v-model="form.wallet_balance" required>
            </div>
          </form>
        </section>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Transactions</h5>
        <table id="table" class="table table-striped">
          <thead>
            <tr>
              <th></th>
              <th>Type</th>
              <th>Amount</th>
              <th>Ref</th>
              <th>Payment Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(transaction, index) in transactions" :key="index">
              <td>{{ index+1 }}</td>
              <td>{{transaction.type}}</td>
              <td>{{transaction.amount.toLocaleString()}}</td>
              <td>{{transaction.id}}</td>
              <td>{{transaction.payment_method ?? "walllet funding"}} </td>
              <td>{{dateTime(transaction.created_at)}}</td>
            </tr>
          </tbody>
        </table>
  </div>
    </div>

  </div>
</template>

<script>
import Customer from '@/javascript/Api/Customer';
import Swal from 'sweetalert2';
import helpers from '@/javascript/helpers';
  export default{
    data(){
      return {
        form:{
          fullname:null,
          email:null,
          phone:null,
          address:null,
          wallet_balance:null
        },
        transactions:null,
        discounts:null
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
          this.form.wallet_balance = result.data.data['wallet_balance']
          this.transactions = result.data.data['transactions']
          this.discounts = result.data.data['discounts']
          this.datatable()
        })
      },
      dateTime(date){
        return helpers.dateTime(date)
      },
      datatable(){
        $(function() {
          $('#table').DataTable({
            dom: 'Bfrtip',
          buttons: ['excel', 'pdf', 'print'],
            "bDestroy": true,
                pageLength: 5,
                lengthMenu: [[5,10,20], [5, 10, 20]],
            });
        });
      },

    },
    created(){
      this.get_customer()
    }
  }
</script>
