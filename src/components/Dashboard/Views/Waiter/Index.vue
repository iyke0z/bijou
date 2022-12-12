<template>
  <div class="container-fluid">
    <div class="nav w-100 bg-info" style="height:50px">
        <!--  -->
        <li>
          <form action="">
            <input autocomplete="off"
                class="form-control mt-1"
                type="search" id="search"
                placeholder="search for products..."
                v-model="searchParam"
                @input="searchProduct">
          </form>
          <ul class="col-11">
            <li class="productList" v-for="product in searchResult" :key="product" @click="addProduct(product)">
              {{ product.name}}
              <b>
                <small class="bg-dark w-100 text-light"> {{product.price.toLocaleString()}}</small>
              </b>

            </li>
            <li>
            </li>
          </ul>
        </li>

    </div>

    <div class="container col-12"  style="    background-color: #f1f5fee9">
      <center>
        <div class="form-group">
          <label class=" mt-5" for="">Waiter Code</label>
          <input autocomplete="off" class="form-control col-4" v-model="auth_code" type="text" placeholder="Input Auth Code" required>
        </div>

        <div class="form-group">
          <label for="">Table Description</label>
          <input autocomplete="off" class="form-control col-4" v-model="description" type="text" placeholder="Table Description" required>
        </div>

      </center>
      <div class="row mt-5 ">
        <div class="col-12">
          <table class="table table-bordered">
            <thead class="thead thead-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>qty</th>
                <th>Price</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody :key="orderKey" >
              <tr v-for="(order, index) in products" :key="order.id">
                <td>{{index+1}}</td>
                <td>{{order.name}}</td>
                <td>
                   <input autocomplete="off" v-if="!update" type="number" min="1" :max="order.stock" step="any" v-model="order.qty" @input="updateOrder(order.qty, index, true)" class="form-control col-12">
                   <input autocomplete="off" v-if="update" type="number" min="1" :max="order.max" step="any" v-model="order.qty" @input="updateOrder(order.qty, index, true)" class="form-control col-12">
                </td>
                <td>&#8358; <input autocomplete="off" readonly type="number" v-model="order.price" step="any" @input="updateOrder(order.price, index, false)" style="border: 1px solid white"></td>
                <td>&#8358; {{(order.price * order.qty).toLocaleString()}}</td>
                <td>
                  <button class="btn btn-danger" @click="removeFromList(index)"><i class="fa fa-trash" aria-hidden="true"></i></button>
                </td>
              </tr>
              <tr><td colspan="6"></td></tr>
              <tr><td colspan="6"></td></tr>
              <tr><td colspan="6"></td></tr>
            </tbody>
          </table>
          <div class="row">
            <div class="col-4">
              <p class="lead">Subtotal:</p>
            </div>
            <div class="col-4">
              <p class="lead">&#8358; {{ this.subtotal.toLocaleString() }}</p>
            </div>
          </div>
          <!-- <div class="row">
            <div class="col-4">
              <p class="lead">Discount:</p>
            </div>
            <div class="col-3">
              <input autocomplete="off" type="number" v-model="discount_pctge" step="any" class="form-control" placeholder="0">
            </div>
            <b><span class="col">%</span></b>
          </div> -->
          <div class="row" v-show="update">
            <div class="col-4">
              <p class="lead">Customer:</p>
            </div>
            <div class="col-3">
              <input autocomplete="off"
                @input="search_customer"
                type="search"
                class="form-control"
                v-model="searchCustomer"
                placeholder="search customer">
                <span v-if="this.customer_id > 0">
                  <div class="row">
                    <div class="col-12">
                      <input autocomplete="off" v-model="from_wallet" @change="setWallet" :disabled="this.total > this.customerWallet_balance" type="checkbox" value="1"> Wallet
                  <small class="text-danger" v-if="this.total > this.customerWallet_balance">customer cannot afford this bill from wallet</small>
                    </div>
                    <div class="col-12">
                      <input autocomplete="off" v-model="on_credit" @change="setCredit" type="checkbox" value="1"> Credit
                    </div>
                  </div>

                </span>
            </div>
            <ul class="col-11">
              <li class="productList" v-for="customer in customerSearch" :key="customer" @click="addCustomer(customer)">
                {{ customer.name}}
              </li>
            </ul>
          </div>
          <div class="row">
            <div class="col-4">
              <p class="lead">V.A.T:</p>
            </div>
            <div class="col-4">
              <p class="lead">{{ this.vat }} %</p>
            </div>
          </div>
          <div class="row">
            <div class="col-4">
              <p class="lead">Total:</p>
            </div>
            <div class="col-4">
              <p class="lead">&#8358; {{ this.total.toLocaleString() }}</p>
            </div>
          </div>
          <div class="row ml-3">
            <div class="form-group" v-show="update">
              <label for="">Payment Method</label>
              <select v-model="payment_method" name="" class="form-control col-10" id="" @change="openModal">
                <option value="cash">Cash</option>
                <option value="transfer">Transfer</option>
                <option value="card">Card</option>
                <option v-if="customer_id != null " value="on_credit">On Credit</option>
                <option v-if="total <= customerWallet_balance && customer_id != null " value="wallet">Wallet</option>
                <option value="split">Split</option>
                <option value="complementary">Complementary</option>
              </select>
            </div>
            <div class="ml-3 form-group" v-if="payment_method == 'card'">
              <label for="">Bank</label>
              <select v-model="bank_id" name="" class="form-control col-10" id="">
                <option value="null">Select Bank</option>
                <option v-for="bank in banks" :key="bank.id" :value="bank.id">{{bank.name}}</option>
              </select>
            </div>
            <div class="form-group ml-5">
              <label for=""></label><br />
              <button class="btn btn-info mr-2" v-if="!update" :disabled="auth_code == '' && products.length == 0 " @click.prevent="place_order">
                Place Order <i class="fa fa-plus" aria-hidden="true"></i>
              </button>
              <button class="btn btn-warning mr-2" v-if="update" :disabled="auth_code == '' " @click.prevent="updateSaleOrder">
                Update Order <i class="fa fa-plus" aria-hidden="true"></i>
              </button>
              <button  v-show="update" :disabled="auth_code  == '' && products.length == 0" class="btn btn-success mr-2" @click.prevent="pay">
                Pay <i class="fa fa-money" aria-hidden="true"></i>
              </button>
              <button class="btn btn-grey" @click.prevent="reset">Reset <i class="fa fa-refresh" aria-hidden="true"></i></button>
              <button v-show="update" class="btn btn-grey" @click.prevent="printReceipt">Print Receipt <i class="fa fa-print" aria-hidden="true"></i></button>
            </div>
          </div>
        </div>
      </div>
      <!-- order summary -->
      <div class="row mt-5">
          <form @submit.prevent="active_orders">
            <input autocomplete="off" type="text" class="form-control" placeholder="input auth code" v-model="auth_code" required>
            <button class="btn btn-dark">View Active Orders</button>
          </form>
          <div v-show="all_active_orders != null">
            <table class="table" id="myTable" >
              <thead class="thead thead-dark">
                <tr>
                  <th>ref</th>
                  <th>description</th>
                  <th>waiter</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody :key="tableKey">
                <tr v-for="order in all_active_orders" :key="order.id">
                  <td>{{ order.id }}</td>
                  <td v-if="order.table_description != null">{{ order.table_description }}</td>
                  <td v-if="order.table_description == null">Null</td>
                  <td>{{ order.user.fullname }}</td>
                  <td>
                    <button class="btn btn-info" @click="getDetail(order.id)">Details</button>
                    <button class="btn btn-dark ml-2" @click="loadOrder(order.id, order.table_description)">Load Order</button>
                    <!-- <button class="btn btn-danger ml-2" @click="cancelOrder(order.id)">Cancel Order</button> -->
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="table" v-if="details != null">
              <thead class="thead thead-dark">
                <tr>
                  <th>product</th>
                  <th>ref</th>
                  <th>price</th>
                  <th>qty</th>
                  <th>status</th>
                </tr>
              </thead>
              <tbody :key="detailKey">
                <tr v-for="order in details[0]" :key="order">
                  <td>{{ order.product.name }}</td>
                  <td>{{ order.ref }}</td>
                  <td>{{ order.price }}</td>
                  <td>{{ order.qty }}</td>
                  <td class="bg-danger" v-if="order.prep_status == 'not_ready'">{{ order.prep_status }}</td>
                  <td class="bg-warning" v-if="order.prep_status == 'almost_ready'">{{ order.prep_status }}</td>
                  <td class="bg-success" v-if="order.prep_status == 'ready'">{{ order.prep_status }}</td>
                </tr>
              </tbody>
            </table>
          </div>
      </div>
    </div>
    <!-- split payment modal -->
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
                      <option value="card">Card</option>
                    </select>
                  </td>
                  <td>
                    <label for="">Amount</label>
                    <input autocomplete="off" required type="number" step="any" name="password" class="form-control col-8" v-model="rows.split[index].split_payment_amount" placeholder="Amount">
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
  </div >
</template>
<script>
import Product from '@/javascript/Api/Product'
import Customer from '@/javascript/Api/Customer'
import Vat from '@/javascript/Api/BusinessDetails'
import Sales from '@/javascript/Api/Sales'
import Receipt from './Receipt.vue'
import Swal from 'sweetalert2'
import User from '@/javascript/Api/User'
import Order from '@/javascript/Api/Orders'
import Orders from '@/javascript/Api/Orders'
import { Button, Modal } from '@/components/UIComponents'

  export default{
    components:{Receipt, Modal},
    data() {
      return {
        customer_id: null,
        discount_pctge:0,
        from_wallet:false,
        on_credit:false,
        payment_method:"cash",
        products: [],
        modals: {
          classic: false,
          notice: false,
          mini: false
        },
        allProducts: null,
        platform: "offline",
        receiptKey: 0,
        barcode:null,
        searchParam:"",
        searchResult: [],
        allCustomers:null,
        receipt: false,
        customerSearch:[],
        searchCustomer:"",
        subtotal:0,
        total:0,
        customerWallet_balance:0,
        vat:0,
        auth_code:"",
        compKey:0,
        business_name:null,
        response:null,
        showReceipt: false,
        tempStock:0,
        user:null,
        banks:null,
        bank_id:null,
        all_active_orders:null,
        tableKey:0,
        detailKey:0,
        orderKey:0,
        details:[],
        description:null,
        update:false,
        ref:null,
        rows: {split:[{split_playment_method:null, split_payment_amount:null,bank_id:null}]}
      }
    },

    methods: {
      openModal(){
        if(this.payment_method == 'split'){
          this.modals.classic = true
        }
      },
      getDetail(id){
        this.details = []
        for (let index = 0; index < this.all_active_orders.length; index++) {
          if(this.all_active_orders[index]['id'] == id){
            this.details.push(this.all_active_orders[index]['sales']);
          }
        }
        this.detailKey++
      },

      loadOrder(id, descr){
        this.getDetail(id)
        this.products = []
        this.description = descr
        this.ref = id

        this.details[0].forEach(element => {
          this.products.push({
              product_id: element['product']['id'],
              name:element['product']['name'],
              qty: element['qty'],
              stock: element['product']['stock'],
              price: element['price'],
              max: element['qty'] + element['product']['stock']
            })
        });

        this.orderKey++
        this.update = true
        this.details = []
        this.cache()
      },

      place_order(){
        var post = {
          "auth_code": this.auth_code,
          "products": this.products,
          "description": this.description
        }
        Sales.new_sale(post).then((result) => {
          this.receiptKey++
          this.reset()
          this.customerSearch = [],
          this.searchCustomer = "",
          this.description = null
          this.active_orders()
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Order Placed',
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.cache()
        }).catch((err) => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Unauthorized',
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
        });
      },
      updateSaleOrder(){
        var post = {
          "ref": this.ref,
          "auth_code": this.auth_code,
          "products": this.products,
          "description": this.description
        }
        Sales.update_sale(post).then((result) => {
          this.response = {products: this.products, summary:result.data.data}
          this.receiptKey++
          this.reset()
          this.customerSearch = [],
          this.searchCustomer = "",
          this.description = null
          this.update = false
          this.active_orders()
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Order Updated',
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.cache()
        }).catch((err) => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Unauthorized',
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })        });
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
      active_orders(){
        Orders.get_active_orders({"auth_code":this.auth_code}).then((result) => {
          this.all_active_orders = result.data.data
          this.tableKey++
        })
      },
      updateOrder(qty, index, isQty){
          if(isQty){
            this.products[index].qty = qty
            this.getTotal()
          }else{
            this.getTotal()
          }
      },

      getProducts(){
        Product.products().then((result) => {
          this.allProducts = result.data.data
        })
      },

      goHome(){
        this.$router.push("/admin/overview")
      },

      setWallet(){
        this.payment_method = "wallet"
      },

      setCredit(){
        this.payment_method = "on_credit"
      },

      getCustomers(){
        Customer.customers().then((result) => {
          this.allCustomers = result.data.data
        })
      },

      printReceipt(){
        this.$router.push('/receipt')
      },

      searchProduct(){
        // get detail from products where then name == orderData.request
          this.searchResult = []
          this.allProducts.forEach(product => {
            var request  = this.searchParam.toLowerCase()
              var productName = product.name.toLowerCase()
                if (request != "" && request !== " " && productName.match(request))
                  {
                    this.searchResult.push(
                    {product_id:product.id, stock:product.stock, name:product.name,qty: 1,price: product.price, category_id:product.category_id},)
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
        console.log(product)
        if(product.category_id != 2 ){
          this.products.push({
              product_id: product.product_id,
              name:product.name,
              qty: 1,
              stock: product.stock,
              price: product.price,
            })
            this.searchResult = []
            this.searchParam = ""
        }else{
          if(product.stock >= 1){
            this.products.push({
              product_id: product.product_id,
              name:product.name,
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
      getDetails(){
        Vat.details().then((result) => {
          this.business_name = result.data.name
          this.vat = result.data.vat
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
      cache(){
        if(this.products.length > 0){
          this.getTotal()
            var vatAmt = this.vat/100 * this.subtotal
            var total = this.subtotal + vatAmt
          var summary = {
            ref_no:this.ref,
            amount: this.subtotal,
            discount: this.discount_pctge,
            vat: this.vat,
            total:total,
          }
          localStorage.setItem('products', JSON.stringify(this.products))
          localStorage.setItem('summary', JSON.stringify(summary))
          localStorage.setItem('details', this.business_name)
        }
      },
      cancelOrder(ref){
        var post = {
            "ref":ref,
            "auth_code": this.auth_code
          }
          Sales.cancel_sale(post).then((result) => {
            this.cache()
            this.receiptKey++
            this.reset()
            this.showReceipt = true
            this.customer_id = null
            this.customerWallet_balance = 0
            this.customerSearch = [],
            this.searchCustomer = "",
            this.on_credit = false
            this.active_orders()
            this.bank_id = null
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Order Cancelled',
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000
            })
          }).catch((err) => {
            Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Unauthorized',
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          });
      },
      pay(){
        if(this.payment_method == "card" && this.bank_id == null) {
          Swal.fire({
              position: 'top-end',
              icon: 'warning',
              title: 'Select Bank',
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000
            })
        }else{
          var post = {
            "amount":this.total,
            "auth_code":this.auth_code,
            "ref":this.ref,
            "customer_id": this.customer_id,
            "discount_pctge": this.discount_pctge,
            "from_wallet": this.from_wallet,
            "on_credit" : this.on_credit,
            "payment_method": this.payment_method,
            "products": this.products,
            "bank_id": this.bank_id,
            "split": this.rows.split
          }
          Sales.pay(post).then((result) => {
            this.response = {products: this.products, summary:result.data.data}
            this.cache()
            this.receiptKey++
            this.reset()
            this.showReceipt = true
            this.customer_id = null
            this.customerWallet_balance = 0
            this.customerSearch = [],
            this.searchCustomer = "",
            this.on_credit = false
            this.active_orders()
            this.bank_id = null
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Payment Successfull',
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000
            })
          }).catch((err) => {
            Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Unauthorized',
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          });
        }

      },
      reset(){
        this.customer_id =  null
        this.discount_pctge = 0
        this.from_wallet = false
        this.payment_method = "cash"
        this.products = []
        this.update = false
        this.description = null
        this.details = []
        this.auth_code = ""
        this.all_active_orders  = null
        this.details =[]
        this.modals.classic = false
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
      getbanks(){
        Orders.banks().then((result) => {
          this.banks = result.data.data
        })
      }
    },
    computed:{
      classic(){
        return this.modals.classic
      }
    },
    
    watch:{
      classic(){
        if(this.modals.classic == false){
          this.payment_method == 'cash'
        }
      },

      auth_code(){
        if(this.auth_code != null){
          this.auth_code = this.auth_code.trim()
        }
      },
      payment_method(){
        if(this.payment_method != "card"){
          this.bank_id = null
        }
      },
      searchParam(){
        if(this.searchParam == ""){
          this.searchResult = []
        }
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
      this.getbanks()
      this.getDetails()
      this.getProducts()
      this.getCustomers()
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
    color: white;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 24px;
    margin-right: 5%;
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
</style>
