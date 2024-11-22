<template>
    <div>
      <h4>Subscribe</h4>
      <div class="row">
        <!-- <div class="md-3"> -->
        <div class="card card-stats col-3" v-for="single_package in packages" :key="single_package.id">
          <div class="card-header lead"><center><strong>{{single_package.description}}</strong></center></div>
           <div class="card-body">
            <div class="row">
              <div class="col-md-12">
                <div>
                  <center>
                  <hr/>
                    <div class="card-body">
                      <p class="card-title lead">&#8358;{{(single_package.price).toLocaleString()}}</p>
                    </div>
                  </center>
                </div>
            </div>
          </div>
          <center>
            <div class="card-footer">
              <hr/>
              <slot name="footer"><button class="btn btn-dark" @click.prevent="fundWallet(single_package.price)">Subscribe</button></slot>
            </div>
          </center>
        </div>
      </div>
    </div>
      <!-- </div> -->
     
    </div>
  </template>
  <script>
    import Categories from '@/javascript/Api/Categories';
    import Product from '@/javascript/Api/Product';
    import Swal from 'sweetalert2';
    import Details from '@/javascript/Api/BusinessDetails'
    import Auth from '@/javascript/Api/Auth'
    import PaystackPop from '@paystack/inline-js';
import BusinessDetails from '@/javascript/Api/BusinessDetails';

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
            business:null
        }
      },
      methods: {
        getpackages(){
          Details.get_packages().then((result) => {
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
              title: result.response.data.message,
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
        },
      created(){
        this.getBusinessDetails()
        this.getpackages()
      }
    }
  </script>
  