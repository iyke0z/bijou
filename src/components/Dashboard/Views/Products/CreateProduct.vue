<template>
  <div class="table-responsive"><br>
    <span class="loader" v-if="loading"></span>
    <h4>Create New Product</h4>
    <form action="" @submit.prevent="submit">
          <div v-for="(product, index) in rows.products"  :key="index">
            <div>
              <label for="">Name</label>
              <input type="text" class="form-control" required v-model="rows.products[index].name" placeholder="name">
            </div>
            <div>
              <label for="">Category</label>
              <select name="" id="" class="form-control" v-model="rows.products[index].category_id" required>
                <option value="null">Select</option>
                <option :value="category.id" v-for="category in categories" :key="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div>
              <label for="">Price</label>
              <input type="number" placeholder="0.00" step="any" required class="form-control" v-model="rows.products[index].price">
            </div>
            <div>
              <label for="">Code</label>
              <input type="text" placeholder="barcode" class="form-control" v-model="rows.products[index].code">
            </div>
            <div>
              <label for="">Show on website</label>
              <select name="" id="" class="form-control" v-model="rows.products[index].show_on_website" required>
                <option :value="true">Yes</option>
                <option :value="false">No</option>
              </select>
            </div>
            <div>
              <button class="btn btn-info mr-2 mt-4" @click.prevent="addRow">+ Add More</button>
              <button class="btn btn-danger mt-4" v-if="index > 0" @click="deleteRow(index)">x Remove Item</button>
            </div>
          </div>
      <button class="btn btn-success col-12" type="submit">Submit <span v-if="loading" class="loader"></span></button>
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
            show_on_website:true,
            code:null
          }]},
          loading: false,
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
              code:null,
              show_on_website:null
            })
      },
      deleteRow(index){
        this.rows.products.splice(index, 1)
      },
      submit(){
        this.loading = true
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
        });
        this.loading = false

      }
    },
    created(){
      this.get_categories()
    }
  }
</script>
