<template>
  <div class="table-responsive"><br>
    <span class="loader" v-if="loading"></span>

    <p-button type="success" size="lg" icon @click.native="createPurchaseRoute()">
      Add New
    </p-button>
    <div>
      
    </div>
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Purchases</h5>
        <h6>Filter</h6>
        <form action="" @submit.prevent="filter">
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
              <th>amount</th>
              <!-- <th>added costs</th> -->
              <th>date</th>
              <th>Logged By</th>
              <th>Deposit</th>
              <th>Balance</th>
              <th>Transaction Status</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody :key="tableKey">
            <tr v-for="(purchase, index) in all_purchases" :key="purchase.id">
              <td>{{index+1}}</td>
              <td>₦{{purchase?.price?.toLocaleString()}}</td>
              <!-- <td>{{purchase?.added_costs?.toLocaleString()}}</td> -->
              <td>{{dateTime(purchase?.created_at)}}</td>
              <td>{{purchase?.user?.fullname}}</td>
              <td>₦{{(purchase?.price - purchase.total_balance)?.toLocaleString()}}</td>
              <td>₦{{(purchase.total_balance)?.toLocaleString()}}</td>
              <td v-if="purchase.total_balance > 0">Open</td>
              <td v-else>Closed</td>
              <td>
                <!-- <p-button class="mr-2" title="details" type="warning" size="sm" icon @click.prevent="goToRoute(purchase)">
                  <i class="fa fa-eye"></i>
                </p-button> -->
                <!-- <p-button class="mr-2" title="update" type="info" size="sm" icon @click.native="goToRoute(purchase)">
                  <i class="fa fa-edit"></i>
                </p-button> -->
                <p-button class="mr-2" title="details" type="primary" size="sm" icon @click="purchase_detail(purchase.id)">
                  <i class="fa fa-search" aria-hidden="true"></i>
                </p-button>
                <p-button class="mr-2" title="upload documents" type="warning" size="sm" icon @click="openUploadModal(purchase.id)">
                  <i class="fa fa-upload" aria-hidden="true"></i>
                </p-button>
                <p-button v-if="purchase.documents.length > 0" class="mr-2" title="download documents" type="secondary" size="sm" icon @click="downloadDocs(purchase.id)">
                  <i class="fa fa-download" aria-hidden="true"></i>
                </p-button>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
       
      </div>
    </div>
    <div class="card col-12 mr-3">
      <div class="card-body table-responsive">
        <h5 class="card-title">Purchase Items</h5>
        <table id="purchase" class="table table-stripped">
          <thead>
            <tr>
              <th>name</th>
              <th>cost</th>
              <th>previous stock</th>
              <th>qty purchased</th>
              <th>current stock</th>
              <th>Amount Expected</th>
              <th>Balance</th>
              <th>Amount Deposited</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody :key="purchaseKey">
            <tr v-for="purchase in purchase_details" :key="purchase.id">
              <td>
                {{ purchase?.product.name}}
              </td>
              <td>
                {{purchase?.cost.toLocaleString()}}
              </td>
              <td>
                {{ purchase?.previous_stock.toLocaleString()}}
              </td>
              <td>
                {{purchase?.qty.toLocaleString()}}
              </td>
              <td v-if="purchase.previous_stock != null">
                {{purchase.qty + purchase.previous_stock}}
              </td>
              <!-- expected amount-->
              <td>
                {{ ((purchase.cost * purchase.qty)).toLocaleString() }}
              </td>
              <!-- balance -->
              <td v-if="purchase.payment_status == 'not_paid'">
                {{ ((purchase.cost * purchase.qty) - purchase.part_payment_amount).toLocaleString() }}
              </td>
              <td v-else>
                0
              </td>
              <!-- deposited -->
              <td v-if="purchase.payment_status === 'not_paid'">
                {{ (purchase.part_payment_amount).toLocaleString() }}
              </td>
              <td v-else>
                {{ (purchase.cost * purchase.qty).toLocaleString() }}
              </td>
              <td v-if="purchase.payment_status == 'not_paid'">
                <p-button class="mr-2" title="update product plan" type="info" size="sm" @click.prevent="openModal('update '+ purchase.product.name+' Plan', purchase)">
                  <i class="fa fa-wrench"></i>
                </p-button>
              </td>
              <td v-else>Paid</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal :show.sync="modalOpen" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up">{{ modalTitle }}</h4>
        <div>
          <div>
            <h6>Payment History</h6>
            <b><p>Deposit: ₦{{ (itemDetails?.part_payment_amount)?.toLocaleString()}}</p></b>
            <b><p>Balance: ₦{{((itemDetails?.qty * itemDetails?.cost) - itemDetails?.part_payment_amount)?.toLocaleString()}}</p></b>
          </div>
          <br/>
          <h6>Payment Plan</h6>

          <form @submit.prevent="updatePlan" enctype="multipart/form-data" >
            <div class="form-group">
              <label for="">Is Split <small>(Are you paying for this with different payment methods?)</small></label>
              <select v-model="is_split_payment" class="form-control" @change="is_split_payment = $event.target.value">
                    <option :value="1">True</option>
                    <option :value="0">False</option>
                  </select>
            </div>
            <div class="form-group">
              <label>Accrual <small>(Is this an accrued transaction, i.e spread for a period?)</small></label>
              <select v-model="payment_type" class="form-control" @change="openAccrualModal">
                <option :value="null">None</option>
                <option :value="'prepayment'">Prepaid</option>
                <option :value="'postpayment'">Postpaid</option>
              </select>
            </div>
            <div class="form-group">
              <label for="">Payment Type</label>
                <select v-model="type" class="form-control">
                  <option value="full_payment">Full Payment</option>
                  <option value="on_credit">On Credit</option>
                  <option value="complementary">Complementary</option>
                  <option value="part_payment">Part Payment</option>
                </select>
              </div>
              <div class="form-group">
                <!-- fund wallet -->
                <label for="">Payment Method</label>
                <select name="" class="form-control" id="" v-model="payment_method" @change="setStatus">
                  <option value="cash">cash</option>
                  <option value="transfer">transfer</option>
                  <option value="pos">pos</option>
                </select>
              </div>
              
              <div class="form-group" v-if="type == 'part_payment'">
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

          <div>
            <form @submit.prevent="updatePlan" v-if="is_split_payment" enctype="multipart/form-data">
            <h4 slot="header" class="title title-up">Spilt Payment</h4>
            <fieldset >
                <table id="myTable">
                <tr v-for="(row, index) in rows.split" :key="index">
                  <td>{{ index+1 }}</td>
                  <td>
                    <label for="">Payment Method</label>
                    <select v-model="rows.split[index].split_playment_method" name="" class="form-control col-10" id="">
                      <option value="null">Select Payment Method</option>
                      <option value="cash">Cash</option>
                      <option value="transfer">Transfer</option>
                      <option value="card">POS</option>
                    </select>
                  </td>
                  <td>
                    <label for="">Amount</label>
                    <input autocomplete="off" required type="number" step="any" class="form-control col-8" v-model="rows.split[index].split_payment_amount" placeholder="Amount">
                  </td>
                  <td v-if="rows.split[index].split_playment_method == 'card'">
                    <label for="">bank</label>
                    <select v-model="rows.split[index].bank_id" name="" class="form-control col-10" id="">
                      <option value="null">Select Bank</option>
                      <option v-for="bank in banks" :key="bank.id" :value="bank.id">{{bank.name}}</option>
                    </select>
                  </td>

                  <td>
                    <button type="button" class="btn btn-success text-light col-2" @click="new_row()">+</button>
                    <button v-show="rows.split.length > 1" type="button" class="btn btn-danger text-light col-2" @click="delete_row(index)">x</button>
                  </td>
                </tr>
              </table>
                <div class="form-group">
                  <button type="submit" class="btn btn-success">Submit</button>
                </div>
            </fieldset>
          </form>
        </div>

        


        </div>
      <template slot="footer">
      <p-button type="default" link @click.prevent="modalOpen = false">Close</p-button>

      </template>
    </Modal>


    <Modal :show.sync="documentModal.classic" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up">{{ modalTitle }}</h4>

      <div>
        <h6>Upload Supporting Documents</h6>

        <form @submit.prevent="submitDocuments" enctype="multipart/form-data">
          <div class="form-group">
            <label for="document_type">Document Type</label>
            <select v-model="docForm.document_type" class="form-control" required>
              <option disabled value="">-- Select Type --</option>
              <option value="invoice">Invoice</option>
              <option value="receipt">Receipt</option>
              <option value="contract">Contract</option>
              <option value="quote">Quote</option>
            </select>
          </div>

          <div class="form-group">
      <label for="files">Click to upload {{ docForm.document_type || '' }} File(s)</label>
      <input
        type="file"
        ref="fileInput"
        class="form-control"
        multiple
        @change="handleFileUpload"
        required
      />

      <!-- Preview of selected files -->
      <div v-if="docForm.files.length" class="mt-3">
        <h6>Selected Files:</h6>
        <ul class="list-group">
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
            v-for="(file, index) in docForm.files"
            :key="index"
          >
            <div>
              <i class="fa fa-file mr-2 text-primary"></i>
              {{ file.name }}
            </div>
            <button
              class="btn btn-sm btn-outline-danger"
              @click="removeSelectedFile(index)"
              title="Remove"
            >
              <i class="fa fa-times"></i>
            </button>
          </li>
        </ul>
      </div>
    </div>


          <button class="btn btn-success" type="submit">Upload</button>
        </form>

        <hr v-if="uploadedDocuments.length">

        <div v-if="uploadedDocuments.length">
          <h6>Previously Uploaded Documents:</h6>
          <ul>
            <li v-for="(doc, index) in uploadedDocuments" :key="index">
              {{ doc.document_type.toUpperCase() }} -
              <a :href="doc.download_url" target="_blank">{{ doc.filename }}</a>
            </li>
          </ul>
        </div>
      </div>

      <template slot="footer">
        <p-button type="default" link @click.prevent="documentModal.classic = false">Close</p-button>
      </template>
    </Modal>
    <!-- accrual -->
    <modal :show.sync="accrualModal.classic" headerClasses="justify-content-center">
        <div>
          <h4 slot="header" class="title title-up">Accrual</h4>
          <form @submit.prevent="updatePlan" enctype="multipart/form-data">
            <fieldset >
                <table id="myTable">
                  <div class="form-group">
                    <label>Start Date</label>
                    <input type="datetime-local" class="form-control" v-model="start_date">
                  </div>
                  <div class="form-group">
                    <label>End Date</label>
                    <input type="datetime-local" class="form-control" v-model="end_date">
                  </div>
                  <div class="form-group">
                    <label>Posting Day</label>
                    <input type="number" min="1" max="31" class="form-control" v-model="posting_day">
                  </div>
              </table>
                <div class="form-group">
                  <button type="submit" class="btn btn-success">Submit</button>
                </div>
            </fieldset>
          </form>
        </div>
    </modal>

    

  </div>
</template>
<script>
import { Button, Modal } from '@/components/UIComponents'
import Category from '@/javascript/Api/Categories'
import Purchases from '@/javascript/Api/Purchases'
import Swal from 'sweetalert2'
import helpers from '@/javascript/helpers'
import Expenditure from '@/javascript/Api/Expenditure'
import Product from '@/javascript/Api/Product'
import axios from 'axios'
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
        category:null,
        form:{start_date:null, end_date:null},
        modals: {
          classic: false,
          notice: false,
          mini: false
        },
        loading: false,
        purchase_details:null,
        all_purchases: null,
        modalTitle:null,
        modalAction:null,
        modalContent:null,
        is_split_payment: 0,
        rows: {split:[{split_playment_method:null, split_payment_amount:null,bank_id:null}]},
        detail: null,
        modalOpen: false,
        type: 'full_payment',
        docForm: {
          document_type: '',
          files: []
        },
      documentModal: {
        classic: false,
          notice: false,
          mini: false
      },
      uploadedDocuments: [], // fetched previously or after upload
      purchaseId: null,
        selectedId: null,
        payment_method : 'cash',
        payment_status : 'paid',
        part_payment_amount : 0,
        duration : 0,
        itemDetails:null,
        payment_type: null,
          accrualModal: {
            classic: false
          },
          start_date: null,
          end_date: null,
          posting_day: null
        }
      
      
    },

    methods: {
      openAccrualModal(){
        this.accrualModal.classic = true
      },
      openModal(title, item){
        this.modalOpen = true
        this.modalTitle = title
        this.detail = item.id
        this.selectedId = item.id
        this.itemDetails = item
      },
      openUploadModal(purchase){
        this.documentModal.classic = true
        this.purchaseId = purchase
      },

      setStatus(){
        if (this.payment_method == 'cash' || this.payment_method == 'transfer' || this.payment_method == "is_accrual") {
          this.payment_status = "paid"
        }else{
          this.payment_status = "not_paid"
        }
      },

      updatePlan(){
        this.loading = true
        let payload = {
          payment_method: this.payment_method,
          payment_status: this.payment_status,
          part_payment_amount: this.part_payment_amount,
          duration: this.duration,
          type: this.type,
          split: this.rows.split,
          is_split_payment: this.is_split_payment,
          payment_type: this.payment_type,
          start_date: this.start_date,
          end_date: this.end_date,
          posting_day: this.posting_day
        }

        Product.update_plan(payload, this.selectedId).then(res => {
          this.allpurchases()
          this.start_date = null
          this.end_date = null
          this.posting_day = null
          this.payment_type = null
          this.accrualModal.classic = false
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: res.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.modalOpen = false
          this.loading = false
        }).catch(err => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: "error",
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.loading = false
        })
      },
      
      createPurchaseRoute(){
        this.$router.push('/purchase/create')
      },
      goToRoute(purchase){
        this.$router.push('/purchase/update/'+purchase.id)
      },
      new_row(){
        this.rows.split.push(
          {
            split_playment_method:null,
            split_payment_amount:null,
            bank_id:null
          }
        )
      },
      delete_row (id) {
        this.rows.split.splice(id, 1)
      },
      delete_purchase(purchase){
        this.loading = true
        Purchases.delete_purchase(purchase.id).then((result) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
          this.allpurchases()
          this.purchase_details = null
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
      allpurchases(){
        Purchases.purchases().then((result) => {
            this.all_purchases = result.data.data
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
        Purchases.report(this.form).then((result) => {
          this.all_purchases = result.data.data
            this.tableKey++
            this.datatable()
        })
      },
      delete_purchase_detail(purchase){
        Purchases.delete_details(purchase.id).then((result) => {
          this.purchase_detail(purchase.purchase_id)
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          })
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
      purchase_detail(id){
        for (let index = 0; index < this.all_purchases.length; index++) {
          if(this.all_purchases[index].id == id){
            this.purchase_details = this.all_purchases[index]['purchase_detail']
          }
        }
        this.purchaseKey++
        $(function() {
          $('#purchase').DataTable({
            "bDestroy": true,
                pageLength: 5,
                lengthMenu: [[5,10,20], [5, 10, 20]],
            });
        });
      },
      api_refresh(){
        this.allpurchases()
      },
      
      handleFileUpload(event) {
        const newFiles = Array.from(event.target.files);

        // Avoid duplicates (optional)
        const existingFileNames = this.docForm.files.map(f => f.name);
        const uniqueNewFiles = newFiles.filter(file => !existingFileNames.includes(file.name));

        this.docForm.files.push(...uniqueNewFiles);
      },
    async submitDocuments() {
      if (!this.docForm.document_type || !this.docForm.files.length) {
        alert("Please select a document type and upload at least one file.");
        return;
      }

      const formData = new FormData();
      formData.append('document_type', this.docForm.document_type);
      formData.append('purchase_id', this.purchaseId);
      this.docForm.files.forEach((file, index) => {
        formData.append(`files[]`, file);
      });

      try {
        Purchases.upload_documents(formData).then(res => {
          this.uploadedDocuments = res.data.documents || [];
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: res.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          });
          this.resetForm();
        });

       
      } catch (error) {
        console.error(error);
        alert('Upload failed.');
      }
    },
    resetForm() {
      this.docForm.document_type = '';
      this.docForm.files = [];
      this.$refs.fileInput.value = '';
      this.documentModal.classic = false; // Close the modal after upload
      window.location.reload(); // Reload the page to see the changes
    },
    openUploadModal(purchaseId) {
      this.purchaseId = purchaseId;
      this.fetchUploadedDocs();
      this.documentModal.classic = true;
    },
    downloadDocs(id) {
    this.loading = true;

    Purchases.download_documents(id)
    .then((response) => {
      const blob = new Blob([response.data], { type: 'application/zip' });
      const link = document.createElement('a');
      const fileName = `purchase_documents_${id}.zip`;
      
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Documents downloaded successfully.',
        customClass: 'Swal-wide',
        showConfirmButton: false,
        timer: 3000
      });
    })
    .catch((error) => {
      console.error('Download error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.data?.error || 'Failed to download documents.',
      });
    })
    .finally(() => {
      this.loading = false;
    });
},
    async fetchUploadedDocs() {
      try {
        const res = await axios.get(`/api/purchase-documents/${this.purchaseId}`);
        this.uploadedDocuments = res.data.documents;
      } catch (error) {
        console.error("Failed to fetch documents.");
      }
    }
  
    },
    created(){
      this.allpurchases()
    }

  }
</script>
<style scoped>
.list-group-item {
  font-size: 14px;
}
.fa-file {
  font-size: 16px;
}

</style>