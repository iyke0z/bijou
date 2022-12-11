<template>
  <div class="user">
    <div class="photo">
      <img src="/static/img/imageholder.jpg" alt="user avatar"/>
    </div>
    <div class="info">
      <a data-toggle="collapse" :aria-expanded="!isClosed" @click.prevent="toggleMenu">
         <span v-if="user != null">
           {{ user.fullname }} <br />
        </span>
      </a>
      <div class="clearfix"></div>

    </div>
  </div>
</template>
<script>
  import { CollapseTransition } from 'vue2-transitions'
  import User from '@/javascript/Api/User'
  export default {
    components: {
      CollapseTransition
    },
    data() {
      return {
        isClosed: true,
        user: null,
      }
    },
    methods: {
      toggleMenu() {
        this.isClosed = !this.isClosed
      },
      getAuth(){
          User.auth().then((result)=>{
            this.user = result.data
          })
      },

    },
    mounted(){
      this.getAuth()
    }
  }
</script>
<style scoped>
  .nav.nav-menu {
    margin-top: 0;
  }
</style>
