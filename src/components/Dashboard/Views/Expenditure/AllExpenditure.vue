<template>
  <div class="table-responsive"><br>
    <p-button type="success" size="lg" icon @click.native="goToRoute()">
      Add New
    </p-button>
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Expenditures</h5>
        <h6>Filter</h6>
        <form action="" @submit.prevent="filter()">
          <div class="form-group">
            <label for="">Start Date</label>
          <input type="date" v-model="form.start_date" class="form-control col-6"  required>
          </div>
          <div class="form-group">
            <label for="">End Date</label>
            <input type="date" v-model="form.end_date" class="form-control col-6" required>
          </div>
          <button class="btn btn-success" type="submit">Fiter</button>
        </form>
        <div class="table-responsive">
          <table id="table" class="table table-striped">
          <thead>
            <tr>
              <th></th>
              <th>Expenditure Type</th>
              <th>Amount</th>
              <th>date</th>
              <th>Logged By</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody :key="tableKey">
            <tr v-for="(expenditure, index) in all_expenditures" :key="expenditure.id">
              <td>{{index+1}}</td>
              <td>{{expenditure.type.name}}</td>
              <td>{{expenditure.amount.toLocaleString()}}</td>
              <td>{{dateTime(expenditure.created_at)}}</td>
              <td>{{expenditure.user.fullname}}</td>
              <td>
                <p-button class="mr-2" title="update product plan" type="info" size="sm" @click.prevent="openModal('update '+ expenditure.type.name+' Plan', expenditure)">
                  <i class="fa fa-wrench"></i>
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
    </div>

     <!-- update modal -->
     <Modal :show.sync="modalOpen" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up">{{ modalTitle }}</h4>
        <div>
          <form @submit.prevent="updatePlan" enctype="multipart/form-data" >
              <div class="form-group">
                <!-- fund wallet -->
                <label for="">Payment Method</label>
                <select name="" class="form-control" id="" v-model="payment_method" @change="setStatus">
                  <option value="cash">cash</option>
                  <option value="transfer">transfer</option>
                  <option value="on_credit">on_credit</option>
                  <option value="part_payment">part payment</option>
                  <option value="is_accrual">accrual</option>
                </select>
              </div>
              
              <div class="form-group" v-if="payment_method == 'part_payment'">
                <label for="">Part Payment Amount</label>
                <input type="number" step="any" class="form-control" v-model="part_payment_amount">
              </div>

              <div class="form-group">
                <label for="">Payment Status</label>
                <select name="" class="form-control" v-model="payment_status" id="">
                  <option value="paid">Paid</option>
                  <option value="not_paid">Not Paid</option>
                </select>
              </div>
             
              
              <div class="form-group" v-if="payment_method == 'is_accrual'">
                <label for="">Duration <small>(duration in months)</small></label>
                <input type="number" step="any" class="form-control" v-model="duration">
              </div>

              <button class="btn btn-success" type="submit">UPDATE</button>
          </form>
        </div>
      <template slot="footer">
      <p-button type="default" link @click.prevent="modalOpen = false">Close</p-button>

      </template>
    </Modal>

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
        modalOpen: false,
        // 
        selectedId: null,
        payment_method : 'cash',
        payment_status : 'paid',
        part_payment_amount : 0,
        duration : 0
      }
    },
    methods: {
      openModal(title, item){
        this.modalOpen = true
        this.modalTitle = title
        this.detail = item.id
        this.selectedId = item.id
      },
      // openModal(type, title, action, expenditure){
      //   this.modalTitle = title
      //   this.modals[type] = true
      //   this.modalAction = action
      //   if(action == 'update'){
      //     this.updateMode = true
      //     this.expenditure = expenditure.id
      //     this.form = {
      //       amount:expenditure.amount,
      //     }
      //   }
      // },
      goToRoute(){
        this.$router.push('/expenditure/create/')
      },
      delete_expenditure(expenditure){
        Expenditure.delete(expenditure.id).then((result) => {
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
              title: err?.response?.data?.error ?? err.response.data.message,
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000
            })
        });
      },

      updatePlan(){
        let payload = {
          payment_method: this.payment_method,
          payment_status: this.payment_status,
          part_payment_amount: this.part_payment_amount,
          duration: this.duration
        }

        Expenditure.update_plan(payload, this.selectedId).then(res => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: res.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.modalOpen = false
        }).catch(err => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: "error",
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
        })
      },

      setStatus(){
        if (this.payment_method == 'cash' || this.payment_method == 'transfer' || this.payment_method == "is_accrual") {
          this.payment_status = "paid"
        }else{
          this.payment_status = "not_paid"
        }
      },

      update_expenditue(){
        Expenditure.update(this.form, this.expenditure).then((result) => {
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
              title: err?.response?.data?.error ?? err.response.data.message,
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000
            })
        });
      },
      allexpenditures(){
        Expenditure.all_expenditures().then((result) => {
            this.all_expenditures = result.data.data
            this.tableKey++
            this.datatable()
        })
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
      dateTime(date){
        return helpers.dateTime(date)
      },
      filter(){
        Expenditure.report(this.form).then((result) => {
          this.all_expenditures = result.data.data
            this.tableKey++
            this.datatable()
        })
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

