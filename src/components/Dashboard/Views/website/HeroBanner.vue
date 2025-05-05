<template>
    <div class="table-responsive"><br>
      <span v-if="loading" class="loader"></span>
      
      <h3>Hero Banners</h3><br>
      <p-button type="success" size="lg" icon @click="openModal('classic', 'New Hero Banner', 'create')">
        Add New
      </p-button>
      <table id="table" class="table table-striped" v-if="!loading">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Description</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(banner, index) in all_banners" :key="banner.id">
            <td>{{ index + 1 }}</td>
            <td>{{ banner.title }}</td>
            <td>{{ banner.description }}</td>
            <td>
              <img
                :src="url+`/hero_banners/${banner.image}`"
                alt="Banner"
                width="50"
                class="img-thumbnail"
              >
            </td>
            <td>
              <p-button
                class="mr-2"
                title="update"
                type="info"
                size="sm"
                icon
                @click="openModal('classic', 'Update Hero Banner', 'update', banner)"
              >
                <i class="fa fa-edit"></i>
              </p-button>
              <p-button
                class="mr-2"
                title="delete"
                type="danger"
                size="sm"
                icon
                @click.prevent="delete_banner(banner)"
              >
                <i class="fa fa-trash"></i>
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
                <label>Title</label>
                <input
                  required
                  type="text"
                  class="form-control col-8"
                  v-model="form.title"
                  placeholder="Banner Title"
                >
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea
                  required
                  class="form-control col-8"
                  v-model="form.description"
                  placeholder="Banner Description"
                ></textarea>
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
                  :src="imagePreview || url+`/hero_banners/${currentImage}`"
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
        banner: null,
        form: { title: null, description: null, image: null },
        modals: { classic: false },
        all_banners: null,
        modalTitle: null,
        modalAction: null,
        loading: false,
        imagePreview: null,
        currentImage: null,
        url: process.env.VUE_APP_STORAGE,
      };
    },
    computed: {
      previewUrl() {
        return this.imagePreview || (this.updateMode && this.currentImage ? `/storage/hero_banners/${this.currentImage}` : null);
      },
    },
    methods: {
      openModal(type, title, action, banner) {
        this.modalTitle = title;
        this.modals[type] = true;
        this.modalAction = action;
        this.imagePreview = null;
        if (action === 'update') {
          this.updateMode = true;
          this.banner = banner.id;
          this.currentImage = banner.image;
          this.form = { title: banner.title, description: banner.description, image: null };
        } else {
          this.updateMode = false;
          this.currentImage = null;
          this.form = { title: null, description: null, image: null };
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
      handleImageError(event, banner) {
        console.error(`Failed to load image for banner ID ${banner.id}: /storage/hero_banners/${banner.image}`);
        event.target.src = 'https://via.placeholder.com/50?text=No+Image';
      },
      submit() {
        this.loading = true;
        Website.createHeroBanner(this.form)
          .then((result) => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: result.data.message,
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000,
            });
            this.form = { title: null, description: null, image: null };
            this.imagePreview = null;
            this.allBanners();
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
          this.loading = false;

      },
      update() {
        this.loading = true;
        Website.updateHeroBanner(this.banner, this.form)
          .then((result) => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: result.data.message,
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000,
            });
            this.allBanners();
            this.updateMode = false;
            this.form = { title: null, description: null, image: null };
            this.imagePreview = null;
            this.currentImage = null;
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
          
          this.loading = false;

      },
      delete_banner(banner) {
        this.loading = true;
        Website.deleteHeroBanner(banner.id)
          .then((result) => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: result.data.message,
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000,
            });
            this.allBanners();
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
            this.loading = false;
      },
      allBanners() {
        this.loading = true;
        Website.showHeroBanners()
          .then((result) => {
            this.all_banners = result.data.images;
            this.datatable();
          })
          .catch((err) => {
            console.error('Failed to fetch banners:', err);
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
      this.allBanners();
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