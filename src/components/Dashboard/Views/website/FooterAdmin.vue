<template>
    <div class="table-responsive"><br>
      <span v-if="loading" class="loader"></span>
      
      <h3>Website Settings</h3><br>
      <div v-if="settings && !loading">
        <p><strong>Brand Name:</strong> {{ settings.brand_name }}</p>
        <p><strong>Footer Description:</strong> {{ settings.footer_description }}</p>
        <table class="table table-striped" v-if="socialLinks.length">
          <thead>
            <tr>
              <th>Label</th>
              <th>Path</th>
              <th>Icon</th>
              <th>Order</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="link in socialLinks" :key="link.id">
              <td>{{ link.label }}</td>
              <td>{{ link.path }}</td>
              <td>{{ link.icon || 'N/A' }}</td>
              <td>{{ link.order }}</td>
              <td>{{ link.is_active ? 'Yes' : 'No' }}</td>
              <td>
                <p-button
                  class="mr-2"
                  title="Delete"
                  type="danger"
                  size="sm"
                  icon
                  @click="deleteSocialLink(link.id)"
                >
                  <i class="fa fa-trash"></i>
                </p-button>
              </td>
            </tr>
          </tbody>
        </table>
        <p-button type="info" size="lg" icon @click="openModal('classic', 'Update Settings')">
          Update Settings
        </p-button>
      </div>
      <div v-else-if="!loading">
        <p-button type="success" size="lg" icon @click="openModal('classic', 'Create Settings')">
          Create Settings
        </p-button>
      </div>
  
      <modal :show.sync="modals.classic" headerClasses="justify-content-center">
        <h4 slot="header" class="title title-up">{{ modalTitle }}</h4>
        <form @submit.prevent="submit">
          <fieldset>
            <div class="form-group">
              <label>Brand Name</label>
              <input
                required
                type="text"
                class="form-control col-8"
                v-model="form.brand_name"
                placeholder="Brand Name"
              >
            </div>
            <div class="form-group">
              <label>Footer Description</label>
              <textarea
                required
                class="form-control col-8"
                v-model="form.footer_description"
                placeholder="Footer Description"
              ></textarea>
            </div>
            <div v-for="(link, index) in form.social_links" :key="index" class="link-group">
              <h5>Social Link {{ index + 1 }}</h5>
              <div class="form-group">
                <label>Label</label>
                <input
                  required
                  type="text"
                  class="form-control col-8"
                  v-model="link.label"
                  placeholder="Social Media Name"
                >
              </div>
              <div class="form-group">
                <label>Path</label>
                <input
                  required
                  type="text"
                  class="form-control col-8"
                  v-model="link.path"
                  placeholder="URL"
                >
              </div>
              <div class="form-group">
                <label>Icon (filename, e.g., instagram.svg)</label>
                <input
                  type="text"
                  class="form-control col-8"
                  v-model="link.icon"
                  placeholder="Icon filename"
                >
              </div>
              <div class="form-group">
                <label>Order</label>
                <input
                  required
                  type="number"
                  min="0"
                  class="form-control col-8"
                  v-model.number="link.order"
                  placeholder="Order"
                >
              </div>
              <div class="form-group">
                <label>Active</label>
                <input
                  type="checkbox"
                  v-model="link.is_active"
                  class="form-control col-8"
                >
              </div>
              <p-button type="danger" size="sm" @click="removeSocialLink(index)">Remove Link</p-button>
            </div>
            <p-button type="primary" size="sm" @click="addSocialLink">Add Social Link</p-button>
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
        modalTitle: null,
        modals: { classic: false },
        settings: null,
        socialLinks: [],
        form: {
          brand_name: null,
          footer_description: null,
          social_links: [{ label: null, path: null, icon: null, order: 0, is_active: true }],
        },
        loading: false,
      };
    },
    methods: {
      openModal(type, title) {
        this.modalTitle = title;
        this.modals[type] = true;
        if (this.settings) {
          this.form = {
            brand_name: this.settings.brand_name,
            footer_description: this.settings.footer_description,
            social_links: this.socialLinks.map(link => ({
              label: link.label,
              path: link.path,
              icon: link.icon,
              order: link.order,
              is_active: link.is_active,
            })),
          };
        } else {
          this.form = {
            brand_name: null,
            footer_description: null,
            social_links: [{ label: null, path: null, icon: null, order: 0, is_active: true }],
          };
        }
      },
      addSocialLink() {
        this.form.social_links.push({ label: null, path: null, icon: null, order: this.form.social_links.length, is_active: true });
      },
      removeSocialLink(index) {
        this.form.social_links.splice(index, 1);
      },
      submit() {
        this.loading = true;
        Promise.all([
          Website.updateSettings({
            brand_name: this.form.brand_name,
            footer_description: this.form.footer_description,
          }),
          Website.createSocialLinks({ links: this.form.social_links }),
        ])
          .then(([settingsResult, socialLinksResult]) => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Settings and social links updated successfully',
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000,
            });
            localStorage.removeItem('cache_website/settings');
            localStorage.removeItem('cache_website/social-links');
            this.modals.classic = false;
            this.fetchSettings();
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
      deleteSocialLink(id) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'This social link will be deleted.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
          if (result.isConfirmed) {
            this.loading = true;
            Website.deleteSocialLink(id)
              .then((result) => {
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: result.data.message,
                  customClass: 'Swal-wide',
                  showConfirmButton: false,
                  timer: 3000,
                });
                localStorage.removeItem('cache_website/social-links');
                this.fetchSettings();
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
          }
        });
      },
      fetchSettings() {
        this.loading = true;
        Promise.all([
          Website.showSettings(),
          Website.showSocialLinks(),
        ])
          .then(([settingsResult, socialLinksResult]) => {
            this.settings = settingsResult.data;
            this.socialLinks = socialLinksResult.data.links;
          })
          .catch(() => {
            this.settings = null;
            this.socialLinks = [];
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
    created() {
      this.fetchSettings();
    },
  }
  </script>
  
  <style scoped>
  .table-responsive {
    padding: 20px;
  }
  .link-group {
    border: 1px solid #ddd;
    padding: 10px;
    margin-bottom: 10px;
  }
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