<template>
    <div class="table-responsive"><br>
      <span v-if="loading" class="loader"></span>
      
      <h3>FAQs</h3> <br/>
      <p-button type="success" size="lg" icon @click.native="openModal('classic', 'New FAQ', 'create')">
        Add New
      </p-button>
      <table id="table" class="table table-striped" v-if="!loading">
        <thead>
          <tr>
            <th></th>
            <th>Question</th>
            <th>Answer</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody :key="tableKey">
          <tr v-for="(faq, index) in all_faqs" :key="faq.id">
            <td>{{index+1}}</td>
            <td>{{faq?.question}}</td>
            <td>{{faq?.answer}}</td>
            <td>
              <p-button class="mr-2" title="update" type="info" size="sm" icon @click.native="openModal('classic', 'Update FAQ', 'update', faq)">
                <i class="fa fa-edit"></i>
              </p-button>
              <p-button class="mr-2" title="delete" type="danger" size="sm" icon @click.prevent="delete_faq(faq)">
                <i class="fa fa-trash"></i>
              </p-button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Create/Update Modal -->
      <modal :show.sync="modals.classic" headerClasses="justify-content-center">
        <h4 slot="header" class="title title-up">{{ modalTitle }}</h4>
        <form @submit.prevent="updateMode ? update() : submit()">
          <fieldset>
            <div class="form-group">
              <label>Question</label>
              <input required type="text" class="form-control col-8" v-model="form.question" placeholder="FAQ Question">
            </div>
            <div class="form-group">
              <label>Answer</label>
              <textarea required class="form-control col-8" v-model="form.answer" placeholder="FAQ Answer"></textarea>
            </div>
            <div class="form-group">
              <button type="submit" class="btn btn-success">Submit</button>
            </div>
          </fieldset>
        </form>
        <template slot="footer">
          <p-button type="default" link @click.prevent="modals.classic = false">Close</p-button>
        </template>
      </modal>
    </div>
  </template>
  
  <script>
  import { Button, Modal } from '@/components/UIComponents';
  import Website from '@/javascript/Api/Website';
  import Swal from 'sweetalert2';
  
  export default {
    components: {
      Modal,
      [Button.name]: Button,
    },
    data() {
      return {
        updateMode: false,
        tableKey: 0,
        faq: null,
        form: { question: null, answer: null },
        modals: { classic: false },
        all_faqs: null,
        modalTitle: null,
        modalAction: null,
        loading: false,
      };
    },
    methods: {
      openModal(type, title, action, faq) {
        this.modalTitle = title;
        this.modals[type] = true;
        this.modalAction = action;
        if (action === 'update') {
          this.updateMode = true;
          this.faq = faq.id;
          this.form = { question: faq.question, answer: faq.answer };
        } else {
          this.updateMode = false;
          this.form = { question: null, answer: null };
        }
      },
      submit() {
        this.loading = true;
        Website.createFAQ(this.form).then((result) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000,
          });
          this.form = { question: null, answer: null };
          this.modals.classic = false;
          this.allFAQs();
        }).catch((err) => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: err?.response?.data?.error ?? err.response.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000,
          });
        });
        this.loading = false;
      },
      update() {
        this.loading = true;
        Website.updateFAQ(this.faq, this.form).then((result) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000,
          });
          this.allFAQs();
          this.updateMode = false;
          this.form = { question: null, answer: null };
          this.modals.classic = false;
        }).catch((err) => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: err?.response?.data?.error ?? err.response.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000,
          });
        });
        this.loading = false;
      },
      delete_faq(faq) {
        this.loading = true;
        Website.deleteFAQ(faq.id).then((result) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000,
          });
          this.allFAQs();
        }).catch((err) => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: err?.response?.data?.error ?? err.response.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000,
          });
        });
        this.loading = false;
      },
      allFAQs() {
        this.loading = true;
        Website.showFAQ().then((result) => {
          this.all_faqs = result.data.faqs;
          this.datatable();
        }).catch(() => {
          this.all_faqs = [];
        });
        this.loading = false;
      },
      datatable() {
        $(function() {
          $('#table').DataTable({
            bDestroy: true,
            pageLength: 5,
            lengthMenu: [[5, 10, 20], [5, 10, 20]],
          });
        });
      },
    },
    created() {
      this.allFAQs();
    },
  };
  </script>
  <style>
  .loader {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border: 16px solid black;
        border-top: 16px solid gray;
        border-radius: 50%;
        width: 120px;
        height: 120px;
        animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>