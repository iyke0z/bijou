<template>
  <div>
    <h4>Create New Product</h4>
    <form action="" @submit.prevent="submit">
      <table class="table">
        <thead>
          <tr v-for="(product, index) in rows.products"  :key="index">
            <td>
              <label for="">Name</label>
              <input type="text" class="form-control" required v-model="rows.products[index].name" placeholder="name">
            </td>
            <td>
              <label for="">Category</label>
              <select name="" id="" class="form-control" v-model="rows.products[index].category_id" required>
                <option value="null">Select</option>
                <option :value="category.id" v-for="category in categories" :key="category.id">
                  {{ category.name }}
                </option>
              </select>
            </td>
            <td>
              <label for="">Price</label>
              <input type="number" placeholder="0.00" step="any" required class="form-control" v-model="rows.products[index].price">
            </td>
            <td>
              <label for="">Code</label>
              <input type="text" placeholder="barcode" class="form-control" v-model="rows.products[index].code">
            </td>
            <td>
              <button class="btn btn-info mr-2 mt-4" @click.prevent="addRow">+</button>
              <button class="btn btn-danger mt-4" v-if="index > 0" @click="deleteRow(index)">x</button>
            </td>
          </tr>
        </thead>
      </table>
      <button class="btn btn-success" type="submit">Submit</button>
    </form>
  </div>
</template>
<script>
  import Categories from '@/javascript/Api/Categories';
  import Product from '@/javascript/Api/Product';
  import Swal from 'sweetalert2';
  export default{
    data(){
      return{
        rows: {products:[{
            name:null,
            category_id:null,
            stock:0,
            price:null,
            code:null
          }]},
        categories:null
      }
    },
    methods: {
      get_categories(){
        Categories.categories().then((result) => {
          this.categories = result.data.data
        })
      },
      addRow(){
        this.rows.products.push({
              name:null,
              category_id:null,
              stock:0,
              price:null,
              code:null
            })
      },
      deleteRow(index){
        this.rows.products.splice(index, 1)
      },
      submit(){
        Product.create(this.rows).then((result) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.rows.products = [{
              name:null,
              category_id:null,
              stock:0,
              price:null,
              code:null
          }]
        }).catch((err) => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: err.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
        });
      }
    },
    created(){
      this.get_categories()
    }
  }
</script>
