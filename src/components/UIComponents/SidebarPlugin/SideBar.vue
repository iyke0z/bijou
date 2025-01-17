<template>
  <div class="sidebar"
       :data-color="backgroundColor"
       :data-active-color="activeColor">
    <div class="logo">
      <a class="simple-text logo-mini"
         aria-label="sidebar mini logo"
         href="#">
          <div class="logo-img">
              <img :src="logo" alt="">
          </div>
      </a>
      <a class="simple-text logo-normal">
          {{ details?.name }} <br/>
          <small> {{ currentShopName }}</small>
      </a>
    </div>
    <div class="sidebar-wrapper" ref="sidebarScrollArea">
      <slot></slot>
      <ul class="nav">
        <slot name="links">
          <sidebar-item v-for="(link, index) in dynamicSidebarLinks"
                        :key="link.name + index"
                        :link="link">
            <sidebar-item v-for="(subLink, subIndex) in link.children"
                          :key="subLink.name + subIndex"
                          :link="subLink">
            </sidebar-item>
          </sidebar-item>
        </slot>
      </ul>
    </div>
  </div>
</template>

<script>
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import Details from '@/javascript/Api/BusinessDetails'
import getMenu from '../../../sidebarLinks'

export default {
  props: {
    title: {
      type: String,
      default: 'Business Management Solution',
    },
    backgroundColor: {
      type: String,
      default: 'black',
      validator: (value) => ['white', 'brown', 'gabblue', 'black', 'armyred', 'danger'].includes(value),
    },
    activeColor: {
      type: String,
      default: 'info',
      validator: (value) => ['primary', 'info', 'success', 'warning', 'danger'].includes(value),
    },
    logo: {
      type: String,
      default: '/static/img/shoppingCart.png',
    },
    sidebarLinks: {
      type: Array,
      default: () => [],
    },
    autoClose: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      details: null,
      currentShopName: null,
      currentShopId: null,
      dynamicSidebarLinks: [], // New data property for dynamic menu links
    }
  },
  provide() {
    return {
      autoClose: this.autoClose,
    }
  },
  methods: {
    getDetails() {
      Details.details().then((result) => {
        this.details = result.data
      })
    },
    async initScrollBarAsync() {
      const isWindows = navigator.platform.startsWith('Win')
      if (!isWindows) {
        return
      }
      const PerfectScroll = await import('perfect-scrollbar')
      // PerfectScroll.initialize(this.$refs.sidebarScrollArea)
    },
    async fetchMenuLinks() {
      this.dynamicSidebarLinks = await getMenu() // Fetch and store menu links
    },
  },
  async mounted() {
    await this.initScrollBarAsync()
    this.getDetails()
    this.currentShopName = localStorage.getItem('shopName')
    await this.fetchMenuLinks() // Fetch menu links after mounting
  },
  beforeDestroy() {
    if (this.$sidebar.showSidebar) {
      this.$sidebar.showSidebar = false
    }
  },
}
</script>

<style>
  @media (min-width: 992px) {
    .navbar-search-form-mobile,
    .nav-mobile-menu {
      display: none;
    }
  }
</style>
