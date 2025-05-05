<template>
  <div class="table-responsive"><br>
    <h3>Users </h3>
    <span v-if="loading" class="loader"></span>
   
    <table id="table" class="table table-striped">
      <thead>
        <tr>
          <th></th>
          <th>Fullname</th>
          <th>Telephone</th>
          <th>Email Address</th>
          <th>Role</th>
          <th>Shop</th>
          <th>Code</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody :key="tableKey">
        <tr v-for="(user, index) in all_users" :key="user.id">
          <td>{{index+1}}</td>
          <td>{{user.fullname}}</td>
          <td>{{user.phone}}</td>
          <td>{{user.email}}</td>
          <td>{{user.role.name}}</td>
          <td>{{user.shop.title}}</td>
          <td v-if="user.access_code != null">{{user.access_code.code}}</td>
          <td v-else>null</td>
          <td>
            <p-button class="mr-2" title="details" type="warning" size="sm" icon @click.prevent="goToRoute(user)">
              <i class="fa fa-eye"></i>
            </p-button>
            <p-button class="mr-2" title="gen code" type="primary" size="sm" icon @click.prevent="generateCode(user.id)">
              <i class="fa fa-user"></i>
            </p-button>
            <p-button class="mr-2" title="update" type="info" size="sm" icon @click.prevent="goToUpdate(user)">
              <i class="fa fa-edit"></i>
            </p-button>
            <!-- <p-button class="mr-2" title="delete" type="danger" size="sm" icon @click.prevent="delete_user(user)">
              <i class="fa fa-trash"></i>
            </p-button> -->
            <p-button class="mr-2" title="manage shops user can access" type="secondary" size="sm" icon @click.prevent="openModal('Manage Shop Access', user)">
              <i class="fa fa-home  "></i>
            </p-button>
          </td>
        </tr>
      </tbody>
    </table>
    <Modal :show.sync="modalOpen" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up">{{ modalTitle }}</h4>
      <div>
        <p>Select Shops to Assign:</p>
        <ol>
          <li v-for="shop in shops" :key="shop.id">
            {{ shop.title }}:
            <input 
              type="checkbox" 
              :value="shop.id" 
              :checked="getChecked(shop.id)" 
              @change="updateShopSelection(shop.id, $event)"
            />
          </li>
        </ol>
        <button @click="assignPrivileges()" class="btn btn-success">Assign</button>
              </div>
      <template slot="footer">
        <p-button type="default" link @click.prevent="modalOpen = false">Close</p-button>
      </template>
    </Modal>


  </div>
</template>
<script>
  import { Modal } from '@/components/UIComponents'
import Shops from '@/javascript/Api/Shops';
  import User from '@/javascript/Api/User'
  import Swal from 'sweetalert2'

  export default{
     components: {
      Modal
    },
    data() {
      return {
        updateMode:false,
        all_users:null,
        filter:1,
        tableKey:0,
        user:null,
        all_users: null,
        loading: false,
        shops:null,
        modalTitle:null,
        modalAction:null,
        selectedUser:null,
        modalOpen:false,
        selectedShops: [], // Stores selected shop IDs,
        shopsToAdd: [],
        shopsToRemove: [],


      }
    },
    methods: {
      openModal(title, user){
        this.modalOpen = true
        this.modalTitle = title
        this.selectedUser = user
      
      },
      goToRoute(user){
        this.$router.push('/user/details/'+user.id)
      },
      goToUpdate(user){
        this.$router.push('/user/update/'+user.id)
      },
      generateCode(user){
        this.loading = true

        var post = {"user_id":user}
        User.generate_code(post).then(result => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: "Code Generated",
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.allUsers()
        this.loading = false

        }).catch((err) => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: err?.response?.data?.error ?? err.response.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
        this.loading = false

        });
        
      },
      delete_user(user){
        this.loading = true

        User.delete(user.id).then((result) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.allUsers()
        this.loading = false

        }).catch((err) => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: err?.response?.data?.error ?? err.response.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
        this.loading = false

        });
      },

      allUsers(){
        this.loading = true
        User.all_users().then((result) => {
            this.all_users = result.data.data
            this.tableKey++
            this.datatable()
            this.loading = false
        }).catch(() => {this.loading = false})
      },

      datatable(){
        $(function() {
          $('#table').DataTable({
            "bDestroy": true,
                pageLength: 5,
                lengthMenu: [[5,10,20], [5, 10, 20]],
            });
        });
      },

      getChecked(shopId) {
        if (!this.selectedUser?.shop_access) return false;

        return this.selectedUser.shop_access.some(shop => shop.shop_id === shopId);
      },

          filter_table(){
                if(this.filter == 1){
                    this.all_users = this.all_users
                    this.api_refresh()
                }else if(this.filter == 2){
                    this.all_users = this.active_users
                    this.api_refresh()
                }else if(this.filter == 3){
                    this.all_users = this.inactive_users
                    this.api_refresh()
                } else if(this.filter == 4){
                  this.all_users = this.banned_users
                  this.api_refresh()
                } else{
                   this.all_users = this.vip_users
                   this.api_refresh()
                }
          },
        api_refresh(){
            this.allUsers()
        },
        getShops(){
          Shops.get_shops().then(res => {
            this.shops = res.data.data
          })
        },
      
        assignShops(user) {
    if (!this.selectedShops.length) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: "No shop selected!",
        customClass: 'Swal-wide',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }
  },
    updateShopSelection(shopId, event) {
    if (event.target.checked) {
      // If checked, add to shopsToAdd and remove from shopsToRemove if it exists
      if (!this.shopsToAdd.includes(shopId)) {
        this.shopsToAdd.push(shopId);
      }
      this.shopsToRemove = this.shopsToRemove.filter(id => id !== shopId);
    } else {
      // If unchecked, add to shopsToRemove and remove from shopsToAdd if it exists
      if (!this.shopsToRemove.includes(shopId)) {
        this.shopsToRemove.push(shopId);
      }
      this.shopsToAdd = this.shopsToAdd.filter(id => id !== shopId);
    }
  },
  
  // This method handles the assignment logic
  assignPrivileges() {
    const payload = {
      userId: this.selectedUser.id,
      shopsToAdd: this.shopsToAdd,
      shopsToRemove: this.shopsToRemove,
    };

    // Call API to assign privileges
    Shops.assign_shops(payload, this.selectedUser.id)
      .then(response => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: response.data.message,
          customClass: 'Swal-wide',
          showConfirmButton: false,
          timer: 3000
        });
        // Refresh shops or user data as needed
        this.allUsers();
        this.modalOpen = false;
      })
      .catch(err => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: err?.response?.data?.error ?? err.response.data.message,
          customClass: 'Swal-wide',
          showConfirmButton: false,
          timer: 3000
        });
      });


  },
    },
    created(){
      this.allUsers()
      this.getShops()
    }

  }
</script>
