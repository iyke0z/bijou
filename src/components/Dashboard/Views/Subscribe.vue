<template>
  <div><br>
      <h4>Billing</h4>
      <div class="row">
        <!-- <div class="md-3"> -->
          <div class="row col-12">
            <div class="loader" v-if="loading"></div>
          <div
          class="col-12 col-sm-6 col-md-4 col-lg-4 mb-4"
          v-for="single_package in packages"
          :key="single_package.id"
        >
          <div class="card card-stats">
            <div class="card-header lead">
              <center>
                <strong class="lead">{{ single_package.name }}</strong><br>
                <p class="text-sm">{{ single_package.description }}</p>
              </center>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-12">
                  <div>
                    <center>
                      <hr />
                      <div class="card-body">
                        <p class="card-title lead">&#8358;{{ single_package.price.toLocaleString() }}</p>
                      </div>
                    </center>
                  </div>
                </div>
              </div>
            </div>
            <center>
              <div class="card-footer">
                <hr />
                <slot name="footer">
                  <button class="btn btn-dark" @click.prevent="fundWallet(single_package.price)">Subscribe</button>
                </slot>
              </div>
            </center>
          </div>
        </div>
      </div>  

    </div>
      <!-- </div> -->
      <section class="col-12 col-md-6">
        <h3>Activate</h3>
        <small>Input the activation code sent to your company email</small>
        <form @submit.prevent="activateSubscription">
          <div class="form-group">
            <!-- <label for="activationCode">Activation Code</label> -->
            <input type="text" id="activationCode" v-model="code" class="form-control" placeholder="Input Code" required>
          </div>
          <button class="btn btn-success col-12 col-md-8" type="submit">
            Activate <span class="loader" v-if="loading"></span>
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
            packages:null,
            business:null,
            code:null
        }
      },
      methods: {
        getpackages(){
          this.loading = true
          axios.get('https://api.ngmkt.site/api/admin/packages').then((result) => {
              this.packages = result.data.data
          })
          this.loading = false
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
  