<template>
  <div>
    <h4>Update Purchase</h4>
    <form action="" @submit.prevent="submit">
      <div class="form-group">
        <label for="">Added Cost</label>
        <input type="text" class="form-control col-5" v-model="rows.added_cost" required>
      </div>
      <h6>Add New Item</h6>
      <table class="table table-striped">
        <tr v-for="(purchase, index) in rows.new_purchase"  :key="index">
          <td>
            <label for="">Product</label>
            <select name="" id="" class="form-control" v-model="rows.new_purchase[index].product_id">
              <option value="null">Select</option>
              <option :value="product.id" v-for="product in products" :key="product.id">
                {{ product.name }}
              </option>
            </select>
          </td>
          <td>
            <label for="">Quantity</label>
            <input type="text" class="form-control" v-model="rows.new_purchase[index].qty" placeholder="qty">
          </td>
          <td>
            <label for="">Cost Price</label>
            <input type="number" placeholder="0.00" step="any" class="form-control" v-model="rows.new_purchase[index].cost">
          </td>
          <td>
            <button class="btn btn-info mr-2 mt-4" type="button" @click.prevent="addRow">+</button>
            <button class="btn btn-danger mt-4" type="button" v-if="index > 0" @click="deleteRow(index)">x</button>
          </td>
        </tr>
      </table>
      <!-- ###### -->
      <h6>Update Previous Item</h6>
      <table class="table">
        <thead>
          <tr v-for="(purchase, index) in rows.purchase"  :key="index">
            <td>
              <label for="">Product</label>
              <select name="" id="" class="form-control" v-model="rows.purchase[index].product_id" required>
                <option value="null">Select</option>
                <option :value="product.id" v-for="product in products" :key="product.id">
                  {{ product.name }}
                </option>
              </select>
            </td>
            <td>
              <label for="">Quantity</label>
              <input type="text" class="form-control" required v-model="rows.purchase[index].qty" placeholder="qty">
            </td>
            <td>
              <label for="">Cost Price</label>
              <input type="number" placeholder="0.00" step="any" required class="form-control" v-model="rows.purchase[index].cost">
            </td>
          </tr>
        </thead>
      </table>
      <button class="btn btn-success" type="submit">Submit <span v-if="loading" class="loader"></span></button>
    </form>
  </div>
</template>
<script>
  import Product from '@/javascript/Api/Product';
  import Swal from 'sweetalert2';
import Purchases from '@/javascript/Api/Purchases';
  export default{
    data(){
      return{
        purchase:null,
        rows: {
          new_purchase:[{
              purchase_id:this.$route.params.id,
              product_id:null,
              qty:null,
              cost:null
          }],
          added_cost:0,
          purchase:[{
              product_id:null,
              qty:null,
              cost:null
          }]},
          loading:false,
        products:null
      }
    },
    methods: {
      get_products(){
        Product.products().then((result) => {
          this.products = result.data.data
        })
      },
      addRow(){
        this.rows.new_purchase.push({
                product_id:null,
                qty:null,
                cost:null
            })
      },
      deleteRow(index){
        this.rows.new_purchase.splice(index, 1)
      },
      get_detail(){
        Purchases.purchases().then((result) => {
          var purchases = result.data.data
          for (let index = 0; index < purchases.length; index++) {
            if(purchases[index].id == this.$route.params.id){
                this.rows.purchase = purchases[index].purchase_detail
            }

          }
        }).catch((err) => {

        });
      },
      submit(){
        this.loading = true

        if(this.rows.new_purchase.length ==1 && this.rows.new_purchase[0].qty == null && this.rows.new_purchase[0].cost == null){
            this.rows.new_purchase = []        
          }
        Purchases.update(this.rows, this.$route.params.id).then((result) => {
          
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.loading = false

          this.$router.push({name:'all_purchases'})
        }).catch((err) => {
          this.loading = false

          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: err.response.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
        });
      }
    },
    created(){
      this.get_detail()
      this.get_products()
    }
  }
</script>
