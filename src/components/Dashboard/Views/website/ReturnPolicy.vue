<template>
    <div class="table-responsive"><br>
      <span v-if="loading" class="loader"></span>
      
      <h3>Return Policy</h3> <br/>
      <div v-if="returnPolicy && !loading">
        <p><strong>Description:</strong> {{ returnPolicy.description }}</p>
        <p-button type="info" size="lg" icon @click.native="openModal('classic', 'Update Return Policy', 'update')">
          Update
        </p-button>
      </div>
      <div v-else-if="!loading">
        <p-button type="success" size="lg" icon @click.native="openModal('classic', 'Create Return Policy', 'create')">
          Create Return Policy
        </p-button>
      </div>
  
      <!-- Create/Update Modal -->
      <modal :show.sync="modals.classic" headerClasses="justify-content-center">
        <h4 slot="header" class="title title-up">{{ modalTitle }}</h4>
        <form @submit.prevent="submit">
          <fieldset>
            <div class="form-group">
              <label>Description</label>
              <textarea required class="form-control col-8" v-model="form.description" placeholder="Return Policy Description"></textarea>
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
        modalTitle: null,
        modalAction: null,
        modals: { classic: false },
        returnPolicy: null,
        form: { description: null },
        loading: false,
      };
    },
    methods: {
      openModal(type, title, action) {
        this.modalTitle = title;
        this.modals[type] = true;
        this.modalAction = action;
        if (action === 'update' && this.returnPolicy) {
          this.updateMode = true;
          this.form = { description: this.returnPolicy.description };
        } else {
          this.updateMode = false;
          this.form = { description: null };
        }
      },
      submit() {
        this.loading = true;
        Website.createReturnPolicy(this.form).then((result) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000,
          });
          this.form = { description: null };
          this.modals.classic = false;
          this.fetchReturnPolicy();
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
      fetchReturnPolicy() {
        this.loading = true;
        Website.showReturnPolicy().then((result) => {
          this.returnPolicy = result.data;
        }).catch(() => {
          this.returnPolicy = null;
        });
        this.loading = false;
      },
    },
    created() {
      this.fetchReturnPolicy();
    },
  };
  </script>
  <style scoped>
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