<template>
    <div class="table-responsive"><br>
      <span v-if="loading" class="loader"></span>
      
      <h3>Contact Information</h3><br>
      <p-button type="success" size="lg" icon @click="openModal('classic', contact ? 'Update Contact' : 'Create Contact', contact ? 'update' : 'create')">
        {{ contact ? 'Update' : 'Add New' }}
      </p-button>
      <table id="table" class="table table-striped" v-if="!loading && contact">
        <thead>
          <tr>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody :key="tableKey">
          <tr>
            <td>{{ contact.email }}</td>
            <td>{{ contact.phone }}</td>
            <td>{{ contact.address }}</td>
            <td>
              <img
                v-if="contact.image"
                :src="url+`/${contact.image}`"
                alt="Contact Image"
                width="50"
                class="img-thumbnail"
              >
              <span v-else>No Image</span>
            </td>
            <td>
              <p-button
                class="mr-2"
                title="update"
                type="info"
                size="sm"
                icon
                @click="openModal('classic', 'Update Contact', 'update', contact)"
              >
                <i class="fa fa-edit"></i>
              </p-button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Create/Update Modal -->
      <modal :show.sync="modals.classic" headerClasses="justify-content-center">
        <h4 slot="header" class="title title-up">{{ modalTitle }}</h4>
        <div>
          <form @submit.prevent="updateMode ? update() : submit()" enctype="multipart/form-data">
            <fieldset>
              <div class="form-group">
                <label>Email</label>
                <input
                  required
                  type="email"
                  class="form-control col-8"
                  v-model="form.email"
                  placeholder="Email"
                >
              </div>
              <div class="form-group">
                <label>Phone</label>
                <input
                  required
                  type="text"
                  class="form-control col-8"
                  v-model="form.phone"
                  placeholder="Phone"
                >
              </div>
              <div class="form-group">
                <label>Address</label>
                <textarea
                  required
                  class="form-control col-8"
                  v-model="form.address"
                  placeholder="Address"
                ></textarea>
              </div>
              <div class="form-group">
                <label>Image Alt Text</label>
                <input
                  type="text"
                  class="form-control col-8"
                  v-model="form.image_alt"
                  placeholder="Image Alt Text"
                >
              </div>
              <div class="form-group">
                <label>Image</label>
                <input
                  :required="!updateMode"
                  type="file"
                  class="form-control col-8"
                  @change="handleFileChange"
                  accept="image/*"
                >
              </div>
              <!-- Image Preview -->
              <div class="form-group" v-if="imagePreview || (updateMode && currentImage)">
                <label>Image Preview</label><br>
                <img
                  :src="url+`/${currentImage}`"
                  alt="Preview"
                  class="img-preview"
                  style="max-width: 200px; max-height: 200px; object-fit: contain;"
                >
              </div>
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
        contact: null,
        form: { email: null, phone: null, address: null, image: null, image_alt: null },
        modals: { classic: false },
        modalTitle: null,
        modalAction: null,
        loading: false,
        imagePreview: null,
        currentImage: null,
        url: process.env.VUE_APP_STORAGE,

      };
    },
    methods: {
      openModal(type, title, action, contact) {
        this.modalTitle = title;
        this.modals[type] = true;
        this.modalAction = action;
        this.imagePreview = null;
        if (action === 'update' && contact) {
          this.updateMode = true;
          this.currentImage = contact.image;
          this.form = {
            email: contact.email,
            phone: contact.phone,
            address: contact.address,
            image: null,
            image_alt: contact.image_alt,
          };
        } else {
          this.updateMode = false;
          this.currentImage = null;
          this.form = { email: null, phone: null, address: null, image: null, image_alt: null };
        }
      },
      handleFileChange(e) {
        const file = e.target.files[0];
        this.form.image = file;
        if (file) {
          this.imagePreview = URL.createObjectURL(file);
        } else {
          this.imagePreview = null;
        }
      },
      handleImageError(event, contact) {
        console.error(`Failed to load image for contact: /storage/${contact.image}`);
        event.target.src = 'https://via.placeholder.com/50?text=No+Image';
      },
      submit() {
        this.loading = true;
        Website.createContact(this.form)
          .then((result) => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: result.data.message,
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000,
            });
            this.form = { email: null, phone: null, address: null, image: null, image_alt: null };
            this.imagePreview = null;
            this.fetchContact();
            this.modals.classic = false;
          })
          .catch((err) => {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: err?.response?.data?.error ?? err.response.data.message,
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000,
            });
          })
          .finally(() => {
            this.loading = false;
          });
      },
      update() {
        this.loading = true;
        Website.createContact(this.form) // Uses same endpoint as create
          .then((result) => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: result.data.message,
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000,
            });
            this.form = { email: null, phone: null, address: null, image: null, image_alt: null };
            this.imagePreview = null;
            this.currentImage = null;
            this.fetchContact();
            this.modals.classic = false;
          })
          .catch((err) => {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: err?.response?.data?.error ?? err.response.data.message,
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000,
            });
          })
          .finally(() => {
            this.loading = false;
          });
      },
      fetchContact() {
        this.loading = true;
        Website.showContact()
          .then((result) => {
            this.contact = result.data.info;
            this.contact.image = result.data.image;
            this.contact.image_alt = result.data.image_alt;
            this.datatable();
          })
          .catch((err) => {
            console.error('Failed to fetch contact:', err);
          })
          .finally(() => {
            this.loading = false;
          });
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
      beforeDestroy() {
        if (this.imagePreview) {
          URL.revokeObjectURL(this.imagePreview);
        }
      },
    },
    created() {
      this.fetchContact();
    },
  };
  </script>
  
  <style scoped>
  .img-preview {
    margin-top: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  .img-thumbnail {
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  </style>