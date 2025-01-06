<template>
    <div class="table-responsive"><br>
      <h3>System Priviledges</h3>

       <div v-if="!loading">
         <table id="table" class="table table-striped">
           <thead>
             <tr>
               <th></th>
               <th>Priviledge</th>
             </tr>
           </thead>
           <tbody :key="tableKey">
              <tr v-for="(priviledge, index) in priviledges" :key="priviledges.id" >
                <td>{{index+1}}</td>
                <td>{{priviledge.name}}</td>
                <td>
                 
                </td>
              </tr>
           </tbody>
         </table>
      </div>
      <div v-else>
        <span class="loader"></span>
      </div>

    </div>
  </template>
  <script setup>
    import { onMounted, ref } from 'vue';
import RolesPriviledge from '@/javascript/Api/RolesPriviledge';

    const loading = ref(false)
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
      getpriviledges()
    })  
  </script>
  
  