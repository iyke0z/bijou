<template>
  <div><br>
    <span class="loader" v-if="loading"></span>
      <h4>Support & Communication</h4>
     
      <!-- </div> -->
      <section class="col-12 col-md-6">
        <small></small>
        <form @submit.prevent="submit">
          <div class="form-group">
            <label for="activationCode"> Type of Message</label>
            <select type="text" id="activationCode" v-model="type" class="form-control" required>
              <option value="billing">Billing</option>
              <option value="tech_support">Tech Support</option>
              <option value="inquiry">Inquiry</option>
            </select>
          </div>
          <div class="form-group">
            <label for="activationCode"> Message</label>
            <textarea type="text" id="activationCode" v-model="message" class="form-control" placeholder="Input Message" required>
              </textarea>
          </div>
          <button class="btn btn-success col-12 col-md-8" type="submit">
            Send Message 
          </button>
        </form>
      </section>
     
    </div>
  </template>
  <script>
    import Categories from '@/javascript/Api/Categories';
    import Swal from 'sweetalert2';
    import Details from '@/javascript/Api/BusinessDetails'
    import Auth from '@/javascript/Api/Auth'
    import PaystackPop from '@paystack/inline-js';
    import BusinessDetails from '@/javascript/Api/BusinessDetails';
import axios from 'axios';

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
            details:null,
            messageTypes:null,
            message:null,
            business:null,
            type:'billing'
        }
      },
      methods: {
        // getMessageTypes(){
        //   axios.get('https://api.ngmkt.site/api/message-types').then((result) => {
        //       this.messageTypes = result.data.data
        //   })
        // },

        getBusinessDetails(){
          Details.details().then((result) => {
            this.business = result.data
          })
        },

        submit(){
          this.loading = true
          axios.post('https://api.ngmkt.site/api/send-message', {message_type:this.type, message:this.message, email:this.business.email}).then((result) => {
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
  
        },

   
        },
      created(){
        this.getBusinessDetails()
        // this.getMessageTypes()
      }
    }
  </script>
  