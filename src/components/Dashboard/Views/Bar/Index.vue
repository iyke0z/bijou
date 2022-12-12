<template>
  <div class="container">
    <div class="container">
      <header class="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
        <h2 class="bg-dark text-light p-2 pr-5 pl-5">Bar</h2>
      </header>
    </div>
    <table class="table" id="myTable">
      <thead>
        <tr>
          <th scope="col">Product</th>
          <th scope="col">Status</th>
          <th scope="col">Waiter</th>
          <th>Set Status</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody :key="tableKey">
        <tr v-for="item in orders" :key="item.id">
          <td>{{ item.product.name }}</td>
          <td>{{ item.prep_status }}</td>
          <td>{{ item.user.fullname }}</td>
          <td>
            <select v-model="form" name="" id="">
              <option :value="{id:item.id, prep_status:'not_ready'}">Not Ready</option>
              <option :value="{id:item.id, prep_status:'almost_ready'}" >Almost Ready</option>
              <option :value="{id:item.id, prep_status:'ready'}" >Ready</option>
            </select>
          </td>
          <td>
            <button class="btn btn-info" @click="updateStatus(item.id)">Update</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Orders from '@/javascript/Api/Orders';
import Swal from 'sweetalert2';
export default {
  data() {
    return {
      orders:[],
      form: {
        id:null,
        prep_status: 'almost_ready'
      },
      tableKey:0
    }
  },

  methods: {
    barOrders(){
      this.orders = []
      Orders.drink_orders().then((result) => {
        var res = result.data.data
        res.forEach(element => {
          if(element.product != null && element.transaction != null){
            this.orders.push(element)
          }
        });
        this.datatable()
        this.tableKey++
      })
    },

    updateStatus(id){
      Orders.update_prep_status(this.form).then((result) => {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Status Updated',
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.datatable()
          this.tableKey++
      }).catch((err) => {
        console.log(err)
      });
    },
    datatable(){
        $(function() {
          $('#myTable').DataTable({
            "bDestroy": true,
                pageLength: 5,
                lengthMenu: [[5,10,20], [5, 10, 20]],
            });
        });
      },
  },

  created() {
    this.barOrders()
  },

}
</script>
