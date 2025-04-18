<template>
    <div class="container-fluid"><br>
      <div v-if="loading">
        <span class="loader"></span>
      </div>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Sales Order</h5>
          <div class="row">
            <!-- Generate Report Section -->
            <div class="col-12 col-md-4 mb-3">
              <form @submit.prevent="filter">
                <div class="form-group">
                  <label for="start-date">Start Date</label>
                  <input 
                    type="datetime-local" 
                    id="start-date" 
                    v-model="form.start_date" 
                    class="form-control w-100" 
                    required>
                </div>
                <div class="form-group">
                  <label for="end-date">End Date</label>
                  <input 
                    type="datetime-local" 
                    id="end-date" 
                    v-model="form.end_date" 
                    class="form-control w-100" 
                    required>
                </div>
                <button class="btn btn-success btn-block" type="submit">
                  Generate <span v-if="loading" class="loader"></span>
                </button>
              </form>
            </div>
          </div>
  
          <!-- Transactions Table -->
          <div class="table-responsive">
            <table id="table" class="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Ref No</th>
                  <th>Transaction Type</th>
                  <th>Transaction Status</th>
                  <th>Payment Method</th>
                  <!-- <th>Amount</th> -->
                  <!-- <th>Customer</th> -->
                  <th>Raised By</th>
                  <th>Date</th>
                  <!-- <th>Description</th> -->
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody :key="tableKey">
                <tr v-for="transaction in transactions" :key="transaction.id">
                  <td>{{ String(transaction.id).padStart(9, '0') }}</td>
                  <td>{{ transaction.type ?? "Awaiting staff closing transaction" }}</td>
                  <td>{{ transaction.status }}</td>
                  <td>{{ transaction.payment_method ?? "--" }}</td>
                  <!-- <td>{{ transaction.amount.toLocaleString() }}</td> -->
                  <!-- <td>{{ transaction.customer?.fullname ?? "N/A" }}</td> -->
                  <td>{{ transaction.user.fullname }}</td>
                  <td>{{ dateTime(transaction.created_at) }}</td>
                  <!-- <td>{{ transaction.table_description }}</td> -->
                  <td>
                    <a @click.prevent="details(transaction)" class="cursor-pointer" href="#">
                     View Sales Order |
                    </a>
                    <a href="#" v-if="transaction.delivery_note == null && transaction.status != 'cancelled'" @click.prevent="openModal('classic', 'Issue Goods Recieved Note',  transaction)" class="cursor-pointer">
                    Issue Goods Recieved Note |
                    </a>
                    <a href="#" v-if="transaction.delivery_note != null && transaction.status != 'cancelled'" @click.prevent="viewGoodsReceivedNote(transaction)" class="cursor-pointer">
                    View Goods Recieved Note |
                    </a>
                    <a href="#" v-if="transaction.status != 'cancelled'" @click.prevent="generateInvoice(transaction)" class="cursor-pointer">
                    Invoice |
                    </a>
                    <a href="#" v-if="transaction.status != 'cancelled'" @click.prevent="printReciept(transaction)" class="cursor-pointer">
                    Reciept |
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
                 <!-- update modal -->
                 <Modal :show.sync="modals.classic" headerClasses="justify-content-center">
            <h4 slot="header" class="title title-up" >{{ modalTitle }}</h4>
              <div >
                <form @submit.prevent="issueDeliveryNote">
                   
                    <div class="form-group">
                      <label for="">Movement Date</label>
                      <input type="datetime-local" v-model="goodsDeliveryForm.date_left_warehouse" class="form-control" required>
                    </div>
                    <div class="form-group">
                      <label for="">Carrier Details</label>
                      <input type="text" v-model="goodsDeliveryForm.delivery_details" class="form-control" required>
                    </div>
                    <div class="form-group">
                      <label for="">Note</label>
                   <textarea name="" v-model="goodsDeliveryForm.note" class="form-control" id=""></textarea>
                    </div>
                    <div class="form-group">
                      <button type="submit" class="btn btn-success"> Submit</button>
                    </div>
                </form>
              </div>

            <template slot="footer">
            <p-button type="default"  link @click.prevent="modalOpen = false">Close</p-button>
            </template>
           </Modal>  
    </div>
    
  </template>
  
  <script>
import { Button, Modal } from '@/components/UIComponents'
  import Purchases from '@/javascript/Api/Purchases'
  import Report from '@/javascript/Api/Reports'
  import helpers from '@/javascript/helpers'
  import Sales from '@/javascript/Api/Sales'
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
          loading:false,
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
        modalTitle:null,
        goodsDeliveryForm: {
          transaction_id:null,
          date_left_warehouse:null,
          delivery_details:null,
          note:null,
          proccessed_by:null,
        }
        }
      },
      methods: {
        issueDeliveryNote(){
          this.loading = true
          this.goodsDeliveryForm.transaction_id = this.transaction.id
          this.goodsDeliveryForm.proccessed_by = localStorage.getItem('authUser')
          Sales.delivery_note(this.goodsDeliveryForm).then((result) => {
            this.loading = false
            this.modals.classic = false
            this.$emit('refresh')
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Delivery Note Issued',
              showConfirmButton: false,
              timer: 1500
            })

            this.filter()
          }).catch((error) => {
            console.log(error)
          })
        },
        openModal(type, title, transaction){
          this.modalTitle = title
          this.modals[type] = true
          this.transaction = transaction
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
  
        dateTime(date){
          return helpers.dateTime(date)
        },
        filter(){
          this.loading = true
          Report.general_report(this.form).then((result) => {
            this.transactions = result.data.data['transaction']
            this.sales = result.data.data['sales']
            this.expenditures = result.data.data['expenditures']
              this.tableKey++
              this.datatable()
          })
          this.loading = false
        },
       
        details(transaction){
          this.cache(transaction)
          setTimeout(() => {
            window.open('sales-order', '_blank')
          }, 1500);
        },
  
      

        cache(transaction){
          localStorage.removeItem('products')
          localStorage.removeItem('summary')
          localStorage.removeItem('customer')
          var summary = {
            ref_no: transaction.id,
            amount: (transaction.amount)/(((transaction.discount/100) + (transaction.vat/100)) + 1),
            discount: transaction.discount,
            vat: transaction.vat,
            total:transaction.amount,
            payment_method: transaction.payment_method,
            part_payment:transaction.part_payment_amount,
            logistics:transaction?.logistics[0]?.amount ?? 0
          }

          var products = transaction.sales
          var customer = transaction.customer

          localStorage.setItem('products', JSON.stringify(products))
          localStorage.setItem('summary', JSON.stringify(summary))
          localStorage.setItem('customer', JSON.stringify(customer))
      },
      createRecievedNote(transaction){
          var summary = {
            ref_no: transaction.id,
            amount: transaction.amount/(((transaction.discount/100) + (transaction.vat/100)) + 1),
            discount: transaction.discount,
            vat: transaction.vat,
            total:transaction.amount,
            payment_method: transaction.payment_method,
            part_payment:transaction.part_payment_amount
          }
      },

        generateInvoice(transaction){
          this.cache(transaction)
          setTimeout(() => {
            window.open('invoice', '_blank')
          }, 1500);
        },

        printReciept(transaction){
          this.cache(transaction)
          setTimeout(() => {
            window.open('/receipt', '_blank')
          }, 1500);
        },
        
        viewGoodsReceivedNote(transaction){
          localStorage.removeItem('products')
          localStorage.removeItem('summary')
          localStorage.removeItem('customer')
          localStorage.removeItem('deliverynote')

          localStorage.setItem('customer', JSON.stringify(transaction.customer))
          localStorage.setItem('products', JSON.stringify(transaction.sales))
          localStorage.setItem('deliverynote', JSON.stringify(transaction.delivery_note))
          localStorage.setItem('ref_no', transaction.id)
          window.open('/goods-received-note')
        }
  
  
      },
      created(){
        this.datatable()
      }
  
    }
  </script>
  <style>
 .loader {
    width: 18px;
    height: 18px;
    border: 5px solid #000;
    border-bottom-color: gray;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    }
  
    @keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
  } 
  
  .rotate-360 {
    transform: rotate(180deg);
    transition: transform 0.5s;
  }
  .rotate-0 {
    transform: rotate(0deg);
    transition: transform 0.5s;
  }</style>
  
  