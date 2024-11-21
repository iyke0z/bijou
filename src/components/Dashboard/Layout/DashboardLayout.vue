<template>
  <div class="wrapper">

    <side-bar :key="sideKey" type="sidebar" :sidebar-links="$sidebar.sidebarLinks">
      <user-menu></user-menu>
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar">
        
      </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss">

</style>
<script>
  import TopNavbar from './TopNavbar.vue'
  import ContentFooter from './ContentFooter.vue'
  import DashboardContent from './Content.vue'
  import UserMenu from '@/components/UIComponents/SidebarPlugin/UserMenu.vue'
  import User from '@/javascript/Api/User'

  export default {
    components: {
      TopNavbar,
      ContentFooter,
      DashboardContent,
      UserMenu,
    },
    data() {
      return {
        user:null,
        sideKey:0
      }
    },
    methods: {
      toggleSidebar () {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false)
        }
      },
    },
    created(){
      // this.sideKey++
    }
  }

</script>
