<template>
    <div class="table-responsive"><br>
      <span class="loader" v-if="loading"></span>  
      <h3>Customers</h3>
      <table id="table" class="table table-striped">
        <thead>
          <tr>
            <th></th>
            <th>Fullname</th>
            <th>Telephone</th>
            <th>Email Address</th>
            <th>Customer Type</th>
            <th>Wallet Balance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody :key="tableKey">
          <tr v-for="(customer, index) in all_customers" :key="customer.id">
            <td>{{index+1}}</td>
            <td>{{customer.fullname}}</td>
            <td>{{customer.phone}}</td>
            <td>{{customer.email}}</td>
            <td>{{customer.customer_type}}</td>
            <td>{{customer.wallet_balance.toLocaleString()}}</td>
            <td>
              <p-button class="mr-2" title="delete" type="danger" size="sm" icon @click.prevent="delete_customer(customer)">
                <i class="fa fa-trash"></i>
              </p-button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- update modal -->
      <modal :show.sync="modals.classic" headerClasses="justify-content-center">
        <h4 slot="header" class="title title-up" v-show="updateMode">{{ modalTitle }}</h4>
        <h4 slot="header" class="title title-up" v-show="!updateMode">{{ modalTitle }}</h4>
          <div>
            <form @submit.prevent="fund_wallet" enctype="multipart/form-data" v-if="!updateMode">
                <div class="form-group">
                  <!-- fund wallet -->
                  <label for="">Amount</label>
                  <input type="number" step="any" v-model="fund.amount" class="form-control" placeholder="amount">
                </div>
                <button class="btn btn-success" type="submit">Fund</button>
            </form>
          </div>
        <template slot="footer">
        <p-button type="default" link @click.prevent="modals.classic = false">Close</p-button>
  
        </template>
      </modal>
  
    </div>
  </template>
  <script>
    import { Modal } from '@/components/UIComponents'
    import Customer from '@/javascript/Api/Customer'
    import Swal from 'sweetalert2'
  
    export default{
       components: {
        Modal
      },
      data() {
        return {
          updateMode:false,
          all_customers:null,
          filter:1,
          tableKey:0,
          customer:null,
          loading: false,
          modalTitle:null,
          fund:{
            amount:null,
            platform: 'offline'
          },
          modals: {
            classic: false,
            notice: false,
            mini: false
          },
        }
      },
      methods: {
        openModal(type, title, action, customer){
          this.modalTitle = title
          this.modals[type] = true
          this.modalAction = action
          this.customer = customer.id
  
        },
        goToRoute(customer){
          this.$router.push('/customer/details/'+customer.id)
        },
        goToUpdate(customer){
          this.$router.push('/customer/update/'+customer.id)
        },
        delete_customer(customer){
          this.loading = true
  
          Customer.delete(customer.id).then((result) => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: "Account deactivated",
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000
            })
            this.loading = false
            this.allCustomers()
          }).catch((err) => {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: "Error deactivating customer!",
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000
            })
            this.loading = false
          });
        },
        fund_wallet(){
          this.loading = true
  
          Customer.fund_wallet(this.fund, this.customer).then((result) => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: "Account Credited Successfully",
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000
            })
            this.allCustomers()
            this.modals.classic = false
            this.loading = false
  
          }).catch((err) => {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: "Error funding wallet!",
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000
            })
            this.loading = false
  
          });
        },
        allCustomers(){
          this.loading = true
  
          Customer.customers().then((result) => {
              this.all_customers = result.data.data
              this.tableKey++
              this.datatable()
              this.loading = false
  
          })
        },
  
        datatable(){
          $(function() {
            $('#table').DataTable({
              dom: 'Bfrtip',
            buttons: ['excel', 'pdf', 'print'],
              "bDestroy": true,
                  pageLength: 5,
                  lengthMenu: [[5,10,20], [5, 10, 20]],
              });
          });
        },
  
        filter_table(){
                  if(this.filter == 1){
                      this.all_Customers = this.all_Customers
                      this.api_refresh()
                  }else if(this.filter == 2){
                      this.all_Customers = this.active_Customers
                      this.api_refresh()
                  }else if(this.filter == 3){
                      this.all_Customers = this.inactive_Customers
                      this.api_refresh()
                  } else if(this.filter == 4){
                    this.all_Customers = this.banned_Customers
                    this.api_refresh()
                  } else{
                     this.all_Customers = this.vip_Customers
                     this.api_refresh()
                  }
        },
          api_refresh(){
              this.allCustomers()
          },
      },
      created(){
        this.allCustomers()
      }
  
    }
  </script>
  