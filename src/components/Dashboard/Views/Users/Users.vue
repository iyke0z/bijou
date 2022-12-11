<template>
  <div>
    <h3>Users</h3>
     <div>
      <center>
        <label class="mr-2">Filter Table </label>
        <select @change="filter_table()" v-model="filter">
            <option value="1">All</option>
            <option value="2">Active</option>
            <option value="3">Inactive</option>
            <option value="4">Banned Users</option>
            <option value="5">VIP Users</option>
        </select>
      </center>
    </div>
    <table id="table" class="table table-striped">
      <thead>
        <tr>
          <th></th>
          <th>Fullname</th>
          <th>Telephone</th>
          <th>Email Address</th>
          <th>Role</th>
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
          <td>{{user.access_code.code}}</td>
          <td>
            <p-button class="mr-2" title="details" type="warning" size="sm" icon @click.prevent="goToRoute(user)">
              <i class="fa fa-eye"></i>
            </p-button>
            <p-button class="mr-2" title="update" type="info" size="sm" icon @click.prevent="goToUpdate(user)">
              <i class="fa fa-edit"></i>
            </p-button>
            <p-button class="mr-2" title="delete" type="danger" size="sm" icon @click.prevent="delete_user(user)">
              <i class="fa fa-trash"></i>
            </p-button>
            <p-button class="mr-2" title="assign priviledge" type="secondary" size="sm" icon @click.prevent="assign_priviledge(user)">
              <i class="fa fa-refresh"></i>
            </p-button>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>
<script>
  import { Modal } from '@/components/UIComponents'
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
      }
    },
    methods: {
      openModal(type, title, action, user){
        this.modalTitle = title
        this.modals[type] = true
        this.modalAction = action
        this.passenger = user
        if(action == 'deactivate'){
          this.modalContent = "Are you sure you want to deactivate this user?"
        }
        if(action == 'deactivate'){
          this.modalContent = "Are you sure you want to activate this user?"
        }
        if(action == 'ban'){
          this.form.user_id = user.id
          this.modalContent = "Are you sure you want to ban this user?"
        }
        if(action == 'unban'){
          this.passenger = user.id
          this.modalContent = "Are you sure you want to remove ban?"
        }
        if(action == 'details'){
          this.passenger_resource(user.id)
        }
      },
      goToRoute(user){
        this.$router.push('/user/details/'+user.id)
      },
      goToUpdate(user){
        this.$router.push('/user/update/'+user.id)
      },
      delete_user(user){
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
        }).catch((err) => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
        });
      },

      allUsers(){
        User.all_users().then((result) => {
            this.all_users = result.data.data
            this.tableKey++
            this.datatable()
        })
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
    },
    created(){
      this.allUsers()
    }

  }
</script>
