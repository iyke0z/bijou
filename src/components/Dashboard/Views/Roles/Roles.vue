<template>
    <div class="table-responsive"><br>
      <h3>Manage Roles</h3>

      <button class="btn btn-info" @click.prevent="openModal('New Role', 'create')">Create New Role</button>
       <div v-if="!loading">
         <table id="table" class="table table-striped">
           <thead>
             <tr>
               <th></th>
               <th>Roles</th>
               <th>Actions</th>
             </tr>
           </thead>
           <tbody :key="tableKey">
              <tr v-for="(role, index) in roles" :key="role.id" >
                <td>{{index+1}}</td>
                <td>{{role.name}}</td>
                <td>
                    <p-button class="mr-1" title="update" type="info" size="sm" icon @click.native="openModal(role.name, 'assign', role)">
                    <i class="fa fa-wrench"></i>
                  </p-button>
                  <!-- <p-button class="mr-1" title="update" type="warning" size="sm" icon @click.native="openModal('View Detai', 'view', role)">
                    <i class="fa fa-eye"></i>
                  </p-button> -->
                  <p-button class="mr-1" title="delete" type="danger" size="sm" icon @click.prevent="deleteRole(role)">
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
            <h4 slot="header" class=" title title-up" v-show="assignPriviledgeMode">{{ modalTitle }}</h4>
            <h4 slot="header" class="title title-up" v-show="!updateMode">{{ modalTitle }}</h4>
              <div v-if="modalAction == 'create'">
                <form @submit.prevent="create">
                    <div class="form-group">
                      <label for="">Name</label>
                      <input type="text" v-model="name" class="form-control">
                    </div>
                    
                    <div class="form-group">
                      <button type="submit" class="btn btn-success">Submit</button>
                    </div>
                </form>
              </div>

              <ol v-if="modalAction == 'assign'">
                <li v-for="priviledge in priviledges" :key="priviledge.id">
                    {{ priviledge.name }}:
                    <input 
                    type="checkbox" 
                    @change="togglePrivilege(priviledge.id)"
                    :value="priviledge.name" 
                    :checked="checkAssignedPriviledge(priviledge.id, selectedRole)"
                    />
                </li>
                </ol>
                <button @click="assignPriviledges(selectedRole)"  v-if="modalAction == 'assign'" class="btn btn-success">Assign Priviledges</button>
            <template slot="footer">
            <p-button type="default" link @click.prevent="modalOpen = false">Close</p-button>
            </template>
           </Modal>
    </div>
  </template>
  <script setup>
    import { onMounted, ref } from 'vue';
    import RolesPriviledge from '@/javascript/Api/RolesPriviledge';
import Modal from '@/components/UIComponents/Modal.vue';
import Swal from 'sweetalert2';

    const roles = ref()
    const updateMode = ref(false)
    const loading = ref(false)
    const tableKey = ref(0)
    const modalTitle = ref()
    const modalAction = ref()
    const assignPriviledgeMode = ref(false)
    const modals = ref({
        classic : false
    })

    const modalOpen = ref(false)

    const name = ref()


    const getRoles = async () => {
        loading.value = true
       const {status, data}= await RolesPriviledge.roles()
       if(status == 200 || status === 201){
         roles.value = data
         loading.value = false  
         tableKey.value++
        }

        datatable()
    }

    const selectedRole = ref(null);


    const deleteRole = async(role) => {
        const {status, data} = await RolesPriviledge.delete_role(role.id)
        if(status === 200 || status === 201){
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Role deleted successfully',
                showConfirmButton: false,
                timer: 1500
            })
            getRoles()
        }else{
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Error deleting role',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    const create = async() => {
      try {
        loading.value = true
        const {status, data} = await RolesPriviledge.create_role([name.value])
        console.log(status)

        if(status == 200 || status === 201){
         roles.value = data
         loading.value = false  

         Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Role created successfully',
            showConfirmButton: false,
            timer: 1500
         })
         name.value = null
         modalOpen.value = false
         getRoles()
         window.location.reload()
       }else{
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Error creating role',
            showConfirmButton: false,
            timer: 1500
        })
        window.location.reload()

       }
      } catch (error) {
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Error creating role',
            showConfirmButton: false,
            timer: 1500
        })
      }


    }

    const priviledges = ref()
    const getpriviledges = async () => {
        loading.value = true
       const {status, data}= await RolesPriviledge.priviledge()
       if(status == 200 || status === 201){
         priviledges.value = data
         loading.value = false  
         tableKey.value++
       }

        datatable()
    }

    const checkAssignedPriviledge = (privilegeId, role) => {
        if (!role || !role.priviledges) return false;

        return role.priviledges.some(privilege => privilege.priviledge_id === privilegeId);
    };

    const checkedPriviledges = ref([]);

    const togglePrivilege = (privilegeId) => {
        const index = checkedPriviledges.value.indexOf(privilegeId);
        if (index === -1) {
            // Add the privilege if not already in the array
            checkedPriviledges.value.push(privilegeId);
        } else {
            // Remove the privilege if it exists in the array
            checkedPriviledges.value.splice(index, 1);
        }
    };

    const initialPrivileges = ref([]); // Store the initial state of privileges for the selected role

const openModal = (title, action, item = null) => {
    modalTitle.value = title;
    modalAction.value = action;
    modalOpen.value = true;

    if (action === 'assign') {
        selectedRole.value = item; // Set the role for privilege assignment
        initialPrivileges.value = item.priviledges.map(priv => priv.priviledge_id); // Store initial privileges
        checkedPriviledges.value = [...initialPrivileges.value]; // Initialize checked privileges
    }
};

const assignPriviledges = (role) => {
    const privilegesToAdd = checkedPriviledges.value.filter(
        privId => !initialPrivileges.value.includes(privId)
    );
    const privilegesToRemove = initialPrivileges.value.filter(
        privId => !checkedPriviledges.value.includes(privId)
    );

    const payload = {
        priviledgesToAdd: privilegesToAdd,
        priviledgesToRemove: privilegesToRemove,
    };

    RolesPriviledge.assign_role_priviledge(payload, role.id).then((result) => {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000,
        });
        getRoles();
        modalOpen.value = false;
    }).catch(err => {
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: err?.response?.data?.error ?? err.response.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000,
        });
    });
};



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
      getRoles()
      getpriviledges()
    })  
  </script>
  
  