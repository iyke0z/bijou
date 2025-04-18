<template>
    <div class="table-responsive"><br>
      <span v-if="loading" class="loader"></span>
      
      <h3>Budgets</h3> <br/>

      
      <div>
        
      </div>
      <p-button type="success" size="lg" icon @click.native="openModal('classic', 'New Budget', 'create')" :title="'new budget'">
        <i class="fa fa-plus"></i>
    
      </p-button>
      <table id="budgetTable" class="table table-striped" v-if="!loading">
        <thead>
          <tr>
            <th>#</th>
            <th>Budget Type</th>
            <th>Amount</th>
            <th>Category/Expenditure Type</th>
            <th>Month</th>
            <th>Year</th>
            <th>Actions</th>
          </tr>
        </thead>
            <tbody :key="tableKey">
                <tr v-for="(budget, index) in flattenedBudgets" :key="budget.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ budget.budget_type | capitalize }}</td>
                    <td>{{ budget.budget_amount.toLocaleString() }}</td>
                    <td>
                    <span v-if="budget.budget_type === 'revenue' && budget.category_id">
                        {{ budget.category.name }}
                    </span>
                    <span v-else-if="budget.budget_type === 'expenditure' && budget.expenditure_type">
                        {{ budget.expenditure_type }}
                    </span>
                    <span v-else>-</span>
                    </td>
                    <td>{{ budget.month }}</td>
                    <td>{{ budget.year }}</td>
                    <td>
                    <p-button class="mr-2" title="update" type="info" size="sm" icon @click.native="openModal('classic', 'Update Budget', 'update', budget)">
                        <i class="fa fa-edit"></i>
                    </p-button>
                    <p-button class="mr-2" title="delete" type="danger" size="sm" icon @click.prevent="delete_budget(budget)">
                        <i class="fa fa-trash"></i>
                    </p-button>
                    </td>
                </tr>
            </tbody>
        </table>

      <!-- Budget Modal -->
      <modal :show.sync="modals.classic" class="wider-modal" headerClasses="justify-content-center">
        <h4 slot="header" class="title title-up" v-show="updateMode">{{ modalTitle }}</h4>
        <h4 slot="header" class="title title-up" v-show="!updateMode">{{ modalTitle }}</h4>
        <div>
          <!-- Update Form -->
          <fieldset v-if="updateMode">
            <form @submit.prevent="update">
              <div class="form-group">
                <label>Type</label>
                <select class="form-control col-12" v-model="form.budget_type" required @change="resetSelections">
                  <option value="revenue">Revenue</option>
                  <option value="expenditure">Expenditure</option>
                </select>
              </div>
              <div class="form-group" v-if="form.budget_type === 'revenue'">
                <label>Category</label>
                <select class="form-control col-12" v-model="form.category_id" required>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <div class="form-group" v-if="form.budget_type === 'expenditure'">
                <label>Expenditure Type</label>
                <select class="form-control col-12" v-model="form.expenditure_type" required>
                  <option v-for="type in mockExpenditureTypes" :key="type.id" :value="type.id">
                    {{ type.name }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Amount</label>
                <input type="number" step="0.01" class="form-control col-8" v-model="form.budget_amount" required placeholder="Amount">
              </div>
              <div class="form-group">
                <label>Month</label>
                <select class="form-control col-12" v-model="form.month" required>
                  <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Year</label>
                <input type="text" class="form-control col-8" v-model="form.year" required placeholder="YYYY" pattern="\d{4}">
              </div>
              <div class="form-group">
                <button type="submit" class="btn btn-success">Submit</button>
              </div>
            </form>
          </fieldset>
          <!-- Create/Bulk Form -->
          <form @submit.prevent="submit" v-if="!updateMode">
            <fieldset>
                <div v-for="(row, index) in rows.budgets" :key="index">
                  <div>
                    <label>Type</label>
                    <select class="form-control col-12" v-model="row.budget_type" required @change="resetRowSelections(index)">
                      <option value="revenue">Revenue</option>
                      <option value="expenditure">Expenditure</option>
                    </select>
                  </div> 
                    <div v-if="row.budget_type === 'revenue'">
                    <label>Category</label>
                    <select class="form-control col-12" v-model="row.category_id" required>
                      <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                      </option>
                    </select>
                  </div>
                  <div v-if="row.budget_type === 'expenditure'">
                    <label>Expenditure Type</label>
                    <select class="form-control col-12" v-model="row.expenditure_type" required>
                      <option v-for="type in mockExpenditureTypes" :key="type.id" :value="type.id">
                        {{ type.name }}
                      </option>
                    </select>
                </div>
                <div>
                  <label>Amount</label>
                  <input type="number" step="0.01" class="form-control col-12" v-model="row.budget_amount" required placeholder="Amount">
                </div>
                  
                  <div>
                    <label>Month</label>
                    <select class="form-control col-12" v-model="row.month" required>
                      <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
                    </select>
                  </div>
                  <div>
                    <label>Year</label>
                    <input type="text" class="form-control col-12" v-model="row.year" required placeholder="YYYY" pattern="\d{4}">
                    
                    <button type="button" class="btn btn-success text-light col-12 mt-1" @click="new_row()">Add Row</button>
                    <button v-show="rows.budgets.length > 1" type="button" class="btn btn-danger text-light mt-1 col-12" @click="delete_row(index)">x</button>
                    </div>
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
  import { Button, Modal } from '@/components/UIComponents'
  import Budget from '@/javascript/Api/Budgets' // Assume API service for budgets
  import Swal from 'sweetalert2'
  import helpers from '@/javascript/helpers'
import Categories from '@/javascript/Api/Categories'
import Shops from '@/javascript/Api/Shops'
  
  export default {
    components: {
      Modal,
      [Button.name]: Button
    },
    filters: {
      capitalize(value) {
        if (!value) return '';
        return value.charAt(0).toUpperCase() + value.slice(1);
      },
      formatCurrency(value) {
        if (!value) return '0.00';
        return parseFloat(value).toFixed(2);
      }
    },
    data() {
      return {
        updateMode: false,
        tableKey: 0,
        modals: {
          classic: false
        },
        all_budgets: [],
        modalTitle: null,
        modalAction: null,
        start_date:null,
        end_date:null,
        shopId:0,
        shops:null,
        loading: false,
        form: {
          budget_type: 'revenue',
          category_id: null,
          expenditure_type: null,
          budget_amount: null,
          month: 'January',
          year: new Date().getFullYear().toString(),
          shop_id: localStorage.getItem('shop_id')
        },
        rows: {
          budgets: [{
            budget_type: 'revenue',
            category_id: null,
            expenditure_type: null,
            budget_amount: null,
            month: 'January',
            year: new Date().getFullYear().toString()
          }]
        },
        months: [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ],
        categories: null,
        mockExpenditureTypes: [
          { id: 1, name: 'Salaries' },
          { id: 2, name: 'Utilities' },
          { id: 3, name: 'Marketing' }
        ],
        budgetId: null
      }
    },
    methods: {
      openModal(type, title, action, budget = null) {
        this.modalTitle = title;
        this.modals[type] = true;
        this.modalAction = action;
        if (action === 'update' && budget) {
          this.updateMode = true;
          this.budgetId = budget.id;
          this.form = {
            budget_type: budget.budget_type,
            category_id: budget.category_id,
            expenditure_type: budget.expenditure_type,
            budget_amount: budget.budget_amount,
            month: budget.month,
            year: budget.year
          };
        } else {
          this.updateMode = false;
          this.rows.budgets = [{
            budget_type: 'revenue',
            category_id: null,
            expenditure_type: null,
            budget_amount: null,
            month: 'January',
            year: new Date().getFullYear().toString()
          }];
        }
      },
      goToRoute(budget) {
        this.$router.push(`/budget/details/${budget.id}`);
      },
      delete_budget(budget) {
        this.loading = true;
        Budget.deleteBudget(budget.id).then((result) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          });
          this.loading = false;
          this.fetchBudgets();

        }).catch((err) => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: err?.response?.data?.error ?? err.response.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          });
          this.loading = false;
        });
      },
    
      submit() {
        this.loading = true;
        const payload = { budgets: this.rows.budgets };
        Budget.createBudget(payload).then((result) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          });
          this.rows.budgets = [{
            budget_type: 'revenue',
            category_id: null,
            expenditure_type: null,
            budget_amount: null,
            month: 'January',
            year: new Date().getFullYear().toString()
          }];
          this.fetchBudgets();
          this.modals.classic = false;
          this.loading = false;
        }).catch((err) => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: err?.response?.data?.errors?.join(' ') ?? err.response.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          });
          this.loading = false;
        });
      },
      update() {
        this.loading = true;
        Budget.update(this.form, this.budgetId).then((result) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: result.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          });
          this.fetchBudgets();
          this.updateMode = false;
          this.form = {
            budget_type: 'revenue',
            category_id: null,
            expenditure_type: null,
            budget_amount: null,
            month: 'January',
            year: new Date().getFullYear().toString()
          };
          this.modals.classic = false;
          this.loading = false;
        }).catch((err) => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: err?.response?.data?.error ?? err.response.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          });
          this.loading = false;
        });
      },
      fetchBudgets() {
        this.loading = true;
        Budget.getPeriodic().then((result) => {
          this.all_budgets = result.data.data;
          this.loading = false;
          this.tableKey++;
          this.initDataTable();
        }).catch(() => {
          this.loading = false;
        });
      },
      new_row() {
        this.rows.budgets.push({
          budget_type: 'revenue',
          category_id: null,
          expenditure_type: null,
          budget_amount: null,
          month: 'January',
          year: new Date().getFullYear().toString()
        });
      },
      delete_row(index) {
        this.rows.budgets.splice(index, 1);
      },
      initDataTable() {
        $(function() {
          $('#budgetTable').DataTable({
            bDestroy: true,
            pageLength: 5,
            lengthMenu: [[5, 10, 20], [5, 10, 20]],
          });
        });
      },
      resetSelections() {
        if (this.form.budget_type === 'revenue') {
          this.form.expenditure_type = null;
        } else {
          this.form.category_id = null;
        }
      },
      resetRowSelections(index) {
        if (this.rows.budgets[index].budget_type === 'revenue') {
          this.rows.budgets[index].expenditure_type = null;
        } else {
          this.rows.budgets[index].category_id = null;
        }
      },
      getShops(){
        this.loading = true
        Shops.get_shops().then(res => {
          this.shops = res.data.data
        this.loading = false
        })
      },
      
      getCategories(){
        Categories.categories().then(res => {
            this.categories = res.data.data
        })
      },
      downloadReport() {
        this.loading = true;
        
      }
    },
    computed: {
        flattenedBudgets() {
            let flat = [];
            for (let year in this.all_budgets) {
            for (let month in this.all_budgets[year]) {
                this.all_budgets[year][month].forEach(budget => {
                flat.push({ ...budget, month, year });
                });
            }
            }
            return flat;
        }
        },
    created() {
      this.fetchBudgets();
      this.getCategories()
      this.getShops()
    }
  }
  </script>
  
  <style scoped>
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  #bulkTable td {
    padding: 10px;
    vertical-align: top;
  }
  
  #bulkTable select, #bulkTable input {
    margin-top: 5px;
  }
  </style>
  