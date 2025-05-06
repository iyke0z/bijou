<template>
    <div class="table-responsive"><br>
      <span v-if="loading" class="loader"></span>
      
      <h3>Theme Settings</h3> <br/>
      <div v-if="themeSettings && !loading">
        <p><strong>Primary Color:</strong> {{ themeSettings?.primaryColor }}</p>
        <p><strong>Secondary Color:</strong> {{ themeSettings?.secondaryColor }}</p>
        <p-button type="info" size="lg" icon @click.native="openModal('classic', 'Update Theme Settings', 'update')">
          Update
        </p-button>
      </div>
      <div v-else-if="!loading">
        <p-button type="success" size="lg" icon @click.native="openModal('classic', 'Create Theme Settings', 'create')">
          Create Theme Settings
        </p-button>
      </div>
  
      <!-- Create/Update Modal -->
      <modal :show.sync="modals.classic" headerClasses="justify-content-center">
        <h4 slot="header" class="title title-up">{{ modalTitle }}</h4>
        <form @submit.prevent="submit">
          <fieldset>
            <div class="form-group">
              <label>Primary Color</label>
              <input required type="text" class="form-control col-8" v-model="form.primary_color" placeholder="e.g., #FF5733">
            </div>
            <div class="form-group">
              <label>Secondary Color</label>
              <input required type="text" class="form-control col-8" v-model="form.secondary_color" placeholder="e.g., #33C4FF">
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
        themeSettings: null,
        form: { primary_color: null, secondary_color: null },
        loading: false,
      };
    },
    methods: {
      openModal(type, title, action) {
        this.modalTitle = title;
        this.modals[type] = true;
        this.modalAction = action;
        if (action === 'update' && this.themeSettings) {
          this.updateMode = true;
          this.form = {
            primary_color: this.themeSettings.primaryColor,
            secondary_color: this.themeSettings.secondaryColor,
          };
        } else {
          this.updateMode = false;
          this.form = { primary_color: null, secondary_color: null };
        }
      },
      submit() {
        this.loading = true;
        const method = this.updateMode ? Website.updateThemeSettings(1, this.form) : Website.createThemeSettings(this.form);
        method.then((result) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000,
          });
          this.form = { primary_color: null, secondary_color: null };
          this.modals.classic = false;
          this.fetchThemeSettings();
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
      fetchThemeSettings() {
        this.loading = true;
        Website.showThemeSettings().then((result) => {
          this.themeSettings = result.data;
        }).catch(() => {
          this.themeSettings = null;
        });
        this.loading = false;
      },
    },
    created() {
      this.fetchThemeSettings();
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