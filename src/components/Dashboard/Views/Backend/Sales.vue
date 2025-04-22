<template>
    <div class="container-fluid"><br>
        <span class="loader" v-if="loading"></span>

      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Sales Report</h5>
          <div class="row">
            <!-- Generate Report Section -->
            <div class="col-12 col-md-4 mb-3">
              <h6>Generate Report</h6>
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
                <!-- <div class="form-group">
                  <label for="platform">Platform</label>
                  <select 
                    id="platform" 
                    v-model="form.platform" 
                    class="form-control w-100" 
                    required>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="all">All</option>
                  </select>
                </div> -->
                <button class="btn btn-success btn-block" type="submit">
                  Generate 
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
                  <th>Amount</th>
                  <th>Customer</th>
                  <th>Staff</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody :key="tableKey">
                <tr v-for="transaction in transactions" :key="transaction.id">
                  <td>{{ String(transaction.id).padStart(9, '0') }}</td>
                  <td>{{ transaction.type ?? "Awaiting staff closing transaction" }}</td>
                  <td>{{ transaction.status }}</td>
                  <td>{{ transaction.payment_method ?? "--" }}</td>
                  <td>{{ transaction.amount.toLocaleString() }}</td>
                  <td>{{ transaction.customer?.fullname ?? "N/A" }}</td>
                  <td>{{ transaction.user.fullname }}</td>
                  <td>{{ dateTime(transaction.created_at) }}</td>
                  <td>{{ transaction.table_description }}</td>
                  <td>
                    <button @click.prevent="openModal(transaction)" v-if="transaction.status != 'completed'" class="btn btn-black btn-sm">
                      <i class="fa fa-wrench"></i>
                    </button>
                    <button @click.prevent="details(transaction.id)" class="btn btn-info btn-sm">
                      <i class="fa fa-eye"></i>
                    </button>
                    <button @click.prevent="deleteSale(transaction.id)" class="btn btn-danger btn-sm">
                      <i class="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="card col-12 mr-3 table-responsive">
        <div class="card-body">
          <h5 class="card-title">Sales Details</h5>
          <table id="purchase" class="table table-stripped">
            <thead>
              <tr>
                <th></th>
                <th>product</th>
                <th>qty</th>
                <th>price</th>
                <th>amount payable</th>
                <th>status</th>
                <th>ref</th>
                <th>discount</th>
              </tr>
            </thead>
            <tbody :key="detailsKey">
              <tr v-for="(sale, index) in sales_details" :key="sale.id">
                <td>{{index+1}}</td>
                <td>{{sale.name}}</td>
                <td>{{sale.qty}}</td>
                <td>{{sale.price.toLocaleString()}}</td>
                <td>{{(sale.price * sale.qty).toLocaleString()}}</td>
                <td>{{sale.status}}</td>
                <td>{{sale.ref}}</td>
                <td>{{sale.discount}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- update modal -->
     <Modal :show.sync="modalOpen" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up">Update Sale</h4>
        <div>
          <form @submit.prevent="updateSales" enctype="multipart/form-data" >
            <div class="form-group">
                <label for="">Is Split <small>(Are you paying for this with different payment methods?)</small></label>
                <select v-model="is_split_payment" class="form-control" @change="is_split_payment = $event.target.value">
                    <option :value="1">True</option>
                    <option :value="0">False</option>
                  </select>
            </div>
            <div class="form-group">
                <label>Accrual <small>(Is this an accrued transaction, i.e spread for a period?)</small></label>
                <select v-model="payment_type" class="form-control" @change="openAccrualModal">
                <option :value="null">None</option>
                <option :value="'prepayment'">Prepaid</option>
                <option :value="'postpayment'">Postpaid</option>
              </select>
            </div>
            <div class="form-group">
              <label for="">Payment Type</label>
                <select v-model="type" class="form-control">
                  <option value="full_payment">Full Payment</option>
                  <option value="on_credit">On Credit</option>
                  <option value="part_payment">Part Payment</option>
                  <!-- <option value="is_accrual">Is Accrual</option> -->
                </select>
              </div>
              <div class="form-group">
                <!-- fund wallet -->
                <label for="">Payment Method</label>
                <select name="" class="form-control" id="" v-model="payment_method" @change="setStatus">
                  <option value="cash">cash</option>
                  <option value="transfer">transfer</option>
                  <option value="pos">pos</option>
                </select>
              </div>
              
              <div class="form-group" v-if="type == 'part_payment'">
                <label for="">Part Payment Amount</label>
                <input type="number" step="any" class="form-control" v-model="part_payment_amount">
              </div>

              <!-- <div class="form-group" v-if="payment_method == 'is_accrual'">
                <label for="">Duration <small>(duration in months)</small></label>
                <input type="number" step="any" class="form-control" v-model="duration">
              </div> -->

              <button class="btn btn-success" type="submit">UPDATE</button>
          </form>
          <div>
            <form @submit.prevent="updateSales" v-if="is_split_payment" enctype="multipart/form-data">
            <h4 slot="header" class="title title-up">Spilt Payment</h4>
            <fieldset >
                <table id="myTable">
                <tr v-for="(row, index) in rows.split" :key="index">
                  <td>{{ index+1 }}</td>
                  <td>
                    <label for="">Payment Method</label>
                    <select v-model="rows.split[index].split_playment_method" name="" class="form-control col-10" id="">
                      <option value="null">Select Payment Method</option>
                      <option value="cash">Cash</option>
                      <option value="transfer">Transfer</option>
                      <option value="card">POS</option>
                    </select>
                  </td>
                  
                  <td>
                    <label for="">Amount</label>
                    <input autocomplete="off" required type="number" step="any" class="form-control col-8" v-model="rows.split[index].split_payment_amount" placeholder="Amount">
                  </td>
                  <td v-if="rows.split[index].split_playment_method == 'card'">
                    <label for="">bank</label>
                    <select v-model="rows.split[index].bank_id" name="" class="form-control col-10" id="">
                      <option value="null">Select Bank</option>
                      <option v-for="bank in banks" :key="bank.id" :value="bank.id">{{bank.name}}</option>
                    </select>
                  </td>

                  <td>
                    <button type="button" class="btn btn-success text-light col-2" @click="new_row()">+</button>
                    <button v-show="rows.split.length > 1" type="button" class="btn btn-danger text-light col-2" @click="delete_row(index)">x</button>
                  </td>
                </tr>
              </table>
                <div class="form-group">
                  <button type="submit" class="btn btn-success">Submit</button>
                </div>
            </fieldset>
          </form>
        </div>
        </div>
      <template slot="footer">
      <p-button type="default" link @click.prevent="modalOpen = false">Close</p-button>

      </template>
    </Modal>
 <!-- accrual -->
     <modal :show.sync="accrualModal.classic" headerClasses="justify-content-center">
        <div>
          <h4 slot="header" class="title title-up">Accrual</h4>
          <form @submit.prevent="updateSales" enctype="multipart/form-data">
            <fieldset >
                <table id="myTable">
                  <div class="form-group">
                    <label>Start Date</label>
                    <input type="datetime-local" class="form-control" v-model="start_date">
                  </div>
                  <div class="form-group">
                    <label>End Date</label>
                    <input type="datetime-local" class="form-control" v-model="end_date">
                  </div>
                  <div class="form-group">
                    <label>Posting Day</label>
                    <input type="number" min="1" max="31" class="form-control" v-model="posting_day">
                  </div>
              </table>
                <div class="form-group">
                  <button type="submit" class="btn btn-success">Submit</button>
                </div>
            </fieldset>
          </form>
        </div>
    </modal>
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
        detailsKey:0,
        profit:0,
        sales:null,
        totalcost:0,
        totalexp:0,
        totalsales:0,
        productTrend:null,
        payment_method : 'cash',
        payment_status : 'paid',
        part_payment_amount : 0,
        trendKey:0,
        loading: false,
        modals: {
            classic: false,
            notice: false,
            mini: false,
        },
        modalTitle:null,
        modalAction:null,
        modalContent:null,
        modalOpen: false,
        is_split_payment: 0,
        rows: {split:[{split_playment_method:null, split_payment_amount:null,bank_id:null}]},
        type: 'full_payment',  
        payment_type: null,
        accrualModal: {
          classic: false
        },
        start_date: null,
        end_date: null,
        posting_day: null
  
        }
      },
      methods: {
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

        openAccrualModal(){
            this.accrualModal.classic = true
        },

        openModal(item){
            this.modalOpen = true
            this.detail = item.id
            this.selectedId = item.id
        },

        updateSales(){
            this.loading = true
            let payload = {
                payment_method: this.payment_method,
                payment_status: this.payment_status,
                part_payment_amount: this.part_payment_amount,
                duration: this.duration,
                type: this.type,
                is_split_payment: this.is_split_payment,
                split: this.rows.split,
                payment_type: this.payment_type,
                start_date: this.start_date,
                end_date: this.end_date,
                posting_day: this.posting_day
            }

            Report.update_sales(payload, this.selectedId).then((result) => {
                this.loading = false
                this.modalOpen = false
                this.filter()
                Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: result.data.message,
                customClass: 'Swal-wide',
                showConfirmButton: false,
                timer: 3000
                })
            }).catch((err) => {
                this.loading = false
                Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: err?.response?.data?.error ?? err.response.data.message,
                customClass: 'Swal-wide',
                showConfirmButton: false,
                timer: 3000
                })
            });
        },

        datatableTrend(){
          $(function() {
            $('#trendtable').DataTable({
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
              this.getSummary()
          })
          this.loading = false
        },
        getProductTrend(){
          let product = []
          this.sales.forEach(element => {
            if(product.length > 0){
              var getProduct = product.map(function(x) {return x.id; }).indexOf(element.product_id);
              if(getProduct >= 0){
                product[getProduct].count++
              }else{
                product.push({
                  id:element.product_id,
                  name:element.product.name,
                  count:1,
                  stock:element.product.stock
                })
              }
            }else{
                product.push({
                  id:element.product_id,
                  name:element.product.name,
                  count:1,
                  stock:element.product.stock
                })
              }
          });
          
          this.productTrend = product
          this.datatableTrend()
          this.trendKey++
  
        },
        details(id){
          for (let index = 0; index < this.transactions.length; index++) {
            this.transactions[index].sales.forEach( element => {
              if(element['ref'] == id){
                this.sales_details = this.transactions[index].sales
                this.detailsKey++
              }
            })
          }
        },
        setStatus(){
        if (this.payment_method == 'cash' || this.payment_method == 'transfer' || this.payment_method == "is_accrual") {
          this.payment_status = "paid"
        }else{
          this.payment_status = "not_paid"
        }
      },
        getSummary(){
          // getCost
          this.loading = true
          Purchases.purchases().then((result) => {
            this.loading = false
            var totalsales = 0
            var totalcost = 0
            var expenditure = 0
            this.purchases = result.data.data
            for (let index = 0; index < this.sales.length; index++) {
              this.purchases.forEach(element => {
  
                element.purchase_detail.forEach(item => {
                  if(item.product_id == this.sales[index].product_id){
                    totalcost = totalcost + item.cost
                  }
                })
              });
            }
            // getExpenditure
            this.expenditures.forEach(element => {
              expenditure = expenditure + element.amount
            });
            // getTotalSales
            this.transactions.forEach(element => {
              totalsales = totalsales + element.amount
            })
            var profit = totalsales - (totalcost + expenditure)
            this.profit = profit
            this.totalcost = totalcost
            this.totalexp = expenditure
            this.totalsales = totalsales
  
            this.getProductTrend()
          }).catch(() => {
            this.loading = false
          })
        },
  
        deleteSale(id){
          Sales.cancel_sale({ref:id}).then((result) => {
            this.filter()
            this.sales_details = null
          })
        }
  
  
  
      },
      created(){
        this.datatable()
        this.datatableTrend()
      }
  
    }
  </script>
  
  