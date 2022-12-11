<template>
  <footer class="footer footer-black footer-white">
    <div class="container-fluid">
      <div class="row">
        <nav class="footer-nav">
          <ul>
            <li>
              <a href="https://www.ikebeelion.com" target="_blank" rel="noopener">ikebeelion</a><br>
              08147082856
            </li>
          </ul>
        </nav>
        <div class="credits ml-auto">
          <div class="copyright">
            IK.B.N &copy; {{ date }}
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
import helpers from '@/javascript/helpers';
  export default {
    name: 'main-footer',
    data() {
      return {
        date:null
      }
    },
    methods: {
      current_date(){
        const d = new Date()
        this.date = d.getFullYear();
      },
    },

    created() {
      this.current_date()
    },
  }
</script>
<style>
</style>
