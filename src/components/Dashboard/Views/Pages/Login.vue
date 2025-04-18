<template>
  <div class="login-page" :key="componentKey">
    <app-navbar></app-navbar>
    <div class="wrapper wrapper-full-page">
      <div class="full-page login-page section-image">
        <!--   you can change the color of the filter page using: data-color="blue | azure | green | orange | red | purple" -->
        <div class="content">
          <div class="container">
            <div v-if="getDetails == []">
              <center>
                <div v-if="currentStep === 1 && getDetails.length === 0">
      <h3 class="header text-center text-light">Step 1: Business Setup</h3>
      <form @submit.prevent="saveDetails">
        <div class="form-group">
          <label class="text-light" for="business-name">Business Name *</label>
          <input
            type="text"
            id="business-name"
            class="form-control col-6"
            v-model="details.name"
            required
            placeholder="Business Name..."
          />
        </div>

        <div class="form-group">
          <label class="text-light" for="email">Email Address (Optional)</label>
          <input
            type="email"
            id="email"
            class="form-control col-6"
            v-model="details.email"
            placeholder="Email Address..."
          />
        </div>

        <div class="form-group">
          <label class="text-light" for="website">Website (Optional)</label>
          <input
            type="text"
            id="website"
            class="form-control col-6"
            v-model="details.website"
            placeholder="Website..."
          />
        </div>

        <div class="form-group">
          <label class="text-light" for="phone-one">Phone Number 1 *</label>
          <input
            type="text"
            id="phone-one"
            class="form-control col-6"
            v-model="details.phone_one"
            required
            placeholder="Phone Number 1..."
          />
        </div>

        <div class="form-group">
          <label class="text-light" for="phone-two">Phone Number 2 (Optional)</label>
          <input
            type="text"
            id="phone-two"
            class="form-control col-6"
            v-model="details.phone_two"
            placeholder="Phone Number 2..."
          />
        </div>

        <div class="form-group">
          <label class="text-light" for="motto">Motto (Optional)</label>
          <input
            type="text"
            id="motto"
            class="form-control col-6"
            v-model="details.motto"
            placeholder="Motto..."
          />
        </div>

        <div class="form-group">
          <label class="text-light" for="vat">VAT *</label>
          <input
            type="number"
            id="vat"
            step="any"
            class="form-control col-6"
            v-model="details.vat"
            required
            placeholder="VAT..."
          />
        </div>

        <div class="form-group">
          <button type="submit" class="btn btn-warning mb-3 col-sm-6">
            Create
          </button>
        </div>
      </form>
                </div>

                <!-- Step 2: Admin Account Creation -->
                <div v-if="currentStep === 2 || getDetails.length !== 0 && userCount === 0">
                  <h3 class="header text-center text-light">Step 2: Admin Account Creation</h3>
                  <form @submit.prevent="createAdmin">
                    <div class="form-group">
                      <label class="text-light" for="fullname">Full Name *</label>
                      <input
                        type="text"
                        id="fullname"
                        class="form-control col-6"
                        v-model="admin.fullname"
                        required
                        placeholder="Full Name..."
                      />
                    </div>

                    <div class="form-group">
                      <label class="text-light" for="admin-email">Email *</label>
                      <input
                        type="email"
                        id="admin-email"
                        class="form-control col-6"
                        v-model="admin.email"
                        required
                        placeholder="Email..."
                      />
                    </div>

                    <div class="form-group">
                      <label class="text-light" for="phone">Phone *</label>
                      <input
                        type="text"
                        id="phone"
                        class="form-control col-6"
                        v-model="admin.phone"
                        required
                        placeholder="Phone..."
                      />
                    </div>

                    <div class="form-group">
                      <label class="text-light" for="address">Address *</label>
                      <input
                        type="text"
                        id="address"
                        class="form-control col-6"
                        v-model="admin.address"
                        required
                        placeholder="Address..."
                      />
                    </div>

                    <div class="form-group">
                      <label class="text-light" for="password">Password *</label>
                      <input
                        type="password"
                        id="password"
                        class="form-control col-6"
                        v-model="admin.password"
                        required
                        placeholder="Password..."
                      />
                    </div>

                    <div class="form-group">
                      <label class="text-light" for="dob">Date of Birth *</label>
                      <input
                        type="date"
                        id="dob"
                        class="form-control col-6"
                        v-model="admin.dob"
                        required
                      />
                    </div>

                    <div class="form-group">
                      <label class="text-light" for="gender">Gender *</label>
                      <select id="gender" class="form-control col-6" v-model="admin.gender" required>
                        <option value="">Select Gender...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>

                    <div class="form-group">
                      <button type="submit" class="btn btn-warning mb-3 col-sm-6">
                        Create Admin Account
                      </button>
                    </div>
                  </form>
                </div>
              </center>
            </div>
            <div class="col-lg-4 col-md-6 ml-auto mr-auto"  v-if="getDetails != [] &&  userCount > 0">
              <form @submit.prevent="login">
                <card type="login">
                  <h3 slot="header" class="header text-center">Login</h3>

                  <fg-input v-model="form.phone"  addon-left-icon="nc-icon nc-single-02"
                            required placeholder="Phone Number"></fg-input>

                  <fg-input v-model="form.password" addon-left-icon="nc-icon nc-key-25" placeholder="Password"
                            required type="password"></fg-input>
                  <br>
                  <button type="submit" style="cursor:pointer" class="btn btn-black mb-3 col-sm-12">Login<span v-if="loading" class="loader"></span></button>
                </card>
              </form>
            </div>
          </div>
        </div>
        <app-footer></app-footer>
        <div class="full-page-background" style="background-image: url(static/img/background.jpg) "></div>
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
      getUsers(){
        BusinessDetails.get_users().then((result) => {
          this.userCount = result.data
        })
      },
      goToStep(step) {
      this.currentStep = step;
    },
      saveDetails(){
        BusinessDetails.create(this.details).then((result) => {
          this.goToStep(2)
          
          // location.reload()
        })
      },

      createAdmin(){
        BusinessDetails.create_user(this.admin).then((res) => {
          if (res.status == 200) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Admin account created successfully!',
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000
            })
            
            location.reload()

          } else {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'An error occurred!',
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000
            })
            
          }
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
          motto:'Personalized shopping experience',
          vat:0,
          status:'active',
        },
        currentStep: 1,
        admin: {
          fullname: '',
          email: '',
          phone: '',
          address: '',
          role_id: 1,
          password: '',
          picture:"",
          dob: '',
          gender: '',
          shop_id: 1, // Default value, not shown in the form
        },
        getDetails:[],
        componentKey:0,
        loading: false,
        userCount:0
      }
    },
    created() {
      this.checkDetails()
      this.getUsers()
    },
    beforeDestroy() {
      this.closeMenu()
    }
  }
</script>
<style>
</style>
