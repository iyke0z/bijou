<template>
  <div class="table-responsive">
    <div class="loader" v-if="loading"></div>

    <div class="mb-2" v-if="expiry_response && expiry_response[0] != 'active'">
        <span v-if="expiry_response[0] == 'expired'" class="text-white bg-danger pr-2 pl-2 pt-2 pb-2">Subscription Expired <small>Subscribe to continue </small></span>
        <span v-if="expiry_response[0] == 'active'" class="text-light bg-success pr-2 pl-2 pt-2 pb-2">Subscription Active</span>
        <span v-if="expiry_response[0] == 'expires_today'" class="text-light bg-danger pr-2 pl-2 pt-2 pb-2">Subscription Expires Today</span>
        <span v-if="expiry_response[0] == 'expires_tomorrow'" class="text-dark bg-info pr-2 pl-2 pt-2 pb-2">Subscription Expiring Tomorrow</span>
        <span v-if="expiry_response[0] == 'expires_in_two_days'" class="text-dark bg-warning pr-2 pl-2 pt-2 pb-2">Subscription Expiring In Two Days</span>
    </div>
    
    <div class="nav col-12 bg-info" style="height:70px">
      <li class="navBrand mt-0 d-none d-md-block" style="cursor: pointer;">
          <a @click.prevent="goHome"> <i class="fa fa-home"></i> {{shopName}} - </a>
          <a @click.prevent="goHome"> {{business_name}}</a>
          <div><small class="text-light mt-0"> <i class="fa fa-user"></i> Welcome {{user?.fullname}}</small></div>
        </li>
        <li class="col-2 col-md-1 ml-2 mt-4 pb-0">
          <label for="flexSwitchCheckChecked" class="text-light">
            <span class=" d-md-block"><i class="fa fa-barcode"></i> Barcode</span>
          </label>
          <input class="form-check-input ml-2 mt-1" type="checkbox" role="switch" id="flexSwitchCheckChecked" 
                @click="barcodeMode = !barcodeMode" :checked="barcodeMode">
        </li>
        <!--  -->
        <li class="col-md-4 col-7">
          <form @submit.prevent="searchProduct">
            <input
                class="form-control mt-3 col-12"
                type="search"
                id="search"
                placeholder="search for products..."
                v-model="searchParam"
                @input.prevent="handleInput"
                ref="searchInput">
          </form>
          <ul class="col-11">
            <li class="productList" v-for="product in searchResult" :key="product.id" @click="addProduct(product)">
              {{ product.name}}
              <b>
                &#8358; <small class="bg-dark w-100 text-light"> {{product.price.toLocaleString()}} </small>
                <strong><span class="ml-2 w-100 text-dark" v-if="product.has_stock == 1">(stock: {{ product.stock }})</span></strong>
              </b>
            </li>
            <li>
            </li>
          </ul>
        </li>
        <!--  -->
        <a class="mt-4 text-light" title="sign out"  href="#" @click.prevent="logout">
          <i class="fa fa-power-off text-light" aria-hidden="true"></i> Logout
          </a>
    </div>
    <div class="container col-12"  style="background-color: #f1f5fee9">
      <div class="row mt-5 ">
        <div class="col-12 table-responsive">
          <div class="table-responsive">
            <table class="table table-bordered">
              <thead class="thead-dark">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Qty</th>
                  <th>Selling Price (&#8358;)</th>
                  <th>Total (&#8358;)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(order, index) in products" :key="order.id">
                  <td>{{index+1}}</td>
                  <td>{{order.name}}</td>
                  <td class="col-12 col-md-4">
                    <input
                      type="number" 
                      min="1" 
                      step="any" 
                      v-model="order.qty" 
                      @input="clampValue(order, index, order.has_stock)" 
                      class="form-control form-control-sm" 
                      style="width: 100%; min-width: 120px;"> 
                      <!-- wehen negative stock is allowed -->
                       

                  </td>
          <td class="col-12 col-md-4">
            <input type="number" v-model="order.price" step="any" @input="updateOrder(order.price, index, false)" class="form-control form-control-sm" style="width: 100%; min-width: 120px;">
          </td>

          <!-- <td>{{ (order.price * order.qty).toLocaleString() }}</td> -->

                  <td>{{ (order.price * order.qty).toLocaleString() }}</td>
                  <td>
                    <button class="btn btn-danger" @click="removeFromList(index)">
                      <i class="fa fa-trash" aria-hidden="true"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
  </div>

        <div class="row">
        <div class="col-4 col-md-4">
          <p class="lead">Subtotal:</p>
        </div>
        <div class="col-8 col-md-4">
          <p class="lead">&#8358; {{ this.subtotal.toLocaleString() }}</p>
        </div>
      </div>

<div class="row">
  <div class="col-4 col-md-4">
    <p class="lead">Discount:</p>
  </div>
  <div class="col-6 col-md-3">
    <input type="number" v-model="discount_pctge" step="any" class="form-control" placeholder="0">
  </div>
  <div class="col-2">
    <b>%</b>
  </div>
</div>

<div class="row">
  <div class="col-4 col-md-4">
    <p class="lead">Customer:</p>
  </div>
  <div class="col-6 col-md-6">
    <input
      @input="search_customer"
      type="search"
      class="form-control"
      v-model="searchCustomer"
      placeholder="search customer">
    <span v-if="this.customer_id > 0">
      <div class="row">
        <div class="col-6">
          <input v-model="from_wallet"  @change="setWallet" :disabled="this.total > this.customerWallet_balance || on_credit == true || part_payment == true" type="checkbox" value="1"> Wallet
          <small class="text-danger" v-if="this.total > this.customerWallet_balance">customer cannot afford this bill from wallet</small>
        </div>
        <div class="col-8">
          <input v-model="on_credit" :disabled="from_wallet == true" @change="setCredit" type="checkbox" value="1"> Credit
          <input type="number" step="any" v-model="part_payment_amount" placeholder="0" v-if="on_credit"><small class="ml-2 text-dark">input part payment amount</small>
        </div>
        
      </div>
    </span>
  </div>
</div>
<div style="margin-left: 35%;">
  <ul class="col-8">
    <li class="productList" v-for="customer in customerSearch" :key="customer.id" @click="addCustomer(customer)">
      {{ customer.name}}
    </li>
  </ul>
</div>


<div class="row">
  <div class="col-4 col-md-4">
    <p class="lead">V.A.T:</p>
  </div>
  <div class="col-8 col-md-4">
    <p class="lead">{{ this.vat }} %</p>
  </div>
</div>

<div class="row">
  <div class="col-4 col-md-4">
    <p class="lead">Total:</p>
  </div>
  <div class="col-8 col-md-8">
    <p class="lead">&#8358; {{ (this.total + parseFloat(this.logistics)).toLocaleString() }}</p>
  </div>
</div>

<div class="row">
  <div class="form-group col-12 col-md-2">
    <label>Logistics Amount</label>
    <input type="number" step="any" v-model="logistics" class="form-control" />
  </div>

  <div class="form-group col-12 col-md-2">
    <label for="">Is Split <small>(Are you paying for this with different payment methods?)</small></label>
    <select v-model="is_split_payment" class="form-control" @change="openModal">
      <option :value="1">True</option>
      <option :value="0">False</option>
    </select>
  </div>

  <div class="form-group col-12 col-md-2">
    <label>Payment Type</label>
    <select v-model="type" class="form-control">
      <option value="full_payment">Full Payment</option>
      <option value="on_credit">On Credit</option>
      <option value="complementary">Complementary</option>
      <option value="part_payment">Part Payment</option>
    </select>
  </div>
  <div class="form-group col-12 col-md-2">
    <label>Accrual <small>(Is this an accrued transaction, i.e spread for a period?)</small></label>
    <select v-model="payment_type" class="form-control" @change="openAccrualModal">
      <option :value="null">None</option>
      <option :value="'prepayment'">Prepaid</option>
      <option :value="'postpayment'">Postpaid</option>
    </select>
  </div>
  <div class="form-group col-12 col-md-2">
    <label>Payment Method</label>
    <select v-model="payment_method" class="form-control">
      <option value="cash">Cash</option>
      <option value="transfer">Transfer</option>
      <option value="card">POS</option>
      <option v-if="total <= customerWallet_balance && customer_id != null" value="wallet">Wallet</option>
    </select>
  </div>

  <div class="form-group col-12 d-flex flex-wrap gap-2 mt-2">
    <button class="btn btn-success mr-2" @click.prevent="pay">
      Pay <i class="fa fa-money" aria-hidden="true"></i>
    </button>
    <button class="btn btn-primary" @click.prevent="reset">
      Reset <i class="fa fa-refresh" aria-hidden="true"></i>
    </button>
    <a class="btn btn-warning" @click.prevent="generateInvoice" target="_blank">
      Generate Invoice <i class="fa fa-print" aria-hidden="true"></i>
    </a>
    <a class="btn btn-danger" @click.prevent="printReceipt" target="_blank">
      Print Receipt <i class="fa fa-print" aria-hidden="true"></i>
    </a>
  </div>
</div>

        </div>
        <!-- <div class="col-2"></div>
        <div class="col-4">
          <calculator :key="compKey" :total="total"/>
        </div> -->
      </div>
    </div>
    <!-- <ImageBarcodeReader @decode="onDecode" @error="onError"></ImageBarcodeReader> -->

      <!-- <receipt :key="receiptKey" v-show="receipt" :items="response" :details="business_name"/> -->
       <div>
        <center><h3>Create New Customer</h3>
          <form @submit.prevent="createCustomer">
          <label>Fullname</label><br/>
        <input type="text" v-model="customer_form.fullname" step="any" class="form-control col-4  mb-2 form-control-sm" style="width: 100%; min-width: 120px;" required>
          <label>Biling Address</label><br/>
        <input type="text" v-model="customer_form.address" step="any" class="form-control col-4 mb-2 form-control-sm" style="width: 100%; min-width: 120px;" required>
          <label>Phone Number</label><br/>
        <input type="text" v-model="customer_form.phone" step="any" class="form-control col-4 mb-2 form-control-sm" style="width: 100%; min-width: 120px;" required>
          <label>Email Address</label><br/>
        <input type="text" v-model="customer_form.email" step="any" class="form-control col-4 mb-2 form-control-sm" style="width: 100%; min-width: 120px;" required>
        <button class="btn btn-success" type="submit">Submit</button></form>

      </center>
       </div>

       <modal :show.sync="modals.classic" headerClasses="justify-content-center">
        <div>
          <h4 slot="header" class="title title-up">Spilt Payment</h4>
          <form @submit.prevent="pay" enctype="multipart/form-data">
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
      <template slot="footer">
      <p-button type="default" link @click.prevent="modals.classic = false">Close</p-button>

      </template>
    </modal>
    <modal :show.sync="accrualModal.classic" headerClasses="justify-content-center">
        <div>
          <h4 slot="header" class="title title-up">Accrual</h4>
          <form @submit.prevent="pay" enctype="multipart/form-data">
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
  </div >
  
</template>
<script>

import Product from '@/javascript/Api/Product'
import Customer from '@/javascript/Api/Customer'
import Vat from '@/javascript/Api/BusinessDetails'
import Sales from '@/javascript/Api/Sales'
import Calculator from './Calculator.vue'
import Receipt from './Receipt.vue'
import Swal from 'sweetalert2'
import Auth from '@/javascript/Api/Auth'
import User from '@/javascript/Api/User'
import { type } from 'jquery'
import { Button, Modal } from '@/components/UIComponents'
import { f } from 'html2pdf.js'

  export default{
    components:{ Calculator, Receipt, Modal},
    data() {
      return {
        customer_form: {
          fullname: null,
          address: null,
          phone: null,
          email: null,
          wallet_balance: 0
        },
        modals: {
          classic: false,
          notice: false,
          mini: false
        },
        customer_id: null,
        discount_pctge:0,
        is_discount_code: 0,
        discount_code: null,
        from_wallet:false,
        type:"full_payment",
        on_credit:false,
        part_payment:false,
        rows: {split:[{split_playment_method:null, split_payment_amount:null,bank_id:null}]},
        payment_method:"cash",
        products: [],
        allProducts: null,
        platform: "offline",
        receiptKey: 0,
        barcodeMode:false,
        searchParam:"",
        searchResult: [],
        allCustomers:[],
        receipt: false,
        customerSearch:[],
        searchCustomer:"",
        subtotal:0,
        total:0,
        part_payment_amount:0,
        customerWallet_balance:0,
        vat:0,
        compKey:0,
        business_name:null,
        response:null,
        showReceipt: false,
        tempStock:0,
        user:null,
        ref:null,
        expiry_response:null,
        shopName:null,
        loading:false,
        negative_stock: false,
        is_split_payment: 0,
        logistics: 0,
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
      openModal(){
        if(this.is_split_payment == 1){
          this.modals.classic = true
        }
      },
      openAccrualModal(){
        if(this.payment_type != null){
          this.accrualModal.classic = true
        }
      },
      createCustomer(){
        this.loading = true
        Customer.create(this.customer_form).then((result) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.customer_form = {
          fullname:null,
          email:null,
          phone:null,
          address:null,
          wallet_balance:0
        }
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

        this.getCustomers()
      },
      handleInput() {
        if (!this.barcodeMode) {
          this.searchProduct();
        }
      },
      new_row(){
        this.rows.split.push(
          {split_playment_method:null,
          split_payment_amount:null,
          bank_id:null}
        )
      },
      delete_row (id) {
        this.rows.split.splice(id, 1)
      },
      clampValue(order, index, hasStock) {
        if (hasStock != 1 || this.negative_stock == 1) {
          this.updateOrder(order.qty, index, true);

        }else{
          const maxStock = order.stock;
        const minStock = 1;
        // Clamp the value in real time
        if (order.qty > maxStock) {
          order.qty = maxStock;
        } else if (order.qty < minStock) {
          order.qty = minStock;
        }
        // Call updateOrder to apply the logic
        this.updateOrder(order.qty, index, true, maxStock);
        }
        
      },
      updateOrder(qty, index, isQty, stock=null){
          if(isQty){
            // check if stockqty is less than qty
            if (stock != null && qty == stock) {
              this.getTotal()
            }
            this.products[index].qty = qty
            this.getTotal()
          }else{
            this.getTotal()
          }
      },
      getExpiry(){
        Auth.get_expiry().then((result) => {
          this.expiry_response = result.data.data
          localStorage.setItem('packageId', result.data.data[1]?.package_id)
        })
      },
      
      getProducts(){
        this.loading = true
        Product.products().then((result) => {
          this.allProducts = result.data.data
          this.loading = false
        })
      },

      goHome(){
        this.$router.push("/admin/overview")
      },

      setWallet(){
        this.payment_method = "wallet"
      },

      setCredit(){
        this.type = "on_credit"
      },

      setPartPayment() {
          if (this.part_payment) {
              this.payment_method = "part_payment";
              this.on_credit = false; // Ensure `on_credit` is false when selecting `part_payment`
          } else {
              this.payment_method = null; // Reset payment method if `part_payment` is unchecked
          }
      },

      cache(){
        if(this.products.length > 0){
          this.getTotal()
            var vatAmt = this.vat/100 * this.subtotal
            var total = this.subtotal + vatAmt + parseFloat(this.logistics)
          var summary = {
            ref_no:this.ref,
            amount: this.subtotal,
            discount: this.discount_pctge,
            vat: this.vat,
            total:total,
            payment_method: this.payment_method,
            part_payment:this.part_payment_amount,
            logistics:this.logistics
          }
          localStorage.setItem('products', JSON.stringify(this.products))
          localStorage.setItem('summary', JSON.stringify(summary))
          localStorage.setItem('details', this.business_name)
        }
      },

      getCustomers(){
        Customer.customers().then((result) => {
          this.allCustomers = result.data.data
        })
      },

      printReceipt(){
        const receiptUrl = '/receipt'
        window.open(receiptUrl, "_blank"); // Opens the URL in a new tab
      },

      newSalesOrder(){
        const salesOrderUrl = '/sales-order'
        window.open(salesOrderUrl, "_blank"); // Opens the URL in a new tab
      },
      generateInvoice(){
        const invoiceUrl = '/invoice'
        window.open(invoiceUrl, "_blank"); // Opens the URL in a new tab
      },

      searchProduct(){
        // get detail from products where then name == orderData.request
          this.searchResult = []
          this.allProducts.forEach(product => {
            var request  = this.searchParam.toLowerCase()
              var productName = product.name.toLowerCase()
              var barcodeValue = product.code
                if (request != "" && this.barcodeMode == false && request !== " " && productName.match(request))
                  {
                    this.searchResult.push(
                    // {product_id:product.id, stock:product.stock, name:product.name,qty: 1,price: product.price,},
                    {product_id:product.id, has_stock:product.category.has_stock, stock:product.stock, name:product.name,qty: 1,price: product.price, category_id:product.category_id},

                    )
                  }
                if (request != "" && this.barcodeMode == true && request !== " " && barcodeValue.match(request)){
                  this.addProduct({product_id:product.id, has_stock:product.category.has_stock, stock:product.stock, name:product.name,qty: 1,price: product.price, category_id:product.category_id})
                }
                
          });
      },

      addProduct(product){
        if(this.products.length > 0){
          var getProduct = this.products.map(function(x) {return x.product_id; }).indexOf(product.product_id);
          if(getProduct >= 0){
            if(this.products[getProduct].stock >= this.products[getProduct].qty+1){
              this.products[getProduct].qty++
              this.searchResult = []
              this.searchParam = ""
              this.getTotal()
            }else{
              Swal.fire({
                position: 'top-end',
                icon: 'warning',
                title: "Out of stock",
                customClass: 'Swal-wide',
                showConfirmButton: false,
                timer: 3000
              })
              this.searchResult = []
              this.searchParam = ""
            }
          }else{
            this.appendProduct(product)
          }
          }else{
            this.appendProduct(product)
          }
      },

      appendProduct(product){
        if(product.has_stock == 0 ){
          this.products.push({
              product_id: product.product_id,
              name:product.name,
              has_stock:product.has_stock,
              qty: 1,
              stock: product.stock,
              price: product.price,
            })
            this.searchResult = []
            this.searchParam = ""
        }else{
          if(product.stock >= 1 || this.negative_stock == 1){
            this.products.push({
              product_id: product.product_id,
              name:product.name,
              has_stock:product.has_stock,
              qty: 1,
              stock: product.stock,
              price: product.price,
            })
            this.searchResult = []
            this.searchParam = ""
          }else{
            Swal.fire({
              position: 'top-end',
              icon: 'warning',
              title: "Out of stock",
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000
            })
          }
        }

      },
      logout(){
        Auth.logout().then(() => {
          localStorage.clear()
          this.$router.push({name:'Login'})
        })
      },


      getDetails(){
        Vat.details().then((result) => {
          this.business_name = result.data.name
          this.vat = result.data.vat
          this.negative_stock = result.data.is_negative_stock
        })
      },
      search_customer(){
        // get detail from products where then name == orderData.request
          this.customerSearch = []
          this.allCustomers.forEach(customer => {
            var request  = this.searchCustomer.toLowerCase()
              var customerName = customer.fullname.toLowerCase()
                if (request != "" && request !== " " && customerName.match(request))
                  {
                    this.customerSearch.push(
                    {id:customer.id,name:customer.fullname.toUpperCase(),wallet_balance:customer.wallet_balance})
                  }
          });
      },

      addCustomer(customer){
        this.customer_id = customer.id
        this.customerSearch = []
        this.searchCustomer = customer.name.toUpperCase()
        this.customerWallet_balance = customer.wallet_balance
      },

      removeFromList(index){
        this.products.splice(index, 1)
      },
      pay(){
        this.loading = true
        if(this.products.length == 0){
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: "No product selected",
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.loading = false
          return
        }
        if(this.discount_pctge > 100){
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: "Discount cannot be more than 100%",
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.loading = false
          return
        }
        if(this.discount_pctge < 0){
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: "Discount cannot be less than 0%",
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.loading = false
          return
        }
        if(this.discount_pctge > 0 && this.is_discount_code == 1 && this.discount_code == null){
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: "Input discount code",
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.loading = false
          return
        }
        if(this.discount_pctge > 0 && this.is_discount_code == 0 && this.discount_code != null){
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: "Select either discount code or percentage",
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.loading = false
          return
        }
        if(this.customer_id == null){
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: "Select customer",
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.loading = false
          return
        }
        if(this.customer_id == null && this.from_wallet == true){
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: "Select customer",
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.loading = false
          return
        }
        if(this.payment_method == null){
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: "Select payment method",
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.loading = false
          return
        }
        if(this.type == "on_credit" && this.customer_id == null){
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: "Select customer",
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.loading = false
          return

        }
        if(this.type == "on_credit" && this.part_payment_amount > 0){
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: "Select either part payment or on credit",
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.loading = false
          return

        }
        if (this.type == null || this.type == "") {
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: "Select payment type",
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.loading = false
          return
          
        }
      
        var total_split = 0
        for (let index = 0; index < this.rows.split.length; index++) {
          if(this.rows.split[index].split_payment_amount != null){
            total_split += parseFloat(this.rows.split[index].split_payment_amount)
          }
        }

        var post = {
          "customer_id": this.customer_id,
          "discount_pctge": this.discount_pctge,
          "is_discount_code": this.is_discount_code,
          "discount_code": this.discount_code,
          "from_wallet": this.from_wallet,
          "on_credit" : this.on_credit,
          "payment_method": this.payment_method,
          "products": this.products,
          "platform": this.platform,
          "auth_code": this.user?.access_code?.code,
          "description": "new sale",
          "amount": this.total,
          "is_order":false,
          "part_payment_amount": this.part_payment_amount,
          "discount": this.discount_pctge,
          "vat": this.vat,
          "logistics": this.logistics,
          "split": this.rows.split,
          "type": this.type,
          "is_split_payment": this.is_split_payment,
          "payment_type": this.payment_type,
          'start_date': this.start_date,
          'end_date': this.end_date,
          'posting_day': this.posting_day

        }
        Sales.new_sale(post).then((result) => {
          this.response = {products: this.products, summary: result.data.data}
          this.ref = result.data.data.ref
          this.vat = this.vat
          this.cache()

          // localStorage.setItem('products', JSON.stringify(this.response.products))
          // localStorage.setItem('summary', JSON.stringify(this.response.summary))
          // localStorage.setItem('details', this.business_name)
          this.receiptKey++
          this.reset()
          this.showReceipt = true
          this.customer_id = null
          this.customerWallet_balance = 0
          this.customerSearch = [],
          this.searchCustomer = "",
          this.on_credit = false
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Sold',
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
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
      reset(){
        this.customer_id =  null
        this.discount_pctge = 0
        this.is_discount_code = 0
        this.discount_code = null
        this.from_wallet = false
        this.on_credit = false
        this.payment_method = "cash"
        this.products = []
        this.logistics = 0
        this.part_payment_amount = 0
        this.part_payment = false
        this.searchCustomer = ""
        this.is_split_payment = 0
        this.type = "full_payment"
        this.payment_type = null
        this.start_date = null,
        this.end_date = null,
        this.posting_day = null
        this.accrualModal.classic = false
        this.rows = {split:[{split_playment_method:null, split_payment_amount:null,bank_id:null}]}
        this.getProducts()
      },
      getTotal(){
        var sum = []
        for (let index = 0; index < this.products.length; index++) {
          var subtotal = this.products[index].qty * this.products[index].price
          sum.push(subtotal)
        }
        // sum all numbers in sum
        this.subtotal = 0
        for (let index = 0; index < sum.length; index++) {
          this.subtotal = this.subtotal + sum[index]
        }
        // get Vat
        Vat.details().then((result) => {
           this.vat = result.data.vat
           this.business_name = result.data.name
           // get total
           // get discount
           if(this.discount_pctge > 0){
            // discount should be net percentage of vat
             var discount = this.discount_pctge/100 * this.subtotal
             var vatAmt = this.vat/100 * this.subtotal
             this.total = this.subtotal - discount + vatAmt
             this.compKey++

           }else{
             var vatAmt = this.vat/100 * this.subtotal
             this.total = this.subtotal + vatAmt
             this.compKey++

           }
        })
      },
      authUser(){
        User.auth().then((result) => {
          this.user = result.data
        })
      }
    },
    computed:{
      read_scan(){
        // alert('scan')
      },
    },
    watch:{
      searchParam(){
        if(this.searchParam == ""){
          this.searchResult = []
        }
      },
     
      part_payment_amount(){
        if (this.part_payment_amount > 0 && this.on_credit == true) {
          this.part_payment = true
          this.type = "part_payment";
        }else{
          this.type = "on_credit"
        }
      },
     
      barcodeMode(newValue) {
    // Focus the input element when barcodeMode changes to true
    this.$nextTick(() => {
      if (newValue) {
        this.$refs.searchInput.focus();
      }
    });
  },
      searchCustomer(){
        if(this.searchCustomer == ""){
          this.customer_id = null
          this.customerWallet_balance = 0
        }
      },
      products(){
        this.getTotal()
      },

      discount_pctge(){
        this.getTotal()
      }
    },

    created() {
      this.authUser()
      this.getDetails()
      this.getProducts()
      this.getCustomers()
      this.getExpiry()
      this.shopName = localStorage.getItem('shopName')

    },
  }
</script>
<style scoped>
  nav{
    background-color: #f1f5fee9;
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    position: absolute;
  }
  hrDivider{
    height: 100px;
    border: 1px solid black;
  }
  li{
    margin-left: 3%;
    list-style-type: none;
    color: rgb(6, 6, 6);
    font-weight: 600;
    position: relative;
  }
  .productList {
    background-color:#cecece;
    padding: 7px;
    z-index: 10000;
    cursor: pointer;
  }

  .productList:hover{
    background-color: #f9f2f2;
  }
  #search{
    width: 500px;
  }

  .auth{
    margin-left: 23%;
  }
  .navBrand {
    width: 300px;
    color: white;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 24px;
    margin-right: 10%;
  }

  @media screen and( max-width: 992px) {
    .navBrand {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 12px;
      margin-right: 5%;
    }
    .search    {
      width: 180px;
    }

    .auth{
      margin-left: 1%;
    }
  }
  @media screen and( max-width: 778px) {
    .navBrand {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 12px;
      margin-right: 5%;
    }
    .search    {
      width: 100px;
    }


  }

  @media print {
    * { margin: 0 !important; padding: 0 !important; }
    #controls, .footer, .footerarea{ display: none; }
    html, body {
      /*changing width to 100% causes huge overflow and wrap*/
      height:100%;
      overflow: hidden;
      background: #FFF;
      font-size: 9.5pt;
    }

    .receipt { width: auto; left:0; top:0; }
    img { width:100%; }
    li { margin: 0 0 10px 20px !important;}
  }

  @media (max-width: 576px) {
  .table td input {
    width: 100%;  /* Ensure inputs take up full width on mobile */
    font-size: 14px;  /* Adjust font size for better readability on mobile */
  }
}

@media (min-width: 768px) {
  .table td input {
    width: auto;  /* Let the input field adjust itself on larger screens */
    font-size: 16px;  /* Increase font size on medium and large screens */
  }
}
.barcode-reader-section {
  margin: 1rem 0;
}
</style>
