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
      <router-link class="navbar-brand zoom-element" to="/business/billing">
        {{ details?.name }}
        <span v-if="expiry_response != null" class="subscription-status">
          <span
            v-if="expiry_response[0] === 'expired'"
            class="text-danger px-2 py-2 d-inline-block expired-notification"
            @mouseover="showTooltip('Expired! Click to subscribe')" 
          >
            Subscription Expired
            <small class="text-black">Click to subscribe</small>
          </span>
          <span
            v-if="expiry_response[0] === 'active'"
            class="text-primary px-2 py-2 d-inline-block active-notification"
            @mouseover="showTooltip('Subscription is active!')" 
          >
            Subscription Active
          </span>
          <span
            v-if="expiry_response[0] === 'expires_today'"
            class="text-danger px-2 py-2 d-inline-block expires-today-notification"
            @mouseover="showTooltip('Expires Today! Click to renew')" 
          >
            Subscription Expires Today
            <small class="text-light">Click to renew</small>
          </span>
          <span
            v-if="expiry_response[0] === 'expires_tomorrow'"
            class="text-dark bg-info px-2 py-2 d-inline-block expires-tomorrow-notification"
            @mouseover="showTooltip('Expires Tomorrow! Click to renew')" 
          >
            Subscription Expiring Tomorrow
            <small class="text-light">Click to renew</small>
          </span>
          <span
            v-if="expiry_response[0] === 'expires_in_two_days'"
            class="text-dark bg-warning px-2 py-2 d-inline-block expires-in-two-days-notification"
            @mouseover="showTooltip('Expires in 2 days! Click to renew')" 
          >
            Subscription Expiring In Two Days
            <small class="text-light">Click to renew</small>
          </span>
        </span>
      </router-link>
    </div>

    <template slot="navbar-menu">
      <ul class="navbar-nav">
        <li class="nav-item">
          
          <a class="nav-link text-info mt-1" title="Api Dcoumentation" href="https://documenter.getpostman.com/view/13318427/2sB2izCsY1" target="_blank" @click.prevent="logout">
            <i class="fa fa-code text-info" aria-hidden="true"></i>Api
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-danger mt-1" title="sign out" href="#" @click.prevent="logout">
            <i class="fa fa-power-off text-danger" aria-hidden="true"></i>
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
        details: null,
        expiry_response: null,
        tooltipMessage: '',
        tooltipVisible: false
      }
    },
    methods: {
      business_details() {
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
        this.showNavbar = !this.showNavbar
      },
      logout() {
        Auth.logout().then(() => {
          localStorage.clear()
          this.$router.push({ name: 'Login' })
        })
      },
      getExpiry() {
        Auth.get_expiry().then((result) => {
          this.expiry_response = result.data.data
          localStorage.setItem('packageId', result.data.data[1]?.package_id)
        })
      },
      showTooltip(message) {
        this.tooltipMessage = message
        this.tooltipVisible = true
        setTimeout(() => {
          this.tooltipVisible = false
        }, 3000) // Hide tooltip after 3 seconds
      }
    },
    created() {
      this.business_details()
      this.getExpiry()
    }
  }
</script>

<style>
@keyframes zoomInOut {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.97);
  }
  100% {
    transform: scale(1);
  }
}

.zoom-element {
  animation: zoomInOut 4s ease-in-out infinite;
}

.subscription-status {
  font-weight: bold;
}

.subscription-status span {
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.subscription-status span:hover {
  transform: scale(1.05);
  cursor: pointer;
}

.expired-notification {
  background-color: #ffcccc;
  border-radius: 5px;
}

.active-notification {
  background-color: #cce5ff;
  border-radius: 5px;
}

.expires-today-notification {
  background-color: #f8d7da;
  border-radius: 5px;
}

.expires-tomorrow-notification {
  background-color: #d1ecf1;
  border-radius: 5px;
}

.expires-in-two-days-notification {
  background-color: #fff3cd;
  border-radius: 5px;
}

/* Tooltip style */
.tooltip {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 9999;
}
</style>
