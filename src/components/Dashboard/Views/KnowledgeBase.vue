<template>
    <div><br>
      <h4>Knowledge Base</h4>
      <div class="row">
        <!-- <div class="md-3"> -->
  
      <nav class="nav  flex-column flex-sm-row col-12 col-sm-6 col-md-8 col-lg-12 mb-4">
        <a class="flex-sm-fill text-sm-center mr-1" aria-current="page" href="#">Product Managmeent</a>
        <a class="flex-sm-fill text-sm-center mr-1 " href="#">Staff Managment</a>
        <a class="flex-sm-fill text-sm-center mr-1 " href="#">Customer Managment</a>
        <a class="flex-sm-fill text-sm-center mr-1 " href="#">Expenditure Managment</a>
        <a class="flex-sm-fill text-sm-center mr-1 " href="#">Sales Point</a>
        <a class="flex-sm-fill text-sm-center mr-1 " href="#">Subscription</a>
      </nav>
    </div>

     
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
            packages:null,
            business:null,
            code:null
        }
      },
      methods: {
        getpackages(){
          axios.get('https://api.ngmkt.site/api/admin/packages').then((result) => {
              this.packages = result.data.data
          })
        },

        getBusinessDetails(){
          Details.details().then((result) => {
            this.business = result.data
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
  
        },

        fundWallet(price){
            const handler = PaystackPop.setup({
              key: 'pk_live_a0d5def75f9107fd5fe5346be015d9f824f24a97', // Replace with your Paystack public key
              email: this.business.email, // User's email (Replace or bind with actual user data)
              amount: price * 100, // Paystack accepts the amount in kobo, so multiply by 100
              currency: 'NGN', // Nigerian currency
              callback: function(response) {              
                  
              },
              onClose: function() {
                window.location.reload();
              }
            });
            handler.openIframe(); 
          },

        activateSubscription(){
          this.loading = true
          Details.activate({code:this.code}).then((result) => {
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
        this.getBusinessDetails()
        this.getpackages()
      }
    }
  </script>
  