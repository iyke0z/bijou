<template>
  <div class="table-responsive"><br>
    <span v-if="loading" class="loader"></span>
    
    <h3>About</h3><br>
    <div v-if="about && !loading">
      <p><strong>Title:</strong> {{ about?.story?.title }}</p>
      <p><strong>Description:</strong> {{ about?.story?.description }}</p>
      <p><strong>Values Title:</strong> {{ about?.values?.title }}</p>
      <table class="table table-striped" v-if="about.values.items.length">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in about.values.items" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.description }}</td>
            <td>
              <p-button
                class="mr-2"
                title="Delete"
                type="danger"
                size="sm"
                icon
                @click="deleteItem(item.id)"
              >
                <i class="fa fa-trash"></i>
              </p-button>
            </td>
          </tr>
        </tbody>
      </table>
      <p-button type="info" size="lg" icon @click="openModal('classic', 'Update About', 'update')">
        Update
      </p-button>
    </div>
    <div v-else-if="!loading">
      <p-button type="success" size="lg" icon @click="openModal('classic', 'Create About', 'create')">
        Create About
      </p-button>
    </div>

    <!-- Create/Update Modal -->
    <modal :show.sync="modals.classic" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up">{{ modalTitle }}</h4>
      <form @submit.prevent="submit" enctype="multipart/form-data">
        <fieldset>
          <div class="form-group">
            <label>Title</label>
            <input required type="text" class="form-control col-8" v-model="form.title" placeholder="About Title">
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea required class="form-control col-8" v-model="form.description" placeholder="About Description"></textarea>
          </div>
          <div class="form-group">
            <label>Values Title</label>
            <input required type="text" class="form-control col-8" v-model="form.item_title" placeholder="Values Title">
          </div>
          <div v-for="(item, index) in form.items" :key="index" class="item-group">
            <h5>Item {{ index + 1 }}</h5>
            <div class="form-group">
              <label>Name</label>
              <input
                required
                type="text"
                class="form-control col-8"
                v-model="item.name"
                placeholder="Item Name"
              >
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea
                required
                class="form-control col-8"
                v-model="item.description"
                placeholder="Item Description"
              ></textarea>
            </div>
            <p-button type="danger" size="sm" @click="removeItem(index)">Remove Item</p-button>
          </div>
          <p-button type="primary" size="sm" @click="addItem">Add Item</p-button>
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
      about: null,
      form: {
        title: null,
        description: null,
        item_title: null,
        items: [{ name: null, description: null }],
      },
      loading: false,
    };
  },
  methods: {
    openModal(type, title, action) {
      this.modalTitle = title;
      this.modals[type] = true;
      this.modalAction = action;
      if (action === 'update' && this.about) {
        this.updateMode = true;
        this.form = {
          title: this.about.story.title,
          description: this.about.story.description,
          item_title: this.about.values.title,
          items: this.about.values.items.map(item => ({
            name: item.name,
            description: item.description,
          })),
        };
      } else {
        this.updateMode = false;
        this.form = {
          title: null,
          description: null,
          item_title: null,
          items: [{ name: null, description: null }],
        };
      }
    },
    addItem() {
      this.form.items.push({ name: null, description: null });
    },
    removeItem(index) {
      this.form.items.splice(index, 1);
    },
    submit() {
      this.loading = true;
      Website.createAbout(this.form)
        .then((result) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000,
          });
          localStorage.removeItem('cache_website/about'); // Clear React cache
          this.form = {
            title: null,
            description: null,
            item_title: null,
            items: [{ name: null, description: null }],
          };
          this.modals.classic = false;
          this.fetchAbout();
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
    deleteItem(id) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'This item will be deleted.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true;
          Website.deleteAboutItem(id)
            .then((result) => {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: result.data.message,
                customClass: 'Swal-wide',
                showConfirmButton: false,
                timer: 3000,
              });
              localStorage.removeItem('cache_website/about'); // Clear React cache
              this.fetchAbout();
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
    fetchAbout() {
      this.loading = true;
      Website.showAbout()
        .then((result) => {
          this.about = result.data;
        })
        .catch(() => {
          this.about = null;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  created() {
    this.fetchAbout();
  },
}
</script>

<style scoped>
.table-responsive {
  padding: 20px;
}
.item-group {
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