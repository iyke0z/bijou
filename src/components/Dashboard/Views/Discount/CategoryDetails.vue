<template>
  <div class="table-responsive"><br>
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">products under <b>{{category.name}}</b> category</h5>
        <table class="table">
          <thead>
            <tr>
              <th></th>
              <th>name</th>
              <th>code</th>
              <th>category_id</th>
              <th>stock</th>
              <th>price</th>
              <th>out of stock?</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in products" :key="product.id">
              <td>{{index+1}}</td>
              <td>{{product.name}}</td>
              <td>{{product.code}}</td>
              <td>{{product.category_id}}</td>
              <td>{{product.stock.toLocaleString()}}</td>
              <td>{{product.price.toLocaleString()}}</td>
              <td v-if="product.out_of_stock == 1">Yes</td>
              <td v-else>No</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Categories from '@/javascript/Api/Categories';
import helpers from '@/javascript/helpers';
import Purchases from '@/javascript/Api/Purchases';
  export default{
    data(){
      return {
        category:null,
        products:null
      }
    },
    methods: {
      dateTime(date){
        return helpers.dateTime(date)
      },
      get_category(){
        Categories.categories().then((result) => {
            var categories = result.data.data
            for (let index = 0; index < categories.length; index++) {
              if(categories[index].id == this.$route.params.id){
                this.category = categories[index]
                this.products = categories[index]['products']
              }
            }
            this.datatable()
        })
      },
      datatable(){
        $(function() {
          $('.table').DataTable({
            "bDestroy": true,
                pageLength: 5,
                lengthMenu: [[5,10,20], [5, 10, 20]],
            });
        });
      },
    },
    created(){
      this.get_category()
    }
  }
</script>
