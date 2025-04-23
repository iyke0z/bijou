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
            <form @submit.prevent="fetchReport">
              <div class="form-group">
                <label for="start-date">Start Date</label>
                <input
                  type="date"
                  id="start-date"
                  v-model="form.start_date"
                  class="form-control w-100"
                  required
                >
              </div>
              <div class="form-group">
                <label for="end-date">End Date</label>
                <input
                  type="date"
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
              <button class="btn btn-info btn-block mt-2" @click.prevent="downloadReport" :disabled="!details">
                <i class="fa fa-download" aria-hidden="true"></i> Download CSV
              </button>
              <button class="btn btn-primary btn-block mt-2" @click.prevent="downloadPDF" :disabled="!details">
                <i class="fa fa-file-pdf" aria-hidden="true"></i> Download PDF
              </button>
            </form>
          </div>
          <!-- Quick Stats -->
          <div class="col-12 col-md-8" v-if="details">
            <div class="row">
              <div class="col-md-4">
                <div class="card">
                  <div class="card-body">
                    <h6>Total Revenue</h6>
                    <p>{{ details.summary.key_metrics.total_revenue | formatCurrency }}</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card">
                  <div class="card-body">
                    <h6>Total Expenditure</h6>
                    <p>{{ details.summary.key_metrics.total_expenditure | formatCurrency }}</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card">
                  <div class="card-body">
                    <h6>Net Profit</h6>
                    <p>{{ details.summary.key_metrics.net_profit | formatCurrency }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Report Details -->
    <div v-if="details" class="card mb-4" id="report-content">
      <div class="card-header">
        <h4>{{ formatPeriod(details.summary.start_date, details.summary.end_date) }}</h4>
        <p>{{ details.summary.overview }}</p>
        <p><strong>Branch:</strong> {{ details.summary.Branch }}</p>
        <div class="row">
          <div class="col-md-4">
            <p><strong>Total Revenue:</strong> {{ details.summary.key_metrics.total_revenue | formatCurrency }}</p>
          </div>
          <div class="col-md-4">
            <p><strong>Total Expenditure:</strong> {{ details.summary.key_metrics.total_expenditure | formatCurrency }}</p>
          </div>
          <div class="col-md-4">
            <p><strong>Net Profit:</strong> {{ details.summary.key_metrics.net_profit | formatCurrency }}</p>
          </div>
        </div>
      </div>
      <div class="card-body">
        <!-- Revenue Details -->
        <h5 class="mt-4">Revenue Details</h5>
        <div class="row">
          <div class="col-md-6">
            <p><strong>Total Revenue:</strong> {{ details.revenue.total_revenue | formatCurrency }}</p>
            <p><strong>Average Sales per Customer:</strong> {{ details.revenue.kpi.average_sales_per_customer | formatCurrency }}</p>
            <p><strong>Customer Acquisition Cost:</strong> {{ details.revenue.kpi.customer_acquisition_cost | formatCurrency }}</p>
          </div>
          <div class="col-md-6">
            <h6>Sales by Product</h6>
            <canvas id="salesChart" height="150"></canvas>
          </div>
        </div>

        <!-- Charts -->
        <div class="row mt-4">
          <div class="col-md-6">
            <h5>Revenue vs Expenditure</h5>
            <canvas id="revenueExpenditureChart" height="150"></canvas>
          </div>
          <div class="col-md-6">
            <h5>Profit & Loss</h5>
            <canvas id="profitLossChart" height="150"></canvas>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-md-6">
            <h5>Budget vs Actual</h5>
            <canvas id="budgetVsActualChart" height="150"></canvas>
          </div>
          <div class="col-md-6">
            <h5>Cash Flow</h5>
            <canvas id="cashFlowChart" height="150"></canvas>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-md-6">
            <h5>Operating Expenses</h5>
            <canvas id="opexChart" height="150"></canvas>
          </div>
          <div class="col-md-6">
            <h5>Cost of Goods Sold</h5>
            <canvas id="cogsChart" height="150"></canvas>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-md-6">
            <h5>Accounts Receivable</h5>
            <canvas id="receivablesChart" height="150"></canvas>
          </div>
          <div class="col-md-6">
            <h5>Accounts Payable</h5>
            <canvas id="payablesChart" height="150"></canvas>
          </div>
        </div>

        <!-- Sales Details -->
        <h5 class="mt-4">Sales Details</h5>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in details.revenue.sales_by_product.sales_by_product" :key="sale.product_id">
              <td>{{ sale.product_id }}</td>
              <td>{{ sale.product_name }}</td>
              <td>{{ sale.total_amount | formatCurrency }}</td>
            </tr>
            <tr v-if="!details.revenue.sales_by_product.sales_by_product.length">
              <td colspan="3">No sales data available</td>
            </tr>
          </tbody>
        </table>

        <!-- Profit & Loss Statement -->
        <h5 class="mt-4">Profit & Loss Statement</h5>
        <div class="row">
          <div class="col-md-4">
            <p><strong>Revenue:</strong> {{ details.profit_loss_statement.revenue | formatCurrency }}</p>
            <p><strong>Other Income:</strong> {{ details.profit_loss_statement.other_income | formatCurrency }}</p>
            <p><strong>Cost of Goods Sold:</strong> {{ details.profit_loss_statement.cost_of_goods_sold | formatCurrency }}</p>
            <p><strong>Gross Profit:</strong> {{ details.profit_loss_statement.gross_profit | formatCurrency }}</p>
            <p><strong>Gross Profit Margin:</strong> {{ ((details.profit_loss_statement.gross_profit / (details.profit_loss_statement.revenue || 1)) * 100).toFixed(2) }}%</p>
          </div>
          <div class="col-md-4">
            <p><strong>Operating Expenses:</strong> {{ details.profit_loss_statement.operating_expenses | formatCurrency }}</p>
            <ul>
              <li>Marketing Expense: {{ (details.expenditure.expenditure_details?.marketing_expense || 0) | formatCurrency }}</li>
              <li>Salaries: {{ (details.expenditure.expenditure_details?.salaries || 0) | formatCurrency }}</li>
              <li>Utilities: {{ (details.expenditure.expenditure_details?.utilities || 0) | formatCurrency }}</li>
              <li>Logistics Expense: {{ details.logistics_break_down.expenditure | formatCurrency }}</li>
            </ul>
            <p><strong>Depreciation:</strong> {{ details.profit_loss_statement.depreciation | formatCurrency }}</p>
            <p><strong>Amortization:</strong> {{ details.profit_loss_statement.amortization | formatCurrency }}</p>
            <p><strong>Operating Profit:</strong> {{ details.profit_loss_statement.operating_profit | formatCurrency }}</p>
          </div>
          <div class="col-md-4">
            <p><strong>Tax Expense:</strong> {{ details.profit_loss_statement.tax_expense | formatCurrency }}</p>
            <p><strong>Net Profit:</strong> {{ details.profit_loss_statement.net_profit | formatCurrency }}</p>
            <p><strong>Net Profit Margin:</strong> {{ ((details.profit_loss_statement.net_profit / (details.profit_loss_statement.revenue || 1)) * 100).toFixed(2) }}%</p>
          </div>
        </div>

        <!-- Expenditure Summary -->
        <h5 class="mt-4">Expenditure Summary</h5>
        <div class="row">
          <div class="col-md-4">
            <p><strong>Total Expenditure:</strong> {{ details.expenditure.total_expenditure | formatCurrency }}</p>
          </div>
          <div class="col-md-4">
            <p><strong>Cost of Goods Sold:</strong> {{ details.expenditure.cost_of_goods_sold | formatCurrency }}</p>
          </div>
          <div class="col-md-4">
            <p><strong>Operating Expenses:</strong> {{ details.expenditure.operating_expenses | formatCurrency }}</p>
          </div>
        </div>

        <!-- Expenditure Details -->
        <h5 class="mt-4">Expenditure Details</h5>
        <table class="table table-striped" v-if="details.expenditure.expenditure_details.length">
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
            <tr v-for="exp in details.expenditure.expenditure_details" :key="exp.id">
              <td>{{ exp.id }}</td>
              <td>{{ exp.type.name }}</td>
              <td>{{ exp.amount | formatCurrency }}</td>
              <td>{{ exp.payment_method | capitalize }}</td>
              <td>{{ exp.payment_status | capitalize }}</td>
              <td>{{ formatDate(exp.created_at) }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else>No expenditure details available.</p>

        <!-- Purchase Details -->
        <h5 class="mt-4">Purchase Details</h5>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Purchase ID</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Cost</th>
              <th>Payment Status</th>
              <th>Total Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="purchase in details.expenditure.purchase_details" :key="purchase.id">
              <td>{{ purchase.purchase_id }}</td>
              <td>{{ purchase.product.name }}</td>
              <td>{{ purchase.qty }}</td>
              <td>{{ purchase.cost | formatCurrency }}</td>
              <td>{{ purchase.payment_status | capitalize }}</td>
              <td>{{ purchase.part_payment_amount | formatCurrency }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Stock Movement -->
        <h5 class="mt-4">Stock Movement</h5>
        <div class="row">
          <div class="col-md-4">
            <p><strong>Stock Sold:</strong> {{ details.stock_movement.stock_sold | formatCurrency }}</p>
          </div>
          <div class="col-md-4">
            <p><strong>Stock Adjustments:</strong> {{ details.stock_movement.stock_adjustments | formatCurrency }}</p>
          </div>
          <div class="col-md-4">
            <p><strong>Negative Stock:</strong> {{ details.stock_movement.negative_stock | formatCurrency }}</p>
          </div>
        </div>

        <!-- Cash Flow -->
        <h5 class="mt-4">Cash Flow</h5>
        <div class="row">
          <div class="col-md-6">
            <p><strong>Cash Inflow:</strong> {{ details.cash_flow.cash_inflow | formatCurrency }}</p>
            <p><strong>Cash Outflow:</strong> {{ details.cash_flow.cash_outflow | formatCurrency }}</p>
          </div>
          <div class="col-md-6">
            <canvas id="cashFlowChart" height="150"></canvas>
          </div>
        </div>

        <!-- Ledger Details -->
        <h5 class="mt-4">Ledger Details</h5>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Account Name</th>
              <th>Transaction Type</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ledger in details.ledger_details" :key="ledger.id">
              <td>{{ ledger.id }}</td>
              <td>{{ ledger.account_name | capitalize }}</td>
              <td>{{ ledger.transaction_type | capitalize }}</td>
              <td>{{ ledger.description }}</td>
              <td>{{ ledger.amount | formatCurrency }}</td>
              <td>{{ formatDate(ledger.created_at) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- General Ledger Summary -->
        <h5 class="mt-4">General Ledger Summary</h5>
        <div class="row">
          <div class="col-md-6">
            <p><strong>Total Debit:</strong> {{ details.general_ledger_summary.total_debit | formatCurrency }}</p>
            <p><strong>Total Credit:</strong> {{ details.general_ledger_summary.total_credit | formatCurrency }}</p>
          </div>
        </div>
        <h6>Debit Transactions</h6>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Account Name</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Transaction ID</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="txn in details.general_ledger_summary.debit_transactions" :key="txn.transaction_id + '-' + txn.date">
              <td>{{ txn.account_name | capitalize }}</td>
              <td>{{ txn.amount | formatCurrency }}</td>
              <td>{{ txn.description }}</td>
              <td>{{ txn.transaction_id }}</td>
              <td>{{ formatDate(txn.date) }}</td>
            </tr>
          </tbody>
        </table>
        <h6>Credit Transactions</h6>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Account Name</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Transaction ID</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="txn in details.general_ledger_summary.credit_transactions" :key="txn.transaction_id + '-' + txn.date">
              <td>{{ txn.account_name | capitalize }}</td>
              <td>{{ txn.amount | formatCurrency }}</td>
              <td>{{ txn.description }}</td>
              <td>{{ txn.transaction_id }}</td>
              <td>{{ formatDate(txn.date) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Accounts Summary -->
        <h5 class="mt-4">Accounts Summary</h5>
        <div class="row">
          <div class="col-md-6">
            <h6>Accounts Payable</h6>
            <p><strong>Total:</strong> {{ details.balance_sheet.liabilities.current_liabilities.accounts_payable | formatCurrency }}</p>
          </div>
          <div class="col-md-6">
            <h6>Accounts Receivable</h6>
            <p><strong>Total:</strong> {{ details.receivables.total_receivables | formatCurrency }}</p>
            <table class="table table-striped" v-if="details.receivables.receivable_details.length">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Amount Owed</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="receivable in details.receivables.receivable_details" :key="receivable.fullname">
                  <td>{{ receivable.fullname }}</td>
                  <td>{{ receivable.wallet_balance | formatCurrency }}</td>
                </tr>
              </tbody>
            </table>
            <p v-else>No receivable details available.</p>
          </div>
        </div>

        <!-- Customer Report -->
        <h5 class="mt-4">Customer Report</h5>
        <p><strong>Total Customers:</strong> {{ details.receivables.customer_count || 0 }}</p>

        <!-- Logistics Report -->
        <h5 class="mt-4">Logistics Report</h5>
        <div class="row">
          <div class="col-md-6">
            <p><strong>Logistics Revenue:</strong> {{ details.logistics_break_down.revenue | formatCurrency }}</p>
            <p><strong>Logistics Expenditure:</strong> {{ details.logistics_break_down.expenditure | formatCurrency }}</p>
          </div>
          <div class="col-md-6">
            <h6>Logistics Transactions</h6>
            <table class="table table-striped" v-if="logisticsDetails.length">
              <thead>
                <tr>
                  <th>Account Name</th>
                  <th>Transaction Type</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="txn in logisticsDetails" :key="txn.id">
                  <td>{{ txn.account_name | capitalize }}</td>
                  <td>{{ txn.transaction_type | capitalize }}</td>
                  <td>{{ txn.amount | formatCurrency }}</td>
                  <td>{{ txn.description }}</td>
                  <td>{{ formatDate(txn.created_at) }}</td>
                </tr>
              </tbody>
            </table>
            <p v-else>No logistics transactions available.</p>
          </div>
        </div>

        <!-- Sales vs Marketing Expenditure -->
        <h5 class="mt-4">Sales vs Marketing Expenditure</h5>
        <div class="row">
          <div class="col-md-6">
            <p><strong>Sales Expenditure:</strong> {{ details.sales_vs_marketing_expenditure.sales_expenditure | formatCurrency }}</p>
            <p><strong>Marketing Expenditure:</strong> {{ details.sales_vs_marketing_expenditure.marketing_expenditure | formatCurrency }}</p>
          </div>
        </div>

        <!-- Balance Sheet -->
        <h5 class="mt-4">Balance Sheet</h5>
        <div class="row">
          <div class="col-md-4">
            <h6>Assets</h6>
            <h6>Current Assets</h6>
            <ul>
              <li>Cash: {{ details.balance_sheet.assets.current_assets.cash | formatCurrency }}</li>
              <li>Bank: {{ details.balance_sheet.assets.current_assets.bank | formatCurrency }}</li>
              <li>Accounts Receivable: {{ details.balance_sheet.assets.current_assets.accounts_receivable | formatCurrency }}</li>
              <li>Inventory: {{ details.balance_sheet.assets.current_assets.inventory | formatCurrency }}</li>
              <li>Prepaid Inventory: {{ details.balance_sheet.assets.current_assets.prepaid_inventory | formatCurrency }}</li>
              <li>Prepaid Expense: {{ details.balance_sheet.assets.current_assets.prepaid_expense | formatCurrency }}</li>
            </ul>
            <h6>Non-Current Assets</h6>
            <ul>
              <li>Property, Plant, Equipment: {{ details.balance_sheet.assets.non_current_assets.property_plant_equipment | formatCurrency }}</li>
              <li>Long-Term Investments: {{ details.balance_sheet.assets.non_current_assets.long_term_investments | formatCurrency }}</li>
              <li>Intangible Assets: {{ details.balance_sheet.assets.non_current_assets.intangible_assets | formatCurrency }}</li>
            </ul>
          </div>
          <div class="col-md-4">
            <h6>Liabilities</h6>
            <h6>Current Liabilities</h6>
            <ul>
              <li>Accounts Payable: {{ details.balance_sheet.liabilities.current_liabilities.accounts_payable | formatCurrency }}</li>
              <li>Prepaid Sales: {{ details.balance_sheet.liabilities.current_liabilities.prepaid_sales | formatCurrency }}</li>
              <li>Customer Wallets: {{ details.balance_sheet.liabilities.current_liabilities.customer_deposits | formatCurrency }}</li>
            </ul>
            <h6>Non-Current Liabilities</h6>
            <ul>
              <li>Long-Term Loans: {{ details.balance_sheet.liabilities.non_current_liabilities.long_term_loans | formatCurrency }}</li>
              <li>Deferred Tax Liability: {{ details.balance_sheet.liabilities.non_current_liabilities.deferred_tax_liability | formatCurrency }}</li>
            </ul>
          </div>
          <div class="col-md-4">
            <h6>Equity</h6>
            <ul>
              <li>Owner Investment: {{ details.balance_sheet.equity.owner_investment | formatCurrency }}</li>
              <li>Retained Earnings: {{ details.balance_sheet.equity.retained_earnings | formatCurrency }}</li>
              <li>Dividends: {{ details.balance_sheet.equity.dividends | formatCurrency }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Reports from '@/javascript/Api/Reports';
import Shops from '@/javascript/Api/Shops';
import Swal from 'sweetalert2';
import Chart from 'chart.js';
import moment from 'moment';
import html2pdf from 'html2pdf.js';

export default {
  data() {
    return {
      form: { start_date: null, end_date: null, shop_id: 0 },
      loading: false,
      shops: null,
      details: null,
      charts: {
        sales: null,
        revenueExpenditure: null,
        profitLoss: null,
        budgetVsActual: null,
        cashFlow: null,
        opex: null,
        cogs: null,
        receivables: null,
        payables: null,
      },
    };
  },
  computed: {
    logisticsDetails() {
      if (!this.details || !this.details.ledger_details) return [];
      return this.details.ledger_details.filter(ledger => ledger.account_name.toLowerCase() === 'logistics_expense');
    },
  },
  filters: {
    capitalize(value) {
      if (!value) return '';
      return value.replace(/_/g, ' ').replace(/(^|\s)\w/g, letter => letter.toUpperCase());
    },
    formatCurrency(value) {
      if (!value) return '₦0.00';
      return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(value);
    },
  },
  methods: {
    setDefaultDate() {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      this.form.start_date = yesterday.toISOString().split('T')[0];
      this.form.end_date = today.toISOString().split('T')[0];
    },
    fetchReport() {
      this.loading = true;
      Reports.download_report(this.form)
        .then(res => {
          this.details = res.data.data;
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: res.data.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000,
          });
          this.loading = false;
          this.$nextTick(() => {
            this.initCharts();
          });
        })
        .catch(err => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: err?.response?.data?.message ?? 'Failed to fetch report',
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000,
          });
          this.loading = false;
        });
    },
    getShops() {
      this.loading = true;
      Shops.get_shops()
        .then(res => {
          this.shops = res.data.data;
          this.loading = false;
        })
        .catch(err => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Failed to fetch shops',
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000,
          });
          this.loading = false;
        });
    },
    formatDate(date) {
      return moment(date).format('MMMM D, YYYY');
    },
    formatPeriod(start, end) {
      return `${moment(start).format('MMMM D, YYYY')} - ${moment(end).format('MMMM D, YYYY')}`;
    },
    initCharts() {
      if (!this.details) {
        console.warn('No details available for charts');
        return;
      }

      // Sales Chart
      if (this.charts.sales) this.charts.sales.destroy();
      this.charts.sales = new Chart(document.getElementById('salesChart'), {
        type: 'bar',
        data: {
          labels: this.details.revenue.sales_by_product.sales_by_product.map(sale => sale.product_name),
          datasets: [{
            label: 'Sales (₦)',
            data: this.details.revenue.sales_by_product.sales_by_product.map(sale => sale.total_amount),
            backgroundColor: '#48BB78',
            borderColor: '#48BB78',
            borderWidth: 1,
          }],
        },
        options: {
          scales: { y: { beginAtZero: true } },
          plugins: { legend: { display: false }, title: { display: true, text: 'Sales by Product' } },
        },
      });

      // Revenue vs Expenditure Chart
      if (this.charts.revenueExpenditure) this.charts.revenueExpenditure.destroy();
      this.charts.revenueExpenditure = new Chart(document.getElementById('revenueExpenditureChart'), {
        type: 'bar',
        data: {
          labels: ['Revenue', 'Expenditure'],
          datasets: [{
            label: 'Amount (₦)',
            data: [
              this.details.summary.key_metrics.total_revenue || 0,
              this.details.summary.key_metrics.total_expenditure || 0,
            ],
            backgroundColor: ['#28a745', '#dc3545'],
            borderColor: ['#28a745', '#dc3545'],
            borderWidth: 1,
          }],
        },
        options: {
          scales: { y: { beginAtZero: true } },
          plugins: { legend: { display: false }, title: { display: true, text: 'Revenue vs Expenditure' } },
        },
      });

      // Profit & Loss Chart
      if (this.charts.profitLoss) this.charts.profitLoss.destroy();
      this.charts.profitLoss = new Chart(document.getElementById('profitLossChart'), {
        type: 'pie',
        data: {
          labels: ['Gross Profit', 'Operating Profit', 'Net Profit'],
          datasets: [{
            data: [
              this.details.profit_loss_statement.gross_profit || 0,
              this.details.profit_loss_statement.operating_profit || 0,
              this.details.profit_loss_statement.net_profit || 0,
            ],
            backgroundColor: ['#007bff', '#ffc107', '#28a745'],
            borderColor: ['#ffffff'],
            borderWidth: 1,
          }],
        },
        options: {
          plugins: { legend: { position: 'bottom' }, title: { display: true, text: 'Profit & Loss' } },
        },
      });

      // Budget vs Actual Chart
      if (this.charts.budgetVsActual) this.charts.budgetVsActual.destroy();
      this.charts.budgetVsActual = new Chart(document.getElementById('budgetVsActualChart'), {
        type: 'bar',
        data: {
          labels: ['Revenue', 'Expenditure'],
          datasets: [
            {
              label: 'Budgeted',
              data: [
                this.details.budget_vs_actual.budgeted_revenue || 0,
                this.details.budget_vs_actual.budgeted_expenditure || 0,
              ],
              backgroundColor: '#007bff',
              borderColor: '#007bff',
              borderWidth: 1,
            },
            {
              label: 'Actual',
              data: [
                this.details.budget_vs_actual.actual_revenue || 0,
                this.details.budget_vs_actual.actual_expenditure || 0,
              ],
              backgroundColor: '#28a745',
              borderColor: '#28a745',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: { y: { beginAtZero: true } },
          plugins: { legend: { position: 'bottom' }, title: { display: true, text: 'Budget vs Actual' } },
        },
      });

      // Cash Flow Chart
      if (this.charts.cashFlow) this.charts.cashFlow.destroy();
      this.charts.cashFlow = new Chart(document.getElementById('cashFlowChart'), {
        type: 'pie',
        data: {
          labels: ['Cash Inflow', 'Cash Outflow'],
          datasets: [{
            data: [
              this.details.cash_flow.cash_inflow || 0,
              this.details.cash_flow.cash_outflow || 0,
            ],
            backgroundColor: ['#28a745', '#dc3545'],
            borderColor: ['#ffffff'],
            borderWidth: 1,
          }],
        },
        options: {
          plugins: { legend: { position: 'bottom' }, title: { display: true, text: 'Cash Flow' } },
        },
      });

      // OPEX Chart
      if (this.charts.opex) this.charts.opex.destroy();
      this.charts.opex = new Chart(document.getElementById('opexChart'), {
        type: 'line',
        data: {
          labels: this.getOpexDates(),
          datasets: [
            {
              label: 'Logistics Expense (₦)',
              data: this.getOpexAmounts('logistics_expense'),
              borderColor: '#ED8936',
              backgroundColor: 'rgba(237, 137, 54, 0.2)',
              fill: true,
              borderWidth: 2,
            },
            {
              label: 'Marketing Expense (₦)',
              data: this.getOpexAmounts('marketing_expense'),
              borderColor: '#4299E1',
              backgroundColor: 'rgba(66, 153, 225, 0.2)',
              fill: true,
              borderWidth: 2,
            },
            {
              label: 'Salaries (₦)',
              data: this.getOpexAmounts('salaries'),
              borderColor: '#48BB78',
              backgroundColor: 'rgba(72, 187, 120, 0.2)',
              fill: true,
              borderWidth: 2,
            },
            {
              label: 'Utilities (₦)',
              data: this.getOpexAmounts('utilities'),
              borderColor: '#9F7AEA',
              backgroundColor: 'rgba(159, 122, 234, 0.2)',
              fill: true,
              borderWidth: 2,
            },
          ],
        },
        options: {
          scales: { y: { beginAtZero: true } },
          plugins: { legend: { position: 'bottom' }, title: { display: true, text: 'Operating Expenses' } },
        },
      });

      // COGS Chart
      if (this.charts.cogs) this.charts.cogs.destroy();
      this.charts.cogs = new Chart(document.getElementById('cogsChart'), {
        type: 'bar',
        data: {
          labels: this.getLedgerDates('cost_of_goods_sold'),
          datasets: [{
            label: 'COGS (₦)',
            data: this.getLedgerAmounts('cost_of_goods_sold'),
            backgroundColor: '#9F7AEA',
            borderColor: '#9F7AEA',
            borderWidth: 1,
          }],
        },
        options: {
          scales: { y: { beginAtZero: true } },
          plugins: { legend: { display: false }, title: { display: true, text: 'Cost of Goods Sold' } },
        },
      });

      // Receivables Chart
      if (this.charts.receivables) this.charts.receivables.destroy();
      this.charts.receivables = new Chart(document.getElementById('receivablesChart'), {
        type: 'bar',
        data: {
          labels: ['Total Receivables'],
          datasets: [{
            label: 'Receivables (₦)',
            data: [this.details.receivables.total_receivables || 0],
            backgroundColor: '#4299E1',
            borderColor: '#4299E1',
            borderWidth: 1,
          }],
        },
        options: {
          scales: { y: { beginAtZero: true } },
          plugins: { legend: { display: false }, title: { display: true, text: 'Accounts Receivable' } },
        },
      });

      // Payables Chart
      if (this.charts.payables) this.charts.payables.destroy();
      this.charts.payables = new Chart(document.getElementById('payablesChart'), {
        type: 'bar',
        data: {
          labels: ['Total Payables'],
          datasets: [{
            label: 'Payables (₦)',
            data: [this.details.balance_sheet.liabilities.current_liabilities.accounts_payable || 0],
            backgroundColor: '#ED64A6',
            borderColor: '#ED64A6',
            borderWidth: 1,
          }],
        },
        options: {
          scales: { y: { beginAtZero: true } },
          plugins: { legend: { display: false }, title: { display: true, text: 'Accounts Payable' } },
        },
      });
    },
    getLedgerDates(accountName) {
      const dates = {};
      (this.details.ledger_details || [])
        .filter(entry => entry.account_name.toLowerCase() === accountName.toLowerCase())
        .forEach(entry => {
          const date = moment(entry.created_at).format('YYYY-MM-DD');
          dates[date] = true;
        });
      return Object.keys(dates).sort();
    },
    getLedgerAmounts(accountName) {
      const amountsByDate = {};
      (this.details.ledger_details || [])
        .filter(entry => entry.account_name.toLowerCase() === accountName.toLowerCase())
        .forEach(entry => {
          const date = moment(entry.created_at).format('YYYY-MM-DD');
          amountsByDate[date] = (amountsByDate[date] || 0) + entry.amount;
        });
      return Object.keys(amountsByDate).sort().map(date => amountsByDate[date]);
    },
    getOpexDates() {
      const dates = {};
      (this.details.ledger_details || [])
        .filter(entry => ['logistics_expense', 'marketing_expense', 'salaries', 'utilities'].includes(entry.account_name.toLowerCase()))
        .forEach(entry => {
          const date = moment(entry.created_at).format('YYYY-MM-DD');
          dates[date] = true;
        });
      return Object.keys(dates).sort();
    },
    getOpexAmounts(accountName) {
      const amountsByDate = {};
      (this.details.ledger_details || [])
        .filter(entry => entry.account_name.toLowerCase() === accountName.toLowerCase())
        .forEach(entry => {
          const date = moment(entry.created_at).format('YYYY-MM-DD');
          amountsByDate[date] = (amountsByDate[date] || 0) + entry.amount;
        });
      return Object.keys(amountsByDate).sort().map(date => amountsByDate[date] || 0);
    },
    downloadReport() {
      if (!this.details) return;

      let csvContent = 'Financial Report\n';
      csvContent += `Period,${this.formatPeriod(this.details.summary.start_date, this.details.summary.end_date)}\n`;
      csvContent += `Branch,${this.details.summary.Branch}\n`;
      csvContent += `Overview,${this.details.summary.overview}\n\n`;

      // Key Metrics
      csvContent += 'Key Metrics\n';
      csvContent += 'Metric,Value\n';
      csvContent += `Total Revenue,${this.details.summary.key_metrics.total_revenue}\n`;
      csvContent += `Total Expenditure,${this.details.summary.key_metrics.total_expenditure}\n`;
      csvContent += `Net Profit,${this.details.summary.key_metrics.net_profit}\n`;
      csvContent += `Gross Profit,${this.details.summary.key_metrics.gross_profit}\n`;
      csvContent += `EBIT,${this.details.summary.key_metrics.ebit}\n`;
      csvContent += `ROI,${this.details.summary.key_metrics.roi}\n`;
      csvContent += `Profit Margin,${this.details.summary.key_metrics.profit_margin}\n\n`;

      // Revenue Details
      csvContent += 'Revenue Details\n';
      csvContent += 'Metric,Value\n';
      csvContent += `Total Revenue,${this.details.revenue.total_revenue}\n`;
      csvContent += `Average Sales per Customer,${this.details.revenue.kpi.average_sales_per_customer}\n`;
      csvContent += `Customer Acquisition Cost,${this.details.revenue.kpi.customer_acquisition_cost}\n`;
      csvContent += 'Sales by Product\n';
      csvContent += 'Product Name,Total Amount\n';
      this.details.revenue.sales_by_product.sales_by_product.forEach(sale => {
        csvContent += `${sale.product_name},${sale.total_amount}\n`;
      });
      csvContent += '\n';

      // Sales Details
      csvContent += 'Sales Details\n';
      csvContent += 'Product ID,Product,Total Amount\n';
      this.details.revenue.sales_by_product.sales_by_product.forEach(sale => {
        csvContent += `${sale.product_id},${sale.product_name},${sale.total_amount}\n`;
      });
      csvContent += '\n';

      // Profit & Loss Statement
      csvContent += 'Profit & Loss Statement\n';
      csvContent += 'Metric,Value\n';
      csvContent += `Revenue,${this.details.profit_loss_statement.revenue}\n`;
      csvContent += `Other Income,${this.details.profit_loss_statement.other_income}\n`;
      csvContent += `Cost of Goods Sold,${this.details.profit_loss_statement.cost_of_goods_sold}\n`;
      csvContent += `Gross Profit,${this.details.profit_loss_statement.gross_profit}\n`;
      csvContent += `Gross Profit Margin,${((this.details.profit_loss_statement.gross_profit / (this.details.profit_loss_statement.revenue || 1)) * 100).toFixed(2)}%\n`;
      csvContent += `Operating Expenses,${this.details.profit_loss_statement.operating_expenses}\n`;
      csvContent += `Marketing Expense,${this.details.expenditure.expenditure_details?.marketing_expense || 0}\n`;
      csvContent += `Salaries,${this.details.expenditure.expenditure_details?.salaries || 0}\n`;
      csvContent += `Utilities,${this.details.expenditure.expenditure_details?.utilities || 0}\n`;
      csvContent += `Logistics Expense,${this.details.logistics_break_down.expenditure}\n`;
      csvContent += `Depreciation,${this.details.profit_loss_statement.depreciation}\n`;
      csvContent += `Amortization,${this.details.profit_loss_statement.amortization}\n`;
      csvContent += `Operating Profit,${this.details.profit_loss_statement.operating_profit}\n`;
      csvContent += `Tax Expense,${this.details.profit_loss_statement.tax_expense}\n`;
      csvContent += `Net Profit,${this.details.profit_loss_statement.net_profit}\n`;
      csvContent += `Net Profit Margin,${((this.details.profit_loss_statement.net_profit / (this.details.profit_loss_statement.revenue || 1)) * 100).toFixed(2)}%\n\n`;

      // Expenditure Summary
      csvContent += 'Expenditure Summary\n';
      csvContent += 'Metric,Value\n';
      csvContent += `Total Expenditure,${this.details.expenditure.total_expenditure}\n`;
      csvContent += `Cost of Goods Sold,${this.details.expenditure.cost_of_goods_sold}\n`;
      csvContent += `Operating Expenses,${this.details.expenditure.operating_expenses}\n\n`;

      // Expenditure Details
      csvContent += 'Expenditure Details\n';
      csvContent += 'ID,Type,Amount,Payment Method,Payment Status,Date\n';
      if (this.details.expenditure.expenditure_details.length) {
        this.details.expenditure.expenditure_details.forEach(exp => {
          csvContent += `${exp.id},${exp.type.name},${exp.amount},${exp.payment_method},${exp.payment_status},${this.formatDate(exp.created_at)}\n`;
        });
      } else {
        csvContent += 'No expenditure details available\n';
      }
      csvContent += '\n';

      // Purchase Details
      csvContent += 'Purchase Details\n';
      csvContent += 'Purchase ID,Product,Quantity,Cost,Payment Status,Total Balance\n';
      this.details.expenditure.purchase_details.forEach(purchase => {
        csvContent += `${purchase.purchase_id},${purchase.product.name},${purchase.qty},${purchase.cost},${purchase.payment_status},${purchase.part_payment_amount}\n`;
      });
      csvContent += '\n';

      // Stock Movement
      csvContent += 'Stock Movement\n';
      csvContent += 'Metric,Value\n';
      csvContent += `Stock Sold,${this.details.stock_movement.stock_sold}\n`;
      csvContent += `Stock Adjustments,${this.details.stock_movement.stock_adjustments}\n`;
      csvContent += `Negative Stock,${this.details.stock_movement.negative_stock}\n\n`;

      // Cash Flow
      csvContent += 'Cash Flow\n';
      csvContent += 'Metric,Value\n';
      csvContent += `Cash Inflow,${this.details.cash_flow.cash_inflow}\n`;
      csvContent += `Cash Outflow,${this.details.cash_flow.cash_outflow}\n\n`;

      // Ledger Details
      csvContent += 'Ledger Details\n';
      csvContent += 'ID,Account Name,Transaction Type,Description,Amount,Date\n';
      this.details.ledger_details.forEach(ledger => {
        csvContent += `${ledger.id},${ledger.account_name},${ledger.transaction_type},${ledger.description},${ledger.amount},${this.formatDate(ledger.created_at)}\n`;
      });
      csvContent += '\n';

      // General Ledger Summary
      csvContent += 'General Ledger Summary\n';
      csvContent += 'Metric,Value\n';
      csvContent += `Total Debit,${this.details.general_ledger_summary.total_debit}\n`;
      csvContent += `Total Credit,${this.details.general_ledger_summary.total_credit}\n\n`;
      csvContent += 'Debit Transactions\n';
      csvContent += 'Account Name,Amount,Description,Transaction ID,Date\n';
      this.details.general_ledger_summary.debit_transactions.forEach(txn => {
        csvContent += `${txn.account_name},${txn.amount},${txn.description},${txn.transaction_id},${this.formatDate(txn.date)}\n`;
      });
      csvContent += '\n';
      csvContent += 'Credit Transactions\n';
      csvContent += 'Account Name,Amount,Description,Transaction ID,Date\n';
      this.details.general_ledger_summary.credit_transactions.forEach(txn => {
        csvContent += `${txn.account_name},${txn.amount},${txn.description},${txn.transaction_id},${this.formatDate(txn.date)}\n`;
      });
      csvContent += '\n';

      // Accounts Summary
      csvContent += 'Accounts Summary\n';
      csvContent += 'Category,Value\n';
      csvContent += `Accounts Payable,${this.details.balance_sheet.liabilities.current_liabilities.accounts_payable}\n`;
      csvContent += `Accounts Receivable,${this.details.receivables.total_receivables}\n\n`;
      csvContent += 'Accounts Receivable Details\n';
      csvContent += 'Customer,Amount Owed\n';
      if (this.details.receivables.receivable_details.length) {
        this.details.receivables.receivable_details.forEach(receivable => {
          csvContent += `${receivable.fullname},${receivable.wallet_balance}\n`;
        });
      } else {
        csvContent += 'No receivable details available\n';
      }
      csvContent += '\n';

      // Customer Report
      csvContent += 'Customer Report\n';
      csvContent += 'Metric,Value\n';
      csvContent += `Total Customers,${this.details.receivables.customer_count}\n\n`;

      // Logistics Report
      csvContent += 'Logistics Report\n';
      csvContent += 'Metric,Value\n';
      csvContent += `Logistics Revenue,${this.details.logistics_break_down.revenue}\n`;
      csvContent += `Logistics Expenditure,${this.details.logistics_break_down.expenditure}\n\n`;
      csvContent += 'Logistics Transactions\n';
      csvContent += 'Account Name,Transaction Type,Amount,Description,Date\n';
      this.logisticsDetails.forEach(txn => {
        csvContent += `${txn.account_name},${txn.transaction_type},${txn.amount},${txn.description},${this.formatDate(txn.created_at)}\n`;
      });
      csvContent += '\n';

      // Sales vs Marketing Expenditure
      csvContent += 'Sales vs Marketing Expenditure\n';
      csvContent += 'Metric,Value\n';
      csvContent += `Sales Expenditure,${this.details.sales_vs_marketing_expenditure.sales_expenditure}\n`;
      csvContent += `Marketing Expenditure,${this.details.sales_vs_marketing_expenditure.marketing_expenditure}\n\n`;

      // Balance Sheet
      csvContent += 'Balance Sheet\n';
      csvContent += 'Category,Item,Value\n';
      csvContent += `Assets,Cash,${this.details.balance_sheet.assets.current_assets.cash}\n`;
      csvContent += `Assets,Bank,${this.details.balance_sheet.assets.current_assets.bank}\n`;
      csvContent += `Assets,Accounts Receivable,${this.details.balance_sheet.assets.current_assets.accounts_receivable}\n`;
      csvContent += `Assets,Inventory,${this.details.balance_sheet.assets.current_assets.inventory}\n`;
      csvContent += `Assets,Prepaid Inventory,${this.details.balance_sheet.assets.current_assets.prepaid_inventory}\n`;
      csvContent += `Assets,Prepaid Expense,${this.details.balance_sheet.assets.current_assets.prepaid_expense}\n`;
      csvContent += `Assets,Property Plant Equipment,${this.details.balance_sheet.assets.non_current_assets.property_plant_equipment}\n`;
      csvContent += `Assets,Long Term Investments,${this.details.balance_sheet.assets.non_current_assets.long_term_investments}\n`;
      csvContent += `Assets,Intangible Assets,${this.details.balance_sheet.assets.non_current_assets.intangible_assets}\n`;
      csvContent += `Liabilities,Accounts Payable,${this.details.balance_sheet.liabilities.current_liabilities.accounts_payable}\n`;
      csvContent += `Liabilities,Prepaid Sales,${this.details.balance_sheet.liabilities.current_liabilities.prepaid_sales}\n`;
      csvContent += `Liabilities,Long Term Loans,${this.details.balance_sheet.liabilities.non_current_liabilities.long_term_loans}\n`;
      csvContent += `Liabilities,Deferred Tax Liability,${this.details.balance_sheet.liabilities.non_current_liabilities.deferred_tax_liability}\n`;
      csvContent += `Equity,Owner Investment,${this.details.balance_sheet.equity.owner_investment}\n`;
      csvContent += `Equity,Retained Earnings,${this.details.balance_sheet.equity.retained_earnings}\n`;
      csvContent += `Equity,Dividends,${this.details.balance_sheet.equity.dividends}\n\n`;

      // Budget vs Actual
      csvContent += 'Budget vs Actual\n';
      csvContent += 'Metric,Budgeted,Actual,Variance\n';
      csvContent += `Revenue,${this.details.budget_vs_actual.budgeted_revenue},${this.details.budget_vs_actual.actual_revenue},${this.details.budget_vs_actual.revenue_variance}\n`;
      csvContent += `Expenditure,${this.details.budget_vs_actual.budgeted_expenditure},${this.details.budget_vs_actual.actual_expenditure},${this.details.budget_vs_actual.expenditure_variance}\n`;

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `financial_report_${moment(this.details.summary.start_date).format('YYYYMMDD')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    downloadPDF() {
      if (!this.details) return;

      const element = document.getElementById('report-content');
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `financial_report_${moment(this.details.summary.start_date).format('YYYYMMDD')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      };

      html2pdf()
        .set(opt)
        .from(element)
        .save()
        .catch(err => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Failed to generate PDF',
            text: err.message,
            customClass: 'Swal-wide',
            showConfirmButton: false,
            timer: 3000,
          });
        });
    },
  },
  created() {
    this.setDefaultDate();
    this.getShops();
  },
};
</script>

<style scoped>
.container-fluid {
  background: #f8f9fa;
  padding: 20px;
  min-height: 100vh;
}

.card {
  background: #ffffff;
  border: 1px solid #dee2e6;
  color: #212529;
  margin-bottom: 1.5rem;
}

.card-body {
  padding: 20px;
}

.card-title,
h4,
h5,
h6 {
  color: #343a40;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}

.btn-success:hover {
  background-color: #218838;
  border-color: #1e7e34;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0069d9;
  border-color: #0062cc;
}

.btn-info {
  background-color: #17a2b8;
  border-color: #17a2b8;
}

.btn-info:hover {
  background-color: #138496;
  border-color: #117a8b;
}

.table {
  background: #ffffff;
  color: #212529;
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: #f2f2f2;
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

.btn-link {
  color: #007bff;
}

.btn-link:hover {
  color: #0056b3;
  text-decoration: underline;
}
</style>