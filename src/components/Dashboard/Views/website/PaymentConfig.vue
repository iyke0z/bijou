<template>
    <div class="table-responsive"><br>
      <span v-if="loading" class="loader"></span>
      
      <h3>Payment Config</h3> <br/>
      <div v-if="paymentConfig && !loading">
        <p><strong>Paystack Key:</strong> {{ paymentConfig?.paystackKey }}</p>
        <p><strong>Flutterwave Key:</strong> {{ paymentConfig?.flutterwaveKey || 'Not set' }}</p>
        <p-button type="info" size="lg" icon @click.native="openModal('classic', 'Update Payment Config', 'update')">
          Update
        </p-button>
      </div>
      <div v-else-if="!loading">
        <p-button type="success" size="lg" icon @click.native="openModal('classic', 'Create Payment Config', 'create')">
          Create Payment Config
        </p-button>
      </div>
  
      <!-- Create/Update Modal -->
      <modal :show.sync="modals.classic" headerClasses="justify-content-center">
        <h4 slot="header" class="title title-up">{{ modalTitle }}</h4>
        <form @submit.prevent="submit">
          <fieldset>
            <div class="form-group">
              <label>Payment Gateway</label>
              <input required type="text" class="form-control col-8" v-model="form.payment_gateway" placeholder="e.g., Paystack">
            </div>
            <div class="form-group">
              <label>API Key</label>
              <input required type="text" class="form-control col-8" v-model="form.api_key" placeholder="API Key">
            </div>
            <div class="form-group">
              <label>Secret Key</label>
              <input required type="text" class="form-control col-8" v-model="form.secret_key" placeholder="Secret Key">
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
        paymentConfig: null,
        form: { payment_gateway: null, api_key: null, secret_key: null },
        loading: false,
      };
    },
    methods: {
      openModal(type, title, action) {
        this.modalTitle = title;
        this.modals[type] = true;
        this.modalAction = action;
        if (action === 'update' && this.paymentConfig) {
          this.updateMode = true;
          this.form = {
            payment_gateway: null,
            api_key: this.paymentConfig.paystackKey,
            secret_key: null,
          };
        } else {
          this.updateMode = false;
          this.form = { payment_gateway: null, api_key: null, secret_key: null };
        }
      },
      submit() {
        this.loading = true;
        const method = this.updateMode ? Website.updatePaymentConfig(1, this.form) : Website.createPaymentConfig(this.form);
        method.then((result) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000,
          });
          this.form = { payment_gateway: null, api_key: null, secret_key: null };
          this.modals.classic = false;
          this.fetchPaymentConfig();
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
      fetchPaymentConfig() {
        this.loading = true;
        Website.showPaymentConfig().then((result) => {
          this.paymentConfig = result.data;
        }).catch(() => {
          this.paymentConfig = null;
        });
        this.loading = false;
      },
    },
    created() {
      this.fetchPaymentConfig();
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