<template>
  <div class="table-responsive">
    <h4>New Purchase</h4>
    <form action="" @submit.prevent="submit">
      <div class="form-group">
        <label for="">Added Cost</label>
        <input type="text" class="form-control col-5" v-model="rows.added_cost" required>
      </div>
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
            <td>
              <button class="btn btn-info mr-2 mt-4" type="button" @click.prevent="addRow">+</button>
              <button class="btn btn-danger mt-4" type="button" v-if="index > 0" @click="deleteRow(index)">x</button>
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
        rows: {added_cost:0, purchase:[{
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
        this.rows.purchase.push({
                product_id:null,
                qty:null,
                cost:null
            })
      },
      deleteRow(index){
        this.rows.purchase.splice(index, 1)
      },
      submit(){
        this.loading = true
        Purchases.create(this.rows).then((result) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.rows.purchase = [{
              product_id:null,
                qty:null,
                cost:null
            }]
          this.loading = false

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
      }
    },
    created(){
      this.get_products()
    }
  }
</script>
