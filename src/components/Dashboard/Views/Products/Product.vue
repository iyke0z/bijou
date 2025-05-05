<template>
  <div class="table-responsive"><br>
    <span v-if="loading" class="loader"></span>

    <h3>Products</h3>
     <div>
       <table id="table" class="table table-striped">
         <thead>
           <tr>
             <th></th>
             <th>name</th>
             <th>image</th>
             <th>code</th>
             <th>category</th>
             <th>stock</th>
             <th>status</th>
             <th>visible on website</th>
             <th>Actions</th>
           </tr>
         </thead>
         <tbody>
            <tr v-for="(product, index) in products" :key="product.id" >
              <td>{{index+1}}</td>
              <td>{{product.name}}</td>
              <td><img :src="url+'/'+product.images[0]?.image" alt="" height="50" width="50" srcset=""></td>
              <td>{{product.code}}</td>
              <td>{{product.category.name}}</td>
              <td>{{product.stock}}</td>
              <td v-if="product.stock < 1" class="bg-danger">Out of Stock</td>
              <td v-else class="bg-success">Available</td>
              <td v-if="product.show_on_website">Yes</td>
              <td v-else>No</td>

              <td>
                <p-button class="mr-1" title="details" type="warning" size="sm" icon @click.prevent="goToRoute(product)">
                  <i class="fa fa-eye"></i>
                </p-button>
                <p-button class="mr-1" title="update" type="info" size="sm" icon @click.native="openModal('classic', 'Update Product', 'update', product)">
                  <i class="fa fa-edit"></i>
                </p-button>
                <a href="#" class="mr-1" v-if="product.stock > 0" title="transfer" type="danger" size="sm" icon @click.prevent="openTransferModal('classic', 'Initiate Product Transfer', product)">
                  Transfer Product
                </a>
                <a href="#" class="mr-1" v-if="product.show_on_website" title="product details" type="danger" size="sm" icon @click.prevent="openDetailsModal('classic', 'Update Product Details', product)">
                  Update Website Information
                </a>
              </td>
            </tr>
         </tbody>
       </table>
    </div>

         <!-- update modal -->
         <modal :show.sync="modals.classic" headerClasses="justify-content-center">
          <h4 slot="header" class=" title title-up" v-show="updateMode">{{ modalTitle }}</h4>
          <h4 slot="header" class="title title-up" v-show="!updateMode">{{ modalTitle }}</h4>
            <div v-if="form != null">
              <form @submit.prevent="update">
                  <div class="form-group">
                    <label for="">Name</label>
                    <input type="text" v-model="form.name" class="form-control">
                  </div>
                  <div class="form-group">
                    <label for="">Category</label>
                    <select name="" v-model="form.category_id" class="form-control" id="">
                      <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                      </option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="">Price</label>
                    <input type="text" v-model="form.price" class="form-control">
                  </div>
                  <div class="form-group">
                    <label for="">Stock</label>
                    <input type="text" v-model="form.stock" class="form-control" readonly>
                  </div>
                  <div class="form-group">
                    <label for="">Product Code</label>
                    <input type="text" v-model="form.code" class="form-control">
                  </div>
                  <div class="form-group">
                    <label for="">Product Description</label>
                    <input type="text" v-model="form.material" class="form-control">
                  </div>
                  <div class="form-group">
                    <label for="">Show on website</label>
                    <select name="" v-model="form.show_on_website" class="form-control" id="">
                      <option :value="true">Yes</option>
                <option :value="false">No</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <button type="submit" class="btn btn-success">Submit</button>
                  </div>
                 
              </form>
              <hr>
              <form @submit.prevent="upload">
                  <div>
                    <table class="table">
                      <thead>
                        <th>Image</th>
                        <th>Action</th>
                      </thead>
                      <tbody>
                        <tr v-for="(image, index) in form.images" :key="index">
                          <td><img :src="url+'/'+image.image" alt="" height="50" width="50"></td>
                          <td><p-button type="danger" size="sm" icon @click.prevent="delete_image(image.id)"><i class="fa fa-trash"></i></p-button></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="form-group">
                    <label for="">Image 1</label>
                    <input type="file" @change="uploadImage($event.target.files)" class="form-control" required>
                    <img :src="upl_image" alt="" height="60" width="80" class="ml-2"><br/>
                  </div>
                  <div class="form-group">
                    <label for="">Title <small>put the color type, or the view</small></label>
                    <input type="text" v-model="image_title" class="form-control" required>
                  </div>
                <button type="submit" class="btn btn-primary">Upload Files</button>
              </form>
            </div>
          <template slot="footer">
          <p-button type="default" link @click.prevent="modals.classic = false">Close</p-button>
          </template>
        </modal>

        <!-- transfer form -->
        <modal :show.sync="transferModal.classic" headerClasses="justify-content-center">
          <h4 slot="header" class=" title title-up">{{ modalTitle }}</h4>
              <form @submit.prevent="initiateTransfer">
                  <div class="form-group">
                    <label for="">Quantity</label>
                    <input v-model="transferForm.qty" type="number" step="any" class="form-control">
                  </div>
                  <div class="form-group">
                    <label for="">Destination Shop</label>
                    <select name="" v-model="transferForm.destination_shop"  class="form-control" id="">
                      <option v-for="shop in shops" :value="shop.id" :key="shop.id">{{shop.title}}</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="">Transaction Type</label>
                    <select name="" v-model="transferForm.transaction_method" class="form-control" id="">
                      <option value="transfer">Transfer</option>
                      <option value="return">Return</option>
                    </select>
                  </div>
                  
                  <div class="form-group">
                    <button type="submit" class="btn btn-success">Submit</button>
                  </div>
              </form>
              <hr>
        </modal>

        <!-- productDETAIL -->
             <!-- Product Detail Modal -->
    <modal :show.sync="productDetailModal.classic" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up">{{ modalTitle }}</h4>
      <form @submit.prevent="update_website_details">
        <div>
          <!-- Clothing and Shoes -->
          <div v-if="selectedProduct?.category?.name === 'clothing' || selectedProduct?.category?.name === 'shoes'">
            <div class="form-group">
              <label for="sizes">Sizes</label>
              <select
                id="sizes"
                class="form-control"
                v-model="detailForm.sizes"
                multiple
              >
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option v-if="selectedProduct?.category?.name === 'shoes'" value="US 6">US 6</option>
                <option v-if="selectedProduct?.category?.name === 'shoes'" value="US 7">US 7</option>
                <option v-if="selectedProduct?.category?.name === 'shoes'" value="US 8">US 8</option>
                <option v-if="selectedProduct?.category?.name === 'shoes'" value="US 9">US 9</option>
                <option v-if="selectedProduct?.category?.name === 'shoes'" value="US 10">US 10</option>
                <option v-if="selectedProduct?.category?.name === 'shoes'" value="US 11">US 11</option>
                <option v-if="selectedProduct?.category?.name === 'shoes'" value="US 12">US 12</option>
              </select>
            </div>
            <div class="form-group">
              <label for="colors">Colors</label>
              <select
                id="colors"
                class="form-control"
                multiple
                v-model="detailForm.colors"
              >
              <option value="Beige">Beige</option>
                <option value="Black">Black</option>
                <option value="Blue">Blue</option>
                <option value="Brown">Brown</option>
                <option value="Burgundy">Burgundy</option>
                <option value="Charcoal">Charcoal</option>
                <option value="Coral">Coral</option>
                <option value="Cream">Cream</option>
                <option value="Gold">Gold</option>
                <option value="Green">Green</option>
                <option value="Grey">Grey</option>
                <option value="Ivory">Ivory</option>
                <option value="Maroon">Maroon</option>
                <option value="Mustard">Mustard</option>
                <option value="Navy">Navy</option>
                <option value="Olive">Olive</option>
                <option value="Orange">Orange</option>
                <option value="Pink">Pink</option>
                <option value="Purple">Purple</option>
                <option value="Red">Red</option>
                <option value="Silver">Silver</option>
                <option value="Teal">Teal</option>
                <option value="Turquoise">Turquoise</option>
                <option value="White">White</option>
                <option value="Yellow">Yellow</option>
              </select>
            </div>
            <div class="form-group">
              <label for="material">Material</label>
              <input
                id="material"
                type="text"
                v-model="detailForm.material"
                class="form-control"
              />
            </div>
            <div class="form-group" v-if="form === 'shoes'">
              <label for="style">Style</label>
              <input
                id="style"
                v-model="detailForm.style"
                type="text"
                class="form-control"
              />
            </div>
          </div>
          <!-- books -->
          <div v-if="selectedProduct?.category?.name === 'books'">
            <div class="form-group">
              <label for="author">Author</label>
              <input
                id="author"
                type="text"
                v-model="detailForm.author"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="isbn">ISBN</label>
              <input
                id="isbn"
                type="text"
                v-model="detailForm.isbn"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="genre">Genre</label>
              <input
                id="genre"
                type="text"
                v-model="detailForm.genre"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="publication_date">Publication Date</label>
              <input
                id="publication_date"
                type="date"
                v-model="detailForm.publication_date"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="format">Format</label>
              <select
                id="format"
                v-model="detailForm.format"
                class="form-control"
                multiple
              >
                <option value="Hardcover">Hardcover</option>
                <option value="Paperback">Paperback</option>
                <option value="eBook">eBook</option>
              </select>
            </div>
          </div>
 <!-- Real Estate -->
          <div v-if="selectedProduct?.category?.name === 'real_estate'">
            <div class="form-group">
              <label for="location">Location</label>
              <input
                id="location"
                type="text"
                v-model="detailForm.location"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="type">Type</label>
              <input
                id="type"
                type="text"
                v-model="detailForm.type"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="bedrooms">Bedrooms</label>
              <input
                id="bedrooms"
                type="number"
                v-model="detailForm.bedrooms"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="bathrooms">Bathrooms</label>
              <input
                id="bathrooms"
                type="number"
                v-model="detailForm.bathrooms"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="square_footage">Square Footage</label>
              <input
                id="square_footage"
                type="number"
                v-model="detailForm.square_footage"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="contact_email">Contact Email</label>
              <input
                id="contact_email"
                type="email"
                v-model="detailForm.contact_email"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="contact_phone">Contact Phone</label>
              <input
                id="contact_phone"
                type="text"
                v-model="detailForm.contact_phone"
                class="form-control"
              />
            </div>
          </div>     
           <!-- Cars -->
           <div v-if="selectedProduct?.category?.name === 'cars'">
            <div class="form-group">
              <label for="make">Make</label>
              <input
                id="make"
                type="text"
                v-model="detailForm.make"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="model">Model</label>
              <input
                id="model"
                type="text"
                v-model="detailForm.model"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="year">Year</label>
              <input
                id="year"
                type="number"
                v-model="detailForm.year"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="mileage">Mileage</label>
              <input
                id="mileage"
                type="number"
                v-model="detailForm.mileage"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="fuel_type">Fuel Type</label>
              <select
                id="fuel_type"
                v-model="detailForm.fuel_type"
                class="form-control"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
              </select>
            </div>
            <div class="form-group">
              <label for="contact_email">Contact Email</label>
              <input
                id="contact_email"
                type="email"
                v-model="detailForm.contact_email"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="contact_phone">Contact Phone</label>
              <input
                id="contact_phone"
                type="text"
                v-model="detailForm.contact_phone"
                class="form-control"
              />
            </div>
          </div>   

          <div class="form-group">
            <button
              type="submit"
              class="btn btn-success"
            >
              Submit
            </button>
          </div>
        </div>
       
      </form>
     
      <template slot="footer">
        <button
          type="submit"
          class="btn btn-default"
          link
        >
          Close
        </button>
      </template>
    </modal>

  </div>
</template>
<script>
  import { Modal } from '@/components/UIComponents'
  import Product from '@/javascript/Api/Product'
  import Category from '@/javascript/Api/Categories'
  import Swal from 'sweetalert2'
import Shops from '@/javascript/Api/Shops'
import Api from '@/javascript/Api/Api'
import { type } from 'jquery';


  export default{
     components: {
      Modal
    },
    data() {
      return {
        updateMode:false,
        detailForm:null,
        all_users:null,
        filter:1,
        tableKey:0,
        user:null,
        form:null,
        modalTitle:null,
        products: null,
        img:null,
        loading:false,
        shops:null,
        url:null,
        modals: {
          classic: false,
          notice: false,
          mini: false
        },
        productDetailModal: {
          classic: false,
          notice: false,
          mini: false
        },
        transferModal: {
          classic: false,
          notice: false,
          mini: false
        },
        selectedProduct:null,
        upl_image:null,
        transferForm:{
         name: null,
         originating_shop: null,
         destination_shop: null,
         qty: 1,
         product_id: null,
         shop_one_user_id: null,
         shop_two_user_id: null,
         previous_stock: 0,
         current_stock: 0,
         image_title: "",
         previous_stock_two: 0,
         current_stock_two: 0,
         transaction_status: 'pending',
         transaction_method: null,
         detailForm: {
          sizes: [],
          colors: [],
          material: null,
          style: null,
          author: null,
          isbn: null,
          genre: null,
          publication_date: null,
          format: null,
          location: null,
          type: null,
          bedrooms: null,
          bathrooms: null,
          square_footage: null,
          contact_email: null,
          contact_phone: null,
          make: null,
          model: null,
          year: null,
          mileage: null,
          fuel_type: null,
         },
        }
      }
    },
    methods: {

      get_product(){
        this.loading = true
        Product.products().then((result) => {
          this.products = result.data.data
          this.datatable()
        })
        this.loading = false
      },
      getShops(){
       Shops.get_shops().then((result) => {
          this.shops = result.data.data
         })
      },

      getUrl(){
        this.url = process.env.VUE_APP_STORAGE_PATH;

        console.log(process.env.VUE_APP_STORAGE_PATH)
      },

      initiateTransfer(){
        Shops.initiate_transfer(this.transferForm).then(result => {
          Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: result.data.message,
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000
            })
            this.transferModal.classic = false
            this.get_product();
            this.tableKey++
            this.datatable()
            window.location.reload()
        })
      },
    
      uploadImage(e){
        this.img = e[0]
        var image = e[0]
          const reader = new FileReader();
          reader.readAsDataURL(image);
          reader.onload = e =>{
            var previewImage = e.target.result;
            this.upl_image = previewImage;
          };
      },
      upload(){
        var formData = new FormData()
        formData.append('product_id', this.form.id )
        formData.append('image', this.img)
        formData.append('title', this.image_title)
        Product.upload_image(formData).then((result) => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: result.data.message,
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000
            })
            this.upl_image = null
            this.img = null
            this.get_product()
            this.modals.classic = false
        }).catch((err) => {
          Swal.fire({
              position: 'top-end',
              icon: 'warning',
              title: 'error uploading images',
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000
            })
        });
      },
      allcategories(){
        Category.categories().then((result) => {
            this.categories = result.data.data
        })
      },
      goToRoute(product){
        this.$router.push('/product/detail/'+product.id)
      },
      openModal(type, title, action, product){
        this.modalTitle = title
        this.modals[type] = true
        this.modalAction = action
        if(action == 'update'){
            this.updateMode = true
            this.form = product
        }
      },

      openTransferModal(type, title, product){
        this.modalTitle = title
        this.transferModal['classic'] = true
        this.selectedProduct = product
        this.transferForm.shop_one_user_id = localStorage.getItem('authUser')
        this.transferForm.product_id = product.id       
        this.transferForm.originating_shop = localStorage.getItem('shopId')
        this.transferForm.name = product.name
      },

      openDetailsModal(type, title, product){
        this.productDetailModal['classic'] = true
        this.modalTitle = 'Update Product Details'
        this.selectedProduct = product
        this.detailForm = {
          sizes: [],
          colors: [],
          material: null,
          style: null,
      }},
      update(){
        Product.update(this.form, this.form.id).then((result) => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: result.data.message,
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000
            })
            this.modals.classic = false
            this.get_product();
            this.tableKey++
            this.datatable()
            window.location.reload()

          }).catch(err => {
          this.modals.classic = false

          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: "error",
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
        });
      },

      update_website_details(){
        Product.update_website_details(this.detailForm, this.selectedProduct.id).then((result) => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: result.data.message,
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000
            })
            this.productDetailModal.classic = false
            this.get_product();
            this.tableKey++
            this.datatable()
            window.location.reload()

          }).catch(err => {
          this.productDetailModal.classic = false

          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: "error",
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
        });
      },
      

      delete_user(user){
        this.loading = true

        Product.delete(user.id).then((result) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.get_product()
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
      },

      delete_image(id){
        this.loading = true
        Product.delete_image(id).then((result) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.get_product()
          this.modals.classic = false
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

      filter_table(){
        if(this.filter == 1){
            this.all_users = this.all_users
            this.api_refresh()
        }else if(this.filter == 2){
            this.all_users = this.active_users
            this.api_refresh()
        }else if(this.filter == 3){
            this.all_users = this.inactive_users
            this.api_refresh()
        } else if(this.filter == 4){
          this.all_users = this.banned_users
          this.api_refresh()
        } else{
            this.all_users = this.vip_users
            this.api_refresh()
        }
      },
        api_refresh(){
            this.allUsers()
        },
    },
    created(){
      this.get_product()
      this.allcategories()
      this.getUrl()
      this.getShops()
    }

  }
</script>