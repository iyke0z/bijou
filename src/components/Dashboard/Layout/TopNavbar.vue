<template>
  <navbar v-model="showNavbar">
    <div class="navbar-wrapper">
      <div class="navbar-minimize">
        <button id="minimizeSidebar" class="btn btn-icon btn-round" @click.prevent="minimizeSidebar">
          <i class="nc-icon nc-minimal-right text-center visible-on-sidebar-mini"></i>
          <i class="nc-icon nc-minimal-left text-center visible-on-sidebar-regular"></i>
        </button>
      </div>
      <div class="navbar-toggle">
        <navbar-toggle-button @click.native="toggleSidebar">

        </navbar-toggle-button>
      </div>
      <a class="navbar-brand zoom-element" href="/business/billing">
  {{details?.name}}
  <!-- <span class="d-block text-wrap"> -->
    <span
      v-if="expiry_response[0] == 'expired'"
      class="text-white bg-danger px-2 py-2 d-inline-block"
    >
      Subscription Expired, 
      <small class="text-light">Click to subscribe</small>
    </span>
    <span
      v-if="expiry_response[0] == 'active'"
      class="text-light bg-success px-2 py-2 d-inline-block"
    >
      Subscription Active 

    </span>
    <span
      v-if="expiry_response[0] == 'expires_today'"
      class="text-light bg-danger px-2 py-2 d-inline-block"
    >
      Subscription Expires Today <small class="text-light">Click to renew</small>
    </span>
    <span
      v-if="expiry_response[0] == 'expires_tomorrow'"
      class="text-dark bg-info px-2 py-2 d-inline-block"
    >
      Subscription Expiring Tomorrow <small class="text-light">Click to renew</small>
    </span>
    <span
      v-if="expiry_response[0] == 'expires_in_two_days'"
      class="text-dark bg-warning px-2 py-2 d-inline-block"
    >
      Subscription Expiring In Two Days <small class="text-light">Click to renew</small>
    </span>
  <!-- </span> -->
</a>


    </div>

    <template slot="navbar-menu">
      
      <ul class="navbar-nav">
       
        <li class="nav-item">
          <a class="nav-link btn-rotate bg-danger text-light" href="#" @click.prevent="logout">
            <i class="fa fa-power-off" aria-hidden="true"></i>
          </a>
        </li>
      </ul>
    </template>
  </navbar>
</template>
<script>
  import { Navbar, NavbarToggleButton } from '@/components/UIComponents'
  import Auth from '@/javascript/Api/Auth'
  import Details from '@/javascript/Api/BusinessDetails'

  export default {
    components: {
      Navbar,
      NavbarToggleButton
    },
    data() {
      return {
        activeNotifications: false,
        showNavbar: false,
        details:null,
        expiry_response: null,
    
      }
    },
    methods: {
      business_details(){
        Details.details().then((result) => {
          this.details = result.data
        })
      },
      capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      },
      toggleNotificationDropDown() {
        this.activeNotifications = !this.activeNotifications
      },
      closeDropDown() {
        this.activeNotifications = false
      },
      toggleSidebar() {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar)
      },
      hideSidebar() {
        this.$sidebar.displaySidebar(false)
      },
      minimizeSidebar() {
        this.$sidebar.toggleMinimize()
      },
      toggleNavbar() {
        this.showNavbar = !this.showNavbar;
      },

      logout(){
        Auth.logout().then(() => {
          localStorage.clear()
          this.$router.push({name:'Login'})
        })
      },

      getExpiry(){
        Auth.get_expiry().then((result) => {
          this.expiry_response = result.data.data
          localStorage.setItem('packageId', result.data.data[1]?.package_id)

        })
      }
    },

    created(){
      this.business_details()
      this.getExpiry()


    }
  }

</script>
<style>
@keyframes zoomInOut {
  0% {
    transform: scale(1); /* Initial size */
  }
  50% {
    transform: scale(0.97); /* Zoom in */
  }
  100% {
    transform: scale(1); /* Zoom out back to initial size */
  }
} 

.zoom-element {
  animation: zoomInOut 4s ease-in-out infinite; /* Continuous animation */
}

</style>
