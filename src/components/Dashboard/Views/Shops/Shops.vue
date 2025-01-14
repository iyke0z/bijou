<template>
    <div class="table-responsive"><br>
    <div class="loader" v-if="loading"></div>
    <h3>Manage Shops</h3>

      <button class="btn btn-info" @click.prevent="openModal('New Role', 'create')">Create New Shop</button>
       <div v-if="!loading">
         <table id="table" class="table table-striped">
           <thead>
             <tr>
               <th></th>
               <th>Title</th>
               <th>Address</th>
               <th>Status</th>
               <th>Contact Person</th>
               <th>Phone Number</th>
               <th>Actions</th>
             </tr>
           </thead>
           <tbody :key="tableKey">
              <tr v-for="(shop, index) in shops" :key="shop.id" >
                <td>{{index+1}}</td>
                <td>{{shop.title}}</td>
                <td>{{shop.address}}</td>
                <td>{{shop.status}}</td>
                <td>{{shop.contact_person}}</td>
                <td>{{shop.phone_number}}</td>
                <td>
                    <p-button class="mr-1" title="update" type="info" size="sm" icon @click.native="openModal(`Update ${shop.title}`, 'update', shop)">
                    <i class="fa fa-wrench"></i>
                  </p-button>
                  <p-button class="mr-1" title="set state" type="warning" size="sm" icon @click.native="switchShop(shop)">
                    <i class="fa fa-refresh"></i>
                  </p-button>
                  <p-button class="mr-1" title="delete" type="danger" size="sm" icon @click.prevent="deleteShop(shop)">
                    <i class="fa fa-trash"></i>
                  </p-button>
                </td>
              </tr>
           </tbody>
         </table>
      </div>
      <div v-else>
        <span class="loader"></span>
      </div>
           <!-- update modal -->
           <Modal :show.sync="modalOpen" headerClasses="justify-content-center">
            <h4 slot="header" class="title title-up" >{{ modalTitle }}</h4>
              <div >
                <form @submit.prevent="modalAction === 'create' ? create() : update()">
                    <div class="form-group">
                      <label for="">Name</label>
                      <input type="text" v-model="title" class="form-control" required>
                    </div>
                    <div class="form-group">
                      <label for="">Address</label>
                      <input type="text" v-model="address" class="form-control" required>
                    </div>
                    <div class="form-group">
                      <label for="">Contact Person</label>
                      <input type="text" v-model="contact_person" class="form-control" required>
                    </div>
                    <div class="form-group" v-if="updateMode">
                      <label for="">Status</label>
                    <select class="form-control" v-model="status" id="">
                        <option value="active">Active</option>
                        <option value="inactive">In-active</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label for="">Shop Phone</label>
                      <input type="text" v-model="phone_number" class="form-control" required>
                    </div>
                    
                    <div class="form-group">
                      <button type="submit" class="btn btn-success"> <span v-if="updateMode">Update</span> <span v-else>Submit</span></button>
                    </div>
                </form>
              </div>

            <template slot="footer">
            <p-button type="default"  link @click.prevent="modalOpen = false" v-if="!loading">Close</p-button> <span class="loader" v-if="loading"></span>
            </template>
           </Modal>
    </div>
  </template>
  <script setup>
    import { onMounted, ref } from 'vue';
    import Modal from '@/components/UIComponents/Modal.vue';
    import Swal from 'sweetalert2';
    import Shops from '@/javascript/Api/Shops';

    const shops = ref()
    const updateMode = ref(false)
    const loading = ref(false)
    const tableKey = ref(0)
    const modalTitle = ref()
    const modalAction = ref()
    const assignPriviledgeMode = ref(false)
    const title = ref()
    const address = ref()
    const contact_person = ref()
    const phone_number = ref()
    const selectedShop = ref()
    const status = ref('active')
    const modalOpen = ref(false)

    const getShops = async () => {
        loading.value = true
       const {status, data}= await Shops.get_shops()
       if(status == 200 || status === 201){
         shops.value = data.data
         loading.value = false  
        }
        
        datatable()
    }

    const deleteShop = async(shop) => {
        const {status, data} = await Shops.delete_shop(shop.id)
        if(status == 200 || status === 201){
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Shop deleted successfully',
                showConfirmButton: false,
                timer: 1500
            })
            getShops()
        }else{
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Error deleting shop',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    const create = async() => {
        loading.value = true
        const {status, data} = await Shops.create_shop({
            title: title.value,
            address: address.value,
            contact_person: contact_person.value,
            status: "active",
            phone_number: phone_number.value    
        })
        if(status == 200 || status === 201){
         shops.value = data.data
         loading.value = false  
            title.value = null
            address.value = null
            contact_person.value = null
            phone_number.value = null    

         Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Shop created successfully',
            showConfirmButton: false,
            timer: 1500
         })
         modalOpen.value = false
         getShops()
window.location.reload()

       }else{
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Error creating shop',
            showConfirmButton: false,
            timer: 1500
        })
       }

    }

    const openModal = (header, action, item) => {
        modalTitle.value = header;
        modalAction.value = action;
        modalOpen.value = true;

        if (action === 'update') {
            selectedShop.value = item
            updateMode.value = true
            title.value = item.title
            address.value = item.address
            contact_person.value = item.contact_person
            phone_number.value = item.phone_number    

        }
    };

    const update = async() => {
        console.log()
        loading.value = true
        const {status, data} = await Shops.update_shop({
            title: title.value,
            address: address.value,
            contact_person: contact_person.value,
            status: "active",
            phone_number: phone_number.value    
        }, selectedShop.value.id)
        if(status == 200 || status === 201){
            shops.value = data.data
            loading.value = false  
            title.value = null
            address.value = null
            contact_person.value = null
            phone_number.value = null    

         Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Shop updated successfully',
            showConfirmButton: false,
            timer: 1500
         })
         modalOpen.value = false
         getShops()
window.location.reload()

       }else{
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Error updating shop',
            showConfirmButton: false,
            timer: 1500
        })
       }
    }   

    const switchShop = (shop) => {
        Shops.set_shop_state(shop)
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Success',
            showConfirmButton: false,
            timer: 1500
         })
    }
    

    const datatable = () => {
        

          $(function() {
            $('#table').DataTable({
              dom: 'Bfrtip',
            buttons: ['excel', 'pdf', 'print'],
              "bDestroy": true,
                  pageLength: 5,
                  lengthMenu: [[5,10,20], [5, 10, 20]],
              });
          });
    }


    onMounted(() => {
      getShops()
    })  
  </script>
  
  