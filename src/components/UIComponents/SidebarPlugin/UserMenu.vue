<template>
  <div class="user">
    <div class="photo">
      <img src="/static/img/imageholder.jpg" alt="user avatar" />
    </div>
    <div class="info">
      <a data-toggle="collapse" :aria-expanded="!isClosed" @click.prevent="toggleMenu">
        <span v-if="user">
          {{ user.fullname }} <br /><br />
          <small>
            <select
              class="form-control bg-dark text-white"
              v-model="selectedShop"
              @change="setShop"
            >
              <option :value="{ title: 'All', id: 0 }" v-if="role == 1">All</option>
              <option
                v-for="shop in user.shop_access"
                :key="shop.id"
                :value="{ title: shop.shop.title, id: shop.shop.id }"
              >
                {{ shop.shop.title }}
              </option>
            </select>
          </small>
        </span>
      </a>
      <!-- <small> -->
        <!-- <a href="#" style="text-decoration: none;" class="text-white" v-if="role == 1"  data-toggle="collapse" :aria-expanded="!isClosed">
          <i class="fa fa-bank"></i>: &#8358; {{balance.toLocaleString()}} 
        </a> -->
      <!-- </small> -->
      
        
      <div class="clearfix"></div>
    </div>
  </div>
</template>

<script>
import { CollapseTransition } from "vue2-transitions";
import User from "@/javascript/Api/User";
import Reports from "@/javascript/Api/Reports";

export default {
  components: {
    CollapseTransition,
  },
  data() {
    return {
      isClosed: true,
      user: null,
      selectedShop: {
        title: "All",
        id: 0,
      },
      balance: 0,
      currentShopId: null,
      currentName: null,
      role:null
    };
  },
  methods: {
    toggleMenu() {
      this.isClosed = !this.isClosed;
    },
    getBankBalance(){
      Reports.get_account_balance().then(res => {
        this.balance = res.data.data
      })
    },
    getAuth() {
      User.auth()
        .then((result) => {
          this.user = result.data;
          localStorage.setItem('authUser', result.data.id)

        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
        });
    },
    setShop() {
      if (this.selectedShop) {
        localStorage.setItem("shopId", this.selectedShop.id);
        localStorage.setItem("shopName", this.selectedShop.title);
        this.currentShopId = this.selectedShop.id;
        this.currentName = this.selectedShop.title;
        window.location.reload()
      }
    },
  },
  mounted() {
    this.getAuth();
    const storedShopId = localStorage.getItem("shopId");
    const storedShopName = localStorage.getItem("shopName");

    this.selectedShop.id = storedShopId ? parseInt(storedShopId) : 0;
    this.selectedShop.title = storedShopName || "All";
    this.role = localStorage.getItem("role")
    this.getBankBalance()
  },
};
</script>

<style scoped>
.nav.nav-menu {
  margin-top: 0;
}
</style>
