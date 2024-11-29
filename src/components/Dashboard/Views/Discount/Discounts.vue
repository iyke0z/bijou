<template>
  <div class="table-responsive"><br>
    <h3>Categories</h3> <br/>
    <p-button type="success" size="lg" icon @click.native="openModal('classic', 'New Category', 'create')">
      Add New
    </p-button>
    <div>
    </div>
    <table id="table" class="table table-striped">
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody :key="tableKey">
        <tr v-for="(category, index) in all_categories" :key="category.id">
          <td>{{index+1}}</td>
          <td>{{category.name}}</td>
          <td>
            <p-button class="mr-2" title="details" type="warning" size="sm" icon @click.prevent="goToRoute(category)">
              <i class="fa fa-eye"></i>
            </p-button>
            <p-button class="mr-2" title="update" type="info" size="sm" icon @click.native="openModal('classic', 'Update Category', 'update', category)">
              <i class="fa fa-edit"></i>
            </p-button>
            <p-button class="mr-2" title="delete" type="danger" size="sm" icon @click.prevent="delete_category(category)">
              <i class="fa fa-trash"></i>
            </p-button>
          </td>
        </tr>
      </tbody>
    </table>

     <!-- update modal -->
    <modal :show.sync="modals.classic" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up" v-show="updateMode">{{ modalTitle }}</h4>
      <h4 slot="header" class="title title-up" v-show="!updateMode">{{ modalTitle }}</h4>
        <div>
          <fieldset v-if="updateMode">
            <form action=""  @submit.prevent="update">
              <div class="form-group">
                <label for="">Name</label>
                <input required type="text" name="password" class="form-control col-8" v-model="form.name">
              </div>
              <div class="form-group">
                <button type="submit" class="btn btn-success">Submit</button>
              </div>
            </form>
          </fieldset>
          <form @submit.prevent="submit" enctype="multipart/form-data" v-if="!updateMode">
            <fieldset >
                <table id="myTable">
                <tr v-for="(row, index) in rows.category" :key="index">
                  <td>{{ index+1 }}</td>
                  <td>
                    <input required type="text" name="password" class="form-control col-8" v-model="rows.category[index].name" placeholder="Category Name">
                  </td>
                  <td>
                    <button type="button" class="btn btn-success text-light col-2" @click="new_row()">+</button>
                    <button v-show="rows.category.length > 1" type="button" class="btn btn-danger text-light col-2" @click="delete_row(index)">x</button>
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

  </div>
</template>
<script>
import { Button, Modal } from '@/components/UIComponents'
import Category from '@/javascript/Api/Categories'
import Swal from 'sweetalert2'
import helpers from '@/javascript/helpers'
  function delete_row(id){console.log(id)}
  export default{
    components: {
      Modal
    },
    data() {
      return {
        updateMode:false,
        tableKey:0,
        rowCount:1,
        category:null,
        form:null,
        modals: {
          classic: false,
          notice: false,
          mini: false
        },
        all_categories: null,
        modalTitle:null,
        modalAction:null,
        modalContent:null,
        rows:{category:[{name:null}]}
      }
    },
    methods: {
      openModal(type, title, action, category){
        this.modalTitle = title
        this.modals[type] = true
        this.modalAction = action
        if(action == 'update'){
          this.updateMode = true
          this.category = category.id
          this.form = {name:category.name}
        }
      },
      goToRoute(category){
        this.$router.push('/category/details/'+category.id)
      },
      delete_category(category){
        Category.delete(category.id).then((result) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.allcategories()
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
      },
      submit(){
        Category.create(this.rows).then((result) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.rows.category = [{name:null}]
          this.allcategories()
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
      },
      update(){
        Category.update(this.form, this.category).then((result) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.updateMode = false
          this.form = {name:null}
          this.modals.classic = false
          this.allcategories()
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
      },
      allcategories(){
        Category.categories().then((result) => {
            this.all_categories = result.data.data
            this.tableKey++
            this.datatable()
        })
      },
      new_row(){
        this.rows.category.push({name:null})
      },
      delete_row (id) {
        this.rows.category.splice(id, 1)
      },
      datatable(){
        $(function() {
          $('#table').DataTable({
            "bDestroy": true,
                pageLength: 5,
                lengthMenu: [[5,10,20], [5, 10, 20]],
            });
        });
      },

          filter_table(){
                if(this.filter == 1){
                    this.all_categories = this.all_categories
                    this.api_refresh()
                }else if(this.filter == 2){
                    this.all_categories = this.active_categorys
                    this.api_refresh()
                }else if(this.filter == 3){
                    this.all_categories = this.inactive_categorys
                    this.api_refresh()
                } else if(this.filter == 4){
                  this.all_categories = this.banned_categorys
                  this.api_refresh()
                } else{
                   this.all_categories = this.vip_categorys
                   this.api_refresh()
                }
          },
        api_refresh(){
            this.allcategories()
        },
    },
    created(){
      this.allcategories()
    }

  }
</script>
