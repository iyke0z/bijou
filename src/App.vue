<template>
  <div :class="{'nav-open': $sidebar.showSidebar}">
    <notifications transition-name="notification-list" transition-mode="out-in">
    </notifications>
    <router-view name="header"></router-view>
    <transition name="fade"
                mode="out-in">
      <router-view></router-view>
    </transition>
    <router-view name="footer"></router-view>
  </div>
</template>

<script>
  // Loading some plugin css asynchronously
  import 'sweetalert2/dist/sweetalert2.css'
  import 'vue-notifyjs/themes/default.css'
  export default {}
</script>
<style>
 .loader {
    width: 18px;
    height: 18px;
    border: 5px solid #FFF;
    border-bottom-color: black;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    }
  
    @keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
  } 
  
  .rotate-360 {
    transform: rotate(180deg);
    transition: transform 0.5s;
  }
  .rotate-0 {
    transform: rotate(0deg);
    transition: transform 0.5s;
  }
</style>
