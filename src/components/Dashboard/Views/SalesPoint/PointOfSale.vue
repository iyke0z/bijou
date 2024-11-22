<template>
  <div>
    <div class="mb-2" v-if="expiry_response != 'active'">
        <span v-if="expiry_response == 'expired'" class="text-white bg-danger pr-2 pl-2 pt-2 pb-2">Subscription Expired <small>Subscribe to continue </small></span>
        <span v-if="expiry_response == 'active'" class="text-light bg-success pr-2 pl-2 pt-2 pb-2">Subscription Active</span>
        <span v-if="expiry_response == 'expires_today'" class="text-light bg-danger pr-2 pl-2 pt-2 pb-2">Subscription Expires Today</span>
        <span v-if="expiry_response == 'expires_tomorrow'" class="text-dark bg-info pr-2 pl-2 pt-2 pb-2">Subscription Expiring Tomorrow</span>
        <span v-if="expiry_response == 'expires_in_two_days'" class="text-dark bg-warning pr-2 pl-2 pt-2 pb-2">Subscription Expiring In Two Days</span>
    </div>
        
    <div class="nav w-100 bg-info" style="height:50px">
        <li class="navBrand" hidden>
          <a @click.prevent="goHome"> {{business_name}}</a>
        </li>
        <li>
          <form action="">
            <input
                class="form-control mt-1"
                style="width: auto;"
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
        <li> <button style="margin-top:8px; border:none; color:white" class="bg-danger" @click="logout">
          {{user.fullname}} <i class="fa fa-sign-out" aria-hidden="true">logout</i></button></li>
    </div>
    <div class="container col-12"  style="background-color: #f1f5fee9">
      <div class="row mt-5 ">
        <div class="col-12 table-responsive">
          <table class="table table-bordered">
            <thead class="thead thead-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>qty</th>
                <th>Price (&#8358;)</th>
                <th>Total (&#8358;)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(order, index) in products" :key="order.id">
                <td>{{index+1}}</td>
                <td>{{order.name}}</td>
                <td>
                   <input type="number" min="1" :max="order.stock" step="any" v-model="order.qty" @input="updateOrder(order.qty, index, true)" class="form-control">
                </td>
                <td><input type="number" v-model="order.price" step="any" @input="updateOrder(order.price, index, false)" style="border: 1px solid white"
                                class="form-control">
                </td>
                <td> {{(order.price * order.qty).toLocaleString()}}</td>
                <td>
                  <button class="btn btn-danger" @click="removeFromList(index)"><i class="fa fa-trash" aria-hidden="true"></i></button>
                </td>
              </tr>
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
          <div class="row">
            <div class="col-4">
              <p class="lead">Discount:</p>
            </div>
            <div class="col-3">
              <input type="number" v-model="discount_pctge" step="any" class="form-control" placeholder="0">
            </div>
            <b><span class="col">%</span></b>
          </div>
          <div class="row">
            <div class="col-4">
              <p class="lead">Customer:</p>
            </div>
            <div class="col-3">
              <input
                @input="search_customer"
                type="search"
                class="form-control col-12"
                v-model="searchCustomer"
                placeholder="search customer">
                <span v-if="this.customer_id > 0">
                  <div class="row">
                    <div>
                      <input v-model="from_wallet" @change="setWallet" :disabled="this.total > this.customerWallet_balance" type="checkbox" value="1"> Wallet
                  <small class="text-danger" v-if="this.total > this.customerWallet_balance">customer cannot afford this bill from wallet</small>
                    </div>
                    <div class="col-12">
                      <input v-model="on_credit" @change="setCredit" type="checkbox" value="1"> Credit
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
            <div class="col-8">
              <p class="lead">&#8358; {{ this.total.toLocaleString() }}</p>
            </div>
          </div>
          <div class="row ml-3">
            <div class="form-group">
              <label for="">Payment Method</label>
              <select v-model="payment_method" name="" class="form-control col-10" id="">
                <option value="cash">Cash</option>
                <option value="transfer">Transfer</option>
                <option value="card">POS</option>
                <option v-if="customer_id != null " value="on_credit">On Credit</option>
                <option v-if="total <= customerWallet_balance && customer_id != null " value="wallet">Wallet</option>
              </select>
            </div>
            <div class="form-group ml-5">
              <label for=""></label><br />
              <button class="btn btn-success mr-2" @click.prevent="pay">Pay <i class="fa fa-money" aria-hidden="true"></i></button>
              <button class="btn btn-grey" @click.prevent="reset">Reset <i class="fa fa-refresh" aria-hidden="true"></i></button>
              <button class="btn btn-grey" @click.prevent="printReceipt">Print Receipt <i class="fa fa-print" aria-hidden="true"></i></button>
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
// import { StreamBarcodeReader } from "vue-barcode-reader";

  export default{
    components:{ Calculator, Receipt},
    data() {
      return {
        customer_id: null,
        discount_pctge:0,
        is_discount_code: 0,
        discount_code: null,
        from_wallet:false,
        on_credit:false,
        payment_method:"cash",
        products: [],
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
        compKey:0,
        business_name:null,
        response:null,
        showReceipt: false,
        tempStock:0,
        user:null,
        expiry_response:null
      }
    },

    methods: {
      updateOrder(qty, index, isQty){
          if(isQty){
            this.products[index].qty = qty
            this.getTotal()
          }else{
            this.getTotal()
          }
      },
      getExpiry(){
        Auth.get_expiry().then((result) => {
          this.expiry_response = result.data.data

        })
      },
      onDecode (result) {
        console.log(result)
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
                    // {product_id:product.id, stock:product.stock, name:product.name,qty: 1,price: product.price,},
                    {product_id:product.id, has_stock:product.category.has_stock, stock:product.stock, name:product.name,qty: 1,price: product.price, category_id:product.category_id},

                    )
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
        if(product.has_stock == 0 ){
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
      logout(){
        Auth.logout().then(() => {
          localStorage.clear()
          this.$router.push({name:'Login'})
        })
      },
      getDetails(){
        Vat.details().then((result) => {
          this.business_name = result.data.name
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
          "auth_code": this.user.access_code.code,
          "description": "new sale",
          "amount": this.total,
          "is_order":false
        }
        Sales.new_sale(post).then((result) => {
          this.response = {products: this.products, summary:result.data.data}
          localStorage.setItem('products', JSON.stringify(this.response.products))
          localStorage.setItem('summary', JSON.stringify(this.response.summary))
          localStorage.setItem('details', this.business_name)
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
        }).catch((err) => {
          console.log(err)
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
      authUser(){
        User.auth().then((result) => {
          this.user = result.data
        })
      }
    },
    computed:{
      read_scan(){
        alert('scan')
      }
    },
    watch:{
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
      this.authUser()
      this.getDetails()
      this.getProducts()
      this.getCustomers()
      this.getExpiry()
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
</style>
