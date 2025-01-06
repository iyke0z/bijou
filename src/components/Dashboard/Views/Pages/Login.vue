<template>
  <div class="login-page" :key="componentKey">
    <app-navbar></app-navbar>
    <div class="wrapper wrapper-full-page">
      <div class="full-page login-page section-image">
        <!--   you can change the color of the filter page using: data-color="blue | azure | green | orange | red | purple" -->
        <div class="content">
          <div class="container">
            <div v-show="getDetails == []">
              <center>
                <form @submit.prevent="saveDetails">
                    <h3 slot="header" class="header text-center text-light">Add Business Details</h3>

                      <div class="form-group">
                        <input type="text" class="form-control col-6" v-model="details.name" required placeholder="Business Name...">
                      </div>

                      <div class="form-group">
                        <input type="email" class="form-control col-6" v-model="details.email" placeholder="Email Address...">
                      </div>

                      <div class="form-group">
                        <input type="text" class="form-control col-6" v-model="details.website" placeholder="Website...">
                      </div>

                      <div class="form-group">
                        <input type="text" class="form-control col-6" v-model="details.phone_one" required placeholder="Phone Number 1...">
                      </div>

                      <div class="form-group">
                        <input type="text" class="form-control col-6" v-model="details.phone_two" required placeholder="Phone Number 2...">
                      </div>

                      <div class="form-group">
                        <input type="text" class="form-control col-6" v-model="details.motto" placeholder="Motto...">
                      </div>

                      <div class="form-group">
                        <input type="number" step="any" class="form-control col-6" v-model="details.vat" required placeholder="VAT...">
                      </div>
                      <div class="form-group">
                        <button type="submit" class="btn btn-warning mb-3 col-sm-6">Create</button>
                      </div>
                </form>
              </center>
            </div>
            <div class="col-lg-4 col-md-6 ml-auto mr-auto" v-if="getDetails != []">
              <form @submit.prevent="login">
                <card type="login">
                  <h3 slot="header" class="header text-center">Login</h3>

                  <fg-input v-model="form.phone"  addon-left-icon="nc-icon nc-single-02"
                            required placeholder="Phone Number"></fg-input>

                  <fg-input v-model="form.password" addon-left-icon="nc-icon nc-key-25" placeholder="Password"
                            required type="password"></fg-input>
                  <br>
                  <button type="submit" style="cursor:pointer" class="btn btn-warning mb-3 col-sm-12">Login<span v-if="loading" class="loader"></span></button>
                </card>
              </form>
            </div>
          </div>
        </div>
        <app-footer></app-footer>
        <div class="full-page-background" style="background-image: url(static/img/shoppingCart.png) "></div>
      </div>
    </div>
  </div>
</template>
<script>
  import { Card, Checkbox, Button } from '@/components/UIComponents';
  import AppNavbar from './Layout/AppNavbar'
  import AppFooter from './Layout/AppFooter'
  import Auth from '@/javascript/Api/Auth'
  import BusinessDetails from '@/javascript/Api/BusinessDetails';
  import Swal from 'sweetalert2'
import { Loading } from 'element-ui';
import Shops from '@/javascript/Api/Shops';
import RolesPriviledge from '@/javascript/Api/RolesPriviledge';

  export default {
    components: {
      Card,
      AppNavbar,
      AppFooter,
      [Checkbox.name]: Checkbox,
      [Button.name]: Button
    },
    methods: {
      toggleNavbar() {
        document.body.classList.toggle('nav-open')
      },
      closeMenu() {
        document.body.classList.remove('nav-open')
        document.body.classList.remove('off-canvas-sidebar')
      },

      checkDetails(){
        BusinessDetails.details().then((result) => {
          this.getDetails = result.data
        })
      },

      saveDetails(){
        BusinessDetails.create(this.details).then((result) => {
          location.reload()
        })
      },

      login() {
        this.loading = true
        if(this.form.phone != null && this.form.password != null){
          Auth.login(this.form).then((result) =>{
            Shops.set_shop_state(result.data.data.shop)
            //admin go here
            localStorage.setItem("token", result.data.data['access_token'])
            localStorage.setItem('role', result.data.data['user']['role']['id'])
            if(result.data.data['user']['role']['id'] == 1){
              window.location.href = "/admin/overview"
            }else{
              //role 3 go here
              window.location.href = "/sales-point"
            }
            this.loading = false

            
            // this.$router.push({name:'dashboard'})
          }).catch((err) => {
            this.loading = false
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: "Authentication details incorrect!",
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000
            })
          });
        }else{
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: "Authentication details incorrect!",
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000
            })
        }
      },
    },

    data() {
      return {
        form: {
          phone: '',
          password: '',
        },
        message:null,
        details:{
          name:'',
          logo:"",
          email:'',
          website:'',
          phone_one:'',
          phone_two:'',
          motto:'',
          vat:'',
          status:'active',
        },
        getDetails:[],
        componentKey:0,
        loading: false
      }
    },
    created() {
      this.checkDetails()
    },
    beforeDestroy() {
      this.closeMenu()
    }
  }
</script>
<style>
</style>
