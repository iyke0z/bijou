<template>
  <div class="table-responsive"><br>
    <span class="loader" v-if="loading"></span>
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
              <th>expenditure type</th>
              <th>amount</th>
              <th>date</th>
              <th>logged by</th>
              <th>Payment Method</th>
              <th>Amount Expected</th>
              <th>Balance</th>
              <th>Amount Deposited</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody :key="tableKey">
            <tr v-for="(expenditure, index) in all_expenditures" :key="expenditure.id">
              <td>{{index+1}}</td>
              <td>{{expenditure.exp_type.name}}</td>
              <td>{{expenditure.amount.toLocaleString()}}</td>
              <td>{{dateTime(expenditure.created_at)}}</td>
              <td>{{expenditure.user.fullname}}</td>
              <td>{{expenditure.payment_method}}</td>
              <td>
                {{ ((expenditure.amount)).toLocaleString() }}
              </td>
              <td v-if="expenditure.payment_status == 'not_paid'">
                {{ ((expenditure.amount) - expenditure.part_payment_amount).toLocaleString() }}
              </td>
              <td v-else>
                0
              </td>
              <td v-if="expenditure.type == 'part_payment'">
                {{ (expenditure.part_payment_amount).toLocaleString() }}
              </td>
              <td v-else>
                {{ ((expenditure.amount)).toLocaleString() }}
              </td>
              <td>
                <p-button v-if="expenditure.payment_status == 'not_paid'" class="mr-2" title="update product plan" type="info" size="sm" 
                @click.prevent="openModal('update '+ expenditure.exp_type.name+' Plan', expenditure)">
                  <i class="fa fa-wrench"></i>
                </p-button>
                <span v-else class="mr-4">Paid</span>
                <p-button class="mr-2" title="upload documents" type="warning" size="sm" icon @click="openUploadModal(expenditure.id)">
                  <i class="fa fa-upload" aria-hidden="true"></i>
                </p-button>
                <p-button v-if="expenditure.documents.length > 0" class="mr-2" title="download documents" type="secondary" size="sm" icon @click="downloadDocs(expenditure.id)">
                  <i class="fa fa-download" aria-hidden="true"></i>
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
              <label for="">Is Split</label>
              <select v-model="is_split_payment" class="form-control" @change="is_split_payment = $event.target.value">
                    <option :value="1">True</option>
                    <option :value="0">False</option>
                  </select>
            </div>
            <div class="form-group">
              <label>Accrual</label>
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
                  <option value="part_payment">Part Payment</option>
                  <!-- <option value="is_accrual">Is Accrual</option> -->
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

              <!-- <div class="form-group" v-if="payment_method == 'is_accrual'">
                <label for="">Duration <small>(duration in months)</small></label>
                <input type="number" step="any" class="form-control" v-model="duration">
              </div> -->

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
        is_split_payment: 0,
        rows: {split:[{split_playment_method:null, split_payment_amount:null,bank_id:null}]},
        type: 'full_payment',
        loading: false,
        selectedId: null,
        payment_method : 'cash',
        payment_status : 'paid',
        part_payment_amount : 0,
        duration : 0,
        expenditureId:null,
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
      openModal(title, item){
        this.modalOpen = true
        this.modalTitle = title
        this.detail = item.id
        this.selectedId = item.id
      },
      openAccrualModal(){
        this.accrualModal.classic = true
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
        this.loading = true
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
            this.loading = false
        });
      },
      openUploadModal(expenditure){
        this.documentModal.classic = true
        this.expenditureId = expenditure
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

      updatePlan(){
        this.loading = true

        let payload = {
          payment_method: this.payment_method,
          payment_status: this.payment_status,
          part_payment_amount: this.part_payment_amount,
          duration: this.duration,
          type: this.type,
          is_split_payment: this.is_split_payment,
          split: this.rows.split,
          payment_type: this.payment_type,
          start_date: this.start_date,
          end_date: this.end_date,
          posting_day: this.posting_day
        }

        Expenditure.update_plan(payload, this.selectedId).then(res => {
          this.allexpenditures()

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
          this.payment_type = null
          this.start_date = null,
          this.end_date = null,
          this.posting_day = null
          this.accrualModal.classic = false
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

      setStatus(){
        if (this.payment_method == 'cash' || this.payment_method == 'transfer' || this.payment_method == "is_accrual") {
          this.payment_status = "paid"
        }else{
          this.payment_status = "not_paid"
        }
      },

      update_expenditue(){
        this.loading = true
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
            this.loading = false
        });
      },
      allexpenditures(){
        this.loading = true
        Expenditure.all_expenditures().then((result) => {
            this.all_expenditures = result.data.data
            this.tableKey++
            this.datatable()
            this.loading = false
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
      formData.append('expenditure_id', this.expenditureId);
      this.docForm.files.forEach((file, index) => {
        formData.append(`files[]`, file);
      });

      try {
       Expenditure.upload_documents(formData).then(res => {
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
    openUploadModal(expenditureId) {
      this.expenditureId = expenditureId;
      this.fetchUploadedDocs();
      this.documentModal.classic = true;
    },
    downloadDocs(id) {
    this.loading = true;

    Expenditure.download_documents(id)
    .then((response) => {
      const blob = new Blob([response.data], { type: 'application/zip' });
      const link = document.createElement('a');
      const fileName = `expenditure_documents_${id}.zip`;
      
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
        const res = await axios.get(`/api/expenditure-documents/${this.expenditureId}`);
        this.uploadedDocuments = res.data.documents;
      } catch (error) {
        console.error("Failed to fetch documents.");
      }
    }
  
    },
    created(){
      this.allexpenditures()
    }

  }
</script>

