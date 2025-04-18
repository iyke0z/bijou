<template>
    <div class="container-fluid"><br>
      <span class="loader" v-if="loading"></span>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Recent Transfers</h5>
          
          <!-- Transactions Table -->
          <div class="table-responsive">
            <table id="table" class="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Ref No</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Originating Store</th>
                  <th>Destination Store</th>
                  <th>Shop one Contact Person</th>
                  <th>Shop two Contact Person</th>
                  <th>Initial Stock</th>
                  <th>Current Stock</th>
                  <th>Status</th>
                  <th>Transaction Type</th>
                  <th>Date Initiated</th>
                  <th>Date Accepted</th>
                  <th>Actions</th>

                </tr>
              </thead>
              <tbody :key="tableKey">
                <tr v-for="transaction in transactions" :key="transaction.id">
                  <td>{{ String(transaction.id).padStart(9, '0') }}</td>
                  <td>{{ transaction?.product?.name }}</td>
                  <td>{{ transaction.qty }}</td>
                  <td>{{ transaction.shop_one.title }}</td>
                  <td>{{ transaction.shop_two.title }}</td>
                  <td>{{ transaction.shop_one.contact_person}}</td>
                  <td>{{ transaction.shop_two.contact_person}}</td>
                  <td v-if="transaction.originating_shop == shopId">
                    {{ transaction.previous_stock }}
                  </td>
                  <td v-if="transaction.originating_shop == shopId">
                    {{ transaction.current_stock }}
                  </td>
                  <td v-if="transaction.destination_shop == shopId">
                    {{ transaction.previous_stock_two }}
                  </td>
                  <td v-if="transaction.destination_shop == shopId">
                    {{ transaction.current_stock_two }}
                  </td>

                 
                  
                  <td>{{ transaction.transaction_status}}</td>
                  <td>{{ transaction.transaction_method}}</td>
                  <td>{{ dateTime(transaction.created_at)}}</td>
                  <td>{{ dateTime(transaction.updated_at)}}</td>
                  <td>
                    <a v-if="transaction.destination_shop == shopId && transaction.transaction_status == 'pending'" @click.prevent="acceptTransfer(transaction)" class="cursor-pointer" href="#">
                     Accept |
                    </a>
                    <a href="#" v-if="transaction.destination_shop == shopId && transaction.transaction_status == 'pending'"  @click.prevent="rejectTransfer(transaction)" class="cursor-pointer">
                    Reject |
                    </a>
                    <a href="#" v-if="transaction.originating_shop == shopId && transaction.transaction_status == 'pending'"  @click.prevent="rejectTransfer(transaction)" class="cursor-pointer">
                    Cancel
                    </a>
                    <span v-if="transaction.transaction_status == 'rejected' || transaction.transaction_status == 'cancelled'">
                        Closed Transaction
                    </span>
                    <span v-if="transaction.transaction_status == 'completed'">
                        Completed Transaction
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
  </template>
  
  <script>
import { Button, Modal } from '@/components/UIComponents'
import Shops from '@/javascript/Api/Shops'
import Swal from 'sweetalert2'
    export default{
      components: {
        Modal
      },
      data() {
        return {
          form:{start_date:null, end_date:null, platform:"all"},
          transactions:null,
          purchases:null,
          expenditures: null,
          sales_details:null,
          tableKey:0,
          detailsKey:0,
          profit:0,
          sales:null,
          totalcost:0,
          totalexp:0,
          totalsales:0,
          productTrend:null,
          trendKey:0,
          loading: false,
          data:false,
          transaction: null,
          modals: {
          classic: false,
          loading: false, 
          notice: false,
          mini: false
        },
        loading: false,
        goodsDeliveryForm: {
          transaction_id:null,
          date_left_warehouse:null,
          delivery_details:null,
          note:null,
          proccessed_by:null,
        },
        shopId: localStorage.getItem('shopId'),
        }
      },
      methods: {
        recent_transfers(){
            Shops.recent_transfers(localStorage.getItem('shopId')).then((result) => {
                this.transactions = result.data.data
                this.tableKey++
                this.datatable()
            })
        },

        acceptTransfer(transaction){
            Shops.approve_transfer(transaction.id).then(result => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Transfer accepted successfully',
                    showConfirmButton: false,
                    timer: 3000
                })
                this.recent_transfers()
            })
        },

        rejectTransfer(transaction){
            Shops.reject_transfer(transaction.id).then(result => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Transfer rejected successfully',
                    showConfirmButton: false,
                    timer: 3000
                })
                this.recent_transfers()
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
      dateTime(date) {
        var date = new Date(date)
        var time = new Date(date)
        let hours = time.getHours()
        let minutes = time.getMinutes()
        let seconds = time.getSeconds()
        var ampm = hours >= 12 ? 'pm' : 'am'
        return date.toDateString() + " " + hours + ":" + minutes + " " + ampm
    },
      },
      created(){
        this.recent_transfers()
      }
  
    }
  </script>
  
  