<template>
    <div class="container-fluid">
      <span class="loader" v-if="loading"></span>
  
      <!-- Header -->
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">Financial Report Dashboard</h5>
          <div class="row">
            <!-- Generate Report Form -->
            <div class="col-12 col-md-4 mb-3">
              <h6>Generate Report</h6>
              <form @submit.prevent="generateReport">
                <div class="form-group">
                  <label for="start-date">Start Date</label>
                  <input
                    type="datetime-local"
                    id="start-date"
                    v-model="form.start_date"
                    class="form-control w-100"
                    required
                  >
                </div>
                <div class="form-group">
                  <label for="end-date">End Date</label>
                  <input
                    type="datetime-local"
                    id="end-date"
                    v-model="form.end_date"
                    class="form-control w-100"
                    required
                  >
                </div>
                <div class="form-group">
                  <label for="shop-id">Branch</label>
                  <select required class="form-control" v-model="form.shop_id">
                    <option value="0">All</option>
                    <option v-for="shop in shops" :key="shop.id" :value="shop.id">
                      {{ shop.title }}
                    </option>
                  </select>
                </div>
                <button class="btn btn-success btn-block" type="submit">
                  <i class="fa fa-search" aria-hidden="true"></i> Generate Report
                </button>
                <button class="btn btn-info btn-block mt-2" @click.prevent="downloadReport" :disabled="!report">
                  <i class="fa fa-download" aria-hidden="true"></i> Download Report
                </button>
              </form>
            </div>
            <!-- Quick Stats -->
            <div class="col-12 col-md-8" v-if="report">
              <div class="row">
                <div class="col-md-4">
                  <div class="card">
                    <div class="card-body">
                      <h6>Total Revenue</h6>
                      <p>{{ report.summary.key_metrics.total_revenue | formatCurrency }}</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card">
                    <div class="card-body">
                      <h6>Total Expenditure</h6>
                      <p>{{ report.summary.key_metrics.total_expenditure | formatCurrency }}</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card">
                    <div class="card-body">
                      <h6>Net Profit</h6>
                      <p>{{ report.summary.key_metrics.net_profit | formatCurrency }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Report Details -->
      <div v-if="report" class="card mb-4">
        <div class="card-header">
          <h4>{{ formatPeriod(report.summary.start_date, report.summary.end_date) }}</h4>
          <p>{{ report.summary.overview }}</p>
          <p><strong>Branch:</strong> {{ report.summary.Branch }}</p>
        </div>
        <div class="card-body">
          <!-- Charts -->
          <div class="row">
            <div class="col-md-6">
              <h5>Revenue vs Expenditure</h5>
              <canvas id="revenueExpenditureChart" height="200"></canvas>
            </div>
            <div class="col-md-6">
              <h5>Profit Margins</h5>
              <canvas id="profitMarginsChart" height="200"></canvas>
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-md-12">
              <h5>Budget vs Actual</h5>
              <canvas id="budgetVsActualChart" height="200"></canvas>
            </div>
          </div>
  
          <!-- Expenditure Details -->
          <h5 class="mt-4">Expenditure Details</h5>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Payment Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="exp in report.expenditure.expenditure_details" :key="exp.id">
                <td>{{ exp.id }}</td>
                <td>{{ exp.type.name }}</td>
                <td>{{ exp.amount | formatCurrency }}</td>
                <td>{{ exp.payment_method | capitalize }}</td>
                <td>{{ exp.payment_status | capitalize }}</td>
                <td>{{ formatDate(exp.created_at) }}</td>
              </tr>
            </tbody>
          </table>
  
          <!-- Purchase Details (Collapsible) -->
          <h5 class="mt-4">Purchase Details</h5>
          <div class="accordion" id="purchaseAccordion">
            <div class="card" v-for="purchase in report.expenditure.purchase_details" :key="purchase.id">
              <div class="card-header" :id="'heading' + purchase.id">
                <h6 class="mb-0">
                  <button class="btn btn-link" type="button" data-toggle="collapse" :data-target="'#collapse' + purchase.id" aria-expanded="true" :aria-controls="'collapse' + purchase.id">
                    Purchase ID: {{ purchase.id }} (Total: {{ purchase.price | formatCurrency }})
                  </button>
                </h6>
              </div>
              <div :id="'collapse' + purchase.id" class="collapse" :aria-labelledby="'heading' + purchase.id" data-parent="#purchaseAccordion">
                <div class="card-body">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Cost</th>
                        <th>Payment Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="detail in purchase.purchase_detail" :key="detail.id">
                        <td>{{ detail.product.name }}</td>
                        <td>{{ detail.qty }}</td>
                        <td>{{ detail.cost | formatCurrency }}</td>
                        <td>{{ detail.payment_status | capitalize }}</td>
                      </tr>
                    </tbody>
                  </table>
                  <p><strong>Total Balance:</strong> {{ purchase.total_balance | formatCurrency }}</p>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Balance Sheet -->
          <h5 class="mt-4">Balance Sheet</h5>
          <div class="row">
            <div class="col-md-6">
              <h6>Assets</h6>
              <ul>
                <li>Cash: {{ report.balance_sheet.assets.current_assets.cash | formatCurrency }}</li>
                <li>Accounts Receivable: {{ report.balance_sheet.assets.current_assets.accounts_receivable | formatCurrency }}</li>
                <li>Inventory: {{ report.balance_sheet.assets.current_assets.inventory | formatCurrency }}</li>
              </ul>
            </div>
            <div class="col-md-6">
              <h6>Liabilities</h6>
              <ul>
                <li>Accounts Payable: {{ report.balance_sheet.liabilities.current_liabilities.accounts_payable | formatCurrency }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Shops from '@/javascript/Api/Shops';
  import Swal from 'sweetalert2';
  import Chart from 'chart.js'; // Updated import for Chart.js
  
  export default {
    props: {
      report: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        form: { start_date: null, end_date: null, shop_id: 0 },
        loading: false,
        shops: null,
        charts: {
          revenueExpenditure: null,
          profitMargins: null,
          budgetVsActual: null
        }
      };
    },
    filters: {
      capitalize(value) {
        if (!value) return '';
        return value.replace(/_/g, ' ').replace(/(^|\s)\w/g, letter => letter.toUpperCase());
      },
      formatCurrency(value) {
        if (!value) return '0.00';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
      }
    },
    methods: {
      generateReport() {
        this.loading = true;
        this.$emit('generate-report', { ...this.form });
        this.loading = false;
      },
      getShops() {
        this.loading = true;
        Shops.get_shops().then(res => {
          this.shops = res.data.data;
          this.loading = false;
        }).catch(() => {
          this.loading = false;
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Failed to fetch shops',
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000
          });
        });
      },
      formatDate(date) {
        return moment(date).format('MMMM D, YYYY');
      },
      formatPeriod(start, end) {
        return `${moment(start).format('MMMM D, YYYY')} - ${moment(end).format('MMMM D, YYYY')}`;
      },
      initCharts() {
        if (!this.report) return;
  
        // Revenue vs Expenditure Chart
        if (this.charts.revenueExpenditure) {
          this.charts.revenueExpenditure.destroy();
        }
        this.charts.revenueExpenditure = new Chart(document.getElementById('revenueExpenditureChart'), {
          type: 'bar',
          data: {
            labels: ['Revenue', 'Expenditure'],
            datasets: [{
              label: 'Amount ($)',
              data: [
                this.report.summary.key_metrics.total_revenue,
                this.report.summary.key_metrics.total_expenditure
              ],
              backgroundColor: ['#28a745', '#dc3545'],
              borderColor: ['#28a745', '#dc3545'],
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: { beginAtZero: true }
            },
            plugins: {
              legend: { display: false },
              title: { display: true, text: 'Revenue vs Expenditure' }
            }
          }
        });
  
        // Profit Margins Chart
        if (this.charts.profitMargins) {
          this.charts.profitMargins.destroy();
        }
        this.charts.profitMargins = new Chart(document.getElementById('profitMarginsChart'), {
          type: 'pie',
          data: {
            labels: ['Gross Profit Margin', 'Operating Profit Margin', 'Net Profit Margin'],
            datasets: [{
              data: [
                this.report.profit_margin.gross_profit_margin,
                this.report.profit_margin.operating_profit_margin,
                this.report.profit_margin.net_profit_margin
              ],
              backgroundColor: ['#007bff', '#ffc107', '#28a745'],
              borderColor: ['#ffffff'],
              borderWidth: 1
            }]
          },
          options: {
            plugins: {
              legend: { position: 'bottom' },
              title: { display: true, text: 'Profit Margins (%)' }
            }
          }
        });
  
        // Budget vs Actual Chart
        if (this.charts.budgetVsActual) {
          this.charts.budgetVsActual.destroy();
        }
        this.charts.budgetVsActual = new Chart(document.getElementById('budgetVsActualChart'), {
          type: 'bar',
          data: {
            labels: ['Revenue', 'Expenditure'],
            datasets: [
              {
                label: 'Budgeted',
                data: [
                  this.report.budget_vs_actual.budgeted_revenue,
                  this.report.budget_vs_actual.budgeted_expenditure
                ],
                backgroundColor: '#007bff',
                borderColor: '#007bff',
                borderWidth: 1
              },
              {
                label: 'Actual',
                data: [
                  this.report.budget_vs_actual.actual_revenue,
                  this.report.budget_vs_actual.actual_expenditure
                ],
                backgroundColor: '#28a745',
                borderColor: '#28a745',
                borderWidth: 1
              }
            ]
          },
          options: {
            scales: {
              y: { beginAtZero: true }
            },
            plugins: {
              legend: { position: 'bottom' },
              title: { display: true, text: 'Budget vs Actual' }
            }
          }
        });
      },
      downloadReport() {
        if (!this.report) return;
  
        let csvContent = 'Financial Report\n';
        csvContent += `Period,${this.formatPeriod(this.report.summary.start_date, this.report.summary.end_date)}\n`;
        csvContent += `Branch,${this.report.summary.Branch}\n`;
        csvContent += `Overview,${this.report.summary.overview}\n\n`;
  
        // Summary Metrics
        csvContent += 'Key Metrics\n';
        csvContent += 'Metric,Value\n';
        csvContent += `Total Revenue,${this.report.summary.key_metrics.total_revenue}\n`;
        csvContent += `Total Expenditure,${this.report.summary.key_metrics.total_expenditure}\n`;
        csvContent += `Gross Profit,${this.report.summary.key_metrics.gross_profit}\n`;
        csvContent += `Net Profit,${this.report.summary.key_metrics.net_profit}\n`;
        csvContent += `EBIT,${this.report.summary.key_metrics.ebit}\n`;
        csvContent += `ROI,${this.report.summary.key_metrics.roi}\n`;
        csvContent += `Profit Margin,${this.report.summary.key_metrics.profit_margin}\n\n`;
  
        // Expenditure Details
        csvContent += 'Expenditure Details\n';
        csvContent += 'ID,Type,Amount,Payment Method,Payment Status,Date\n';
        this.report.expenditure.expenditure_details.forEach(exp => {
          csvContent += `${exp.id},${exp.type.name},${exp.amount},${exp.payment_method},${exp.payment_status},${this.formatDate(exp.created_at)}\n`;
        });
        csvContent += '\n';
  
        // Purchase Details
        csvContent += 'Purchase Details\n';
        csvContent += 'Purchase ID,Product,Quantity,Cost,Payment Status,Total Balance\n';
        this.report.expenditure.purchase_details.forEach(purchase => {
          purchase.purchase_detail.forEach(detail => {
            csvContent += `${purchase.id},${detail.product.name},${detail.qty},${detail.cost},${detail.payment_status},${purchase.total_balance}\n`;
          });
        });
        csvContent += '\n';
  
        // Balance Sheet
        csvContent += 'Balance Sheet\n';
        csvContent += 'Category,Item,Value\n';
        csvContent += `Assets,Cash,${this.report.balance_sheet.assets.current_assets.cash}\n`;
        csvContent += `Assets,Accounts Receivable,${this.report.balance_sheet.assets.current_assets.accounts_receivable}\n`;
        csvContent += `Assets,Inventory,${this.report.balance_sheet.assets.current_assets.inventory}\n`;
        csvContent += `Liabilities,Accounts Payable,${this.report.balance_sheet.liabilities.current_liabilities.accounts_payable}\n\n`;
  
        // Budget vs Actual
        csvContent += 'Budget vs Actual\n';
        csvContent += 'Metric,Budgeted,Actual,Variance\n';
        csvContent += `Revenue,${this.report.budget_vs_actual.budgeted_revenue},${this.report.budget_vs_actual.actual_revenue},${this.report.budget_vs_actual.revenue_variance}\n`;
        csvContent += `Expenditure,${this.report.budget_vs_actual.budgeted_expenditure},${this.report.budget_vs_actual.actual_expenditure},${this.report.budget_vs_actual.expenditure_variance}\n`;
  
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `financial_report_${moment(this.report.summary.start_date).format('YYYYMMDD')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    watch: {
      report: {
        handler() {
          this.$nextTick(() => {
            this.initCharts();
          });
        },
        deep: true
      }
    },
    created() {
      this.getShops();
    }
  }
  </script>
  
  <style scoped>
  .loader {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 2s linear infinite;
    display: block;
    margin: 0 auto;
  }
  
  @keyframes spin {
0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .card {
    margin-bottom: 1.5rem;
  }
  
  .btn-link {
    color: #007bff;
    text-decoration: none;
  }
  
  .btn-link:hover {
    text-decoration: underline;
  }
  </style>