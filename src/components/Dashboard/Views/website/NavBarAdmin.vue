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
              <th>Platform</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="link in socialLinks" :key="link.id">
              <td>{{ link.label }}</td>
              <td>{{ link.path }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else>No social links available.</p>
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
            <div v-for="link in form.social_links" :key="link.label" class="link-group">
              <h5>{{ link.label }}</h5>
              <div class="form-group">
                <label>URL</label>
                <input
                  required
                  type="text"
                  class="form-control col-8"
                  v-model="link.path"
                  :placeholder="`Enter ${link.label} URL`"
                >
              </div>
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
        modalTitle: null,
        modals: { classic: false },
        settings: null,
        socialLinks: [],
        form: {
          brand_name: null,
          footer_description: null,
          social_links: [
            { label: 'Instagram', path: null },
            { label: 'Facebook', path: null },
            { label: 'Twitter', path: null },
            { label: 'Pinterest', path: null },
          ],
        },
        loading: false,
      };
    },
    methods: {
      openModal(type, title) {
        this.modalTitle = title;
        this.modals[type] = true;
        if (this.settings && this.socialLinks.length) {
          this.form = {
            brand_name: this.settings.brand_name,
            footer_description: this.settings.footer_description,
            social_links: this.socialLinks.map(link => ({
              label: link.label,
              path: link.path,
            })),
          };
        } else {
          this.form = {
            brand_name: null,
            footer_description: null,
            social_links: [
              { label: 'Instagram', path: null },
              { label: 'Facebook', path: null },
              { label: 'Twitter', path: null },
              { label: 'Pinterest', path: null },
            ],
          };
        }
        console.log('Form social links:', this.form.social_links); // Debug
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
            console.error('Submit error:', err); // Debug
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: err?.response?.data?.error ?? err.response?.data?.message ?? 'An error occurred',
              customClass: 'Swal-wide',
              showConfirmButton: false,
              timer: 3000,
            });
          })
          .finally(() => {
            this.loading = false;
          });
      },
      fetchSettings() {
        this.loading = true;
        Promise.all([
          Website.showSettings(),
          Website.showSocialLinks(),
        ])
          .then(([settingsResult, socialLinksResult]) => {
            console.log('Settings:', settingsResult.data); // Debug
            console.log('Social Links:', socialLinksResult.data.links); // Debug
            this.settings = settingsResult.data;
            this.socialLinks = socialLinksResult.data.links;
          })
          .catch((err) => {
            console.error('Fetch settings error:', err); // Debug
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
  </style>