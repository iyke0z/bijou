<template>
  <div>
    <p-button type="success" size="lg" icon @click.native="goToRoute()">
      Add New
    </p-button>
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Expenditure Types</h5>
        <table id="table" class="table table-striped">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody :key="tableKey">
            <tr v-for="(expenditure, index) in all_expenditures" :key="expenditure.id">
              <td>{{index+1}}</td>
              <td>{{expenditure.name}}</td>
              <td>
                <p-button class="mr-2" title="update" type="info" size="sm" icon @click.native="openModal('classic', 'Update Type', 'update', expenditure)">
                  <i class="fa fa-edit"></i>
                </p-button>
                <p-button class="mr-2" title="delete" type="danger" size="sm" icon @click.prevent="delete_expenditure(expenditure)">
                  <i class="fa fa-trash"></i>
                </p-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

     <!-- update modal -->
     <modal :show.sync="modals.classic" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up" v-show="updateMode">{{ modalTitle }}</h4>
      <h4 slot="header" class="title title-up" v-show="!updateMode">{{ modalTitle }}</h4>
        <div>
          <fieldset v-if="updateMode">
            <form action=""  @submit.prevent="update_expenditue">
              <div class="form-group">
                <label for="">Name</label>
                <input required type="text" name="password" class="form-control col-8" v-model="form.name">
              </div>
              <div class="form-group">
                <button type="submit" class="btn btn-success">Update</button>
              </div>
            </form>
          </fieldset>
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
import Expenditure from '@/javascript/Api/Expenditure'
import Swal from 'sweetalert2'
import helpers from '@/javascript/helpers'
  export default{
    components: {
      Modal
    },
    data() {
      return {
        updateMode:false,
        tableKey:0,
        purchaseKey:0,
        rowCount:1,
        expenditure:null,
        form:{start_date:null, end_date:null},
        modals: {
          classic: false,
          notice: false,
          mini: false
        },
        expenditure_details:null,
        all_expenditures: null,
        modalTitle:null,
        modalAction:null,
        modalContent:null,
      }
    },
    methods: {
      openModal(type, title, action, expenditure){
        this.modalTitle = title
        this.modals[type] = true
        this.modalAction = action
        if(action == 'update'){
          this.updateMode = true
          this.expenditure = expenditure.id
          this.form = {
            name:expenditure.name,
          }
        }
      },
      goToRoute(){
        this.$router.push('/expenditure/type/')
      },
      delete_expenditure(expenditure){
        Expenditure.delete_type(expenditure.id).then((result) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.allexpenditures()
          this.expenditure_details = null
        }).catch((err) => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
        });
      },
      update_expenditue(){
        Expenditure.update_type(this.form, this.expenditure).then((result) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.updateMode = false
          this.form = {start_date:null, end_date:null}
          this.modals.classic = false
          this.allexpenditures()
        }).catch((err) => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
        });
      },
      allexpenditures(){
        Expenditure.all_types().then((result) => {
            this.all_expenditures = result.data.data
            this.tableKey++
            this.datatable()
        })
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
      dateTime(date){
        return helpers.dateTime(date)
      },

      api_refresh(){
          this.allexpenditures()
      },
    },
    created(){
      this.allexpenditures()
    }

  }
</script>

