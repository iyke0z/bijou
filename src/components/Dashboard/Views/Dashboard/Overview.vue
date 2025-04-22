<template>
  <div class="container-fluid bg-gray-50 min-h-screen p-6">
    <!-- Loader -->
    <div v-if="loading" class="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
      <span class="loader"></span>
    </div>

    <!-- Report Form -->
    <div class="card bg-white shadow-md rounded-lg p-5 mb-6">
      <h3 class="text-2xl font-semibold text-gray-800 mb-6">Financial Dashboard</h3>
      <form @submit.prevent="fetchReport" class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            v-model="form.start_date"
            class="mt-1 border border-gray-300 rounded-md p-2 w-full focus:ring-teal-500 focus:border-teal-500"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            v-model="form.end_date"
            class="mt-1 border border-gray-300 rounded-md p-2 w-full focus:ring-teal-500 focus:border-teal-500"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Branch</label>
          <select
            v-model="form.shop_id"
            class="mt-1 border border-gray-300 rounded-md p-2 w-full focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="0">All Shops</option>
            <option v-for="shop in shops" :key="shop.id" :value="shop.id">{{ shop.title }}</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            type="submit"
            class="btn bg-teal-600 text-white hover:bg-teal-700 w-full"
          >
            Generate Report
          </button>
        </div>
      
      </form>
    </div>

    <!-- Key Metrics -->
    <div v-if="details" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="card bg-white shadow-md rounded-lg p-5">
        <h4 class="text-lg font-semibold text-gray-800">Total Revenue</h4>
        <p class="text-2xl font-bold text-teal-600 mt-2">
          {{ (details.profit_loss_statement.revenue || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }) }}
        </p>
      </div>
      <div class="card bg-white shadow-md rounded-lg p-5">
        <h4 class="text-lg font-semibold text-gray-800">Total Expenditure</h4>
        <p class="text-2xl font-bold text-red-600 mt-2">
          {{
            (
              details.profit_loss_statement.cost_of_goods_sold +
              details.profit_loss_statement.operating_expenses +
              details.profit_loss_statement.depreciation +
              details.profit_loss_statement.amortization +
              details.profit_loss_statement.tax_expense
            ).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })
          }}
        </p>
      </div>
      <div class="card bg-white shadow-md rounded-lg p-5">
        <h4 class="text-lg font-semibold text-gray-800">Net Profit</h4>
        <p class="text-2xl font-bold text-green-600 mt-2">
          {{ (details.profit_loss_statement.net_profit || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }) }}
        </p>
      </div>
    </div>

    <!-- Charts Section -->
    <div v-if="details" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Sales Performance -->
      <div class="card bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition-shadow">
        <h4 class="text-xl font-semibold text-gray-800 mb-2">Sales Performance</h4>
        <p class="text-sm text-gray-600 mb-6">Total sales revenue for the selected period</p>
        <bar-chart
          :labels="salesPerformanceChart.labels"
          :height="250"
          :datasets="salesPerformanceChart.datasets"
          :key="salesKey"
          aria-label="Sales Performance Chart"
        ></bar-chart>
      </div>

      <!-- OPEX Performance -->
      <div class="card bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition-shadow">
        <h4 class="text-xl font-semibold text-gray-800 mb-2">Operating Expenses (OPEX)</h4>
        <p class="text-sm text-gray-600 mb-6">Operating expenses for the selected period</p>
        <line-chart
          :labels="opexPerformanceChart.labels"
          :height="250"
          :color="opexPerformanceChart.color"
          :extra-options="opexPerformanceChart.options"
          :datasets="opexPerformanceChart.datasets"
          :key="opexKey"
          aria-label="OPEX Performance Chart"
        ></line-chart>
      </div>

      <!-- Receivables -->
      <div class="card bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition-shadow">
        <h4 class="text-xl font-semibold text-gray-800 mb-2">Accounts Receivable</h4>
        <p class="text-sm text-gray-600 mb-6">Total accounts receivable</p>
        <bar-chart
          :labels="debReportChart.labels"
          :height="250"
          :datasets="debReportChart.datasets"
          :key="debtKey"
          aria-label="Receivables Chart"
        ></bar-chart>
      </div>

      <!-- Payables -->
      <div class="card bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition-shadow">
        <h4 class="text-xl font-semibold text-gray-800 mb-2">Accounts Payable</h4>
        <p class="text-sm text-gray-600 mb-6">Total accounts payable</p>
        <bar-chart
          :labels="payablesChart.labels"
          :height="250"
          :datasets="payablesChart.datasets"
          :key="payablesKey"
          aria-label="Payables Chart"
        ></bar-chart>
      </div>

      <!-- COGS -->
      <div class="card bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition-shadow">
        <h4 class="text-xl font-semibold text-gray-800 mb-2">Cost of Goods Sold (COGS)</h4>
        <p class="text-sm text-gray-600 mb-6">Direct costs of goods sold</p>
        <bar-chart
          :labels="cogsActivityChart.labels"
          :height="250"
          :extra-options="cogsActivityChart.options"
          :datasets="cogsActivityChart.datasets"
          :key="cogsKey"
          aria-label="COGS Chart"
        ></bar-chart>
      </div>

      <!-- Budget vs Actual -->
      <div class="card bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition-shadow">
        <h4 class="text-xl font-semibold text-gray-800 mb-2">Budget vs Actual</h4>
        <p class="text-sm text-gray-600 mb-6">Budgeted vs actual revenue and expenditure</p>
        <bar-chart
          :labels="budgetVsActualChart.labels"
          :height="250"
          :datasets="budgetVsActualChart.datasets"
          :key="budgetKey"
          aria-label="Budget vs Actual Chart"
        ></bar-chart>
      </div>

      <!-- Cash Flow -->
      <div class="card bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition-shadow">
        <h4 class="text-xl font-semibold text-gray-800 mb-2">Cash Flow</h4>
        <p class="text-sm text-gray-600 mb-6">Cash inflow vs outflow</p>
        <pie-chart
          :labels="cashFlowChart.labels"
          :height="250"
          :datasets="cashFlowChart.datasets"
          :key="cashFlowKey"
          aria-label="Cash Flow Chart"
        ></pie-chart>
      </div>
    </div>

    <!-- Profit & Loss Account -->
    <div v-if="details" class="card bg-white shadow-md rounded-lg p-5 mt-6">
      <h3 class="text-2xl font-semibold text-gray-800 mb-6">Profit & Loss Statement</h3>
      <div class="overflow-x-auto">
        <table class="table-auto w-full text-left">
          <thead>
            <tr class="bg-teal-600 text-white">
              <th class="py-2 px-4">Description</th>
              <th class="py-2 px-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b bg-gray-50">
              <td class="py-2 px-4">
                Revenue<br />
                <small class="text-gray-600">Total sales generated</small>
              </td>
              <td class="py-2 px-4 font-semibold text-right">
                {{ (details.profit_loss_statement.revenue || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }) }}
              </td>
            </tr>
            <tr class="border-b">
              <td class="py-2 px-4">
                Other Income<br />
                <small class="text-gray-600">Additional income from non-core activities</small>
              </td>
              <td class="py-2 px-4 font-semibold text-right">
                {{ (details.profit_loss_statement.other_income || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }) }}
              </td>
            </tr>
            <tr class="border-b bg-gray-50">
              <td class="py-2 px-4">
                Cost of Goods Sold (COGS)<br />
                <small class="text-gray-600">Direct costs of producing or purchasing goods sold</small>
              </td>
              <td class="py-2 px-4 font-semibold text-right">
                {{ (details.profit_loss_statement.cost_of_goods_sold || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }) }}
              </td>
            </tr>
            <tr class="border-b">
              <td class="py-2 px-4">
                Gross Profit<br />
                <small class="text-gray-600">Revenue + Other Income - COGS</small>
              </td>
              <td class="py-2 px-4 font-semibold text-right">
                {{ (details.profit_loss_statement.gross_profit || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }) }}
              </td>
            </tr>
            <tr class="border-b bg-gray-50">
              <td class="py-2 px-4">
                Operating Expenses (OPEX)<br />
                <small class="text-gray-600">Indirect costs of running the business</small>
              </td>
              <td class="py-2 px-4 font-semibold text-right">
                {{ (details.profit_loss_statement.operating_expenses || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }) }}
              </td>
            </tr>
            <tr class="border-b">
              <td class="py-2 px-4">
                Depreciation<br />
                <small class="text-gray-600">Reduction in value of assets</small>
              </td>
              <td class="py-2 px-4 font-semibold text-right">
                {{ (details.profit_loss_statement.depreciation || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }) }}
              </td>
            </tr>
            <tr class="border-b bg-gray-50">
              <td class="py-2 px-4">
                Amortization<br />
                <small class="text-gray-600">Gradual write-off of intangible assets</small>
              </td>
              <td class="py-2 px-4 font-semibold text-right">
                {{ (details.profit_loss_statement.amortization || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }) }}
              </td>
            </tr>
            <tr class="border-b">
              <td class="py-2 px-4">
                Operating Profit<br />
                <small class="text-gray-600">Gross Profit - OPEX - Depreciation - Amortization</small>
              </td>
              <td class="py-2 px-4 font-semibold text-right">
                {{ (details.profit_loss_statement.operating_profit || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }) }}
              </td>
            </tr>
            <tr class="border-b bg-gray-50">
              <td class="py-2 px-4">
                Tax Expense<br />
                <small class="text-gray-600">Taxes paid on profits</small>
              </td>
              <td class="py-2 px-4 font-semibold text-right">
                {{ (details.profit_loss_statement.tax_expense || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }) }}
              </td>
            </tr>
            <tr class="border-b">
              <td class="py-2 px-4">
                Net Profit<br />
                <small class="text-gray-600">Operating Profit - Tax Expense</small>
              </td>
              <td class="py-2 px-4 font-semibold text-right">
                {{ (details.profit_loss_statement.net_profit || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }) }}
              </td>
            </tr>
            <tr class="border-b bg-gray-50">
              <td class="py-2 px-4">
                Total Expenditure<br />
                <small class="text-gray-600">COGS + OPEX + Depreciation + Amortization + Tax Expense</small>
              </td>
              <td class="py-2 px-4 font-semibold text-right">
                {{
                  (
                    (details.profit_loss_statement.cost_of_goods_sold || 0) +
                    (details.profit_loss_statement.operating_expenses || 0) +
                    (details.profit_loss_statement.depreciation || 0) +
                    (details.profit_loss_statement.amortization || 0) +
                    (details.profit_loss_statement.tax_expense || 0)
                  ).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })
                }}
              </td>
            </tr>
            <tr class="border-b">
              <td class="py-2 px-4">
                Gross Profit Margin<br />
                <small class="text-gray-600">(Gross Profit / (Revenue + Other Income)) * 100</small>
              </td>
              <td class="py-2 px-4 font-semibold text-right">
                {{
                  ((details.profit_loss_statement.gross_profit || 0) /
                    ((details.profit_loss_statement.revenue || 0) + (details.profit_loss_statement.other_income || 0) || 1) * 100
                  ).toFixed(2)
                }}%
              </td>
            </tr>
            <tr>
              <td class="py-2 px-4">
                Net Profit Margin<br />
                <small class="text-gray-600">(Net Profit / (Revenue + Other Income)) * 100</small>
              </td>
              <td class="py-2 px-4 font-semibold text-right">
                {{
                  ((details.profit_loss_statement.net_profit || 0) /
                    ((details.profit_loss_statement.revenue || 0) + (details.profit_loss_statement.other_income || 0) || 1) * 100
                  ).toFixed(2)
                }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Balance Sheet -->
    <div v-if="details" class="card bg-white shadow-md rounded-lg p-5 mt-6">
      <h3 class="text-2xl font-semibold text-gray-800 mb-6">Balance Sheet</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 class="text-lg font-semibold text-gray-800 mb-2">Assets</h4>
          <h5 class="text-md font-medium text-gray-700">Current Assets</h5>
          <ul class="list-disc pl-5 text-gray-600">
            <li>
              Cash: {{ (details.balance_sheet.assets?.current_assets?.cash || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }) }}
            </li>
            <li>
              Bank: {{ (details.balance_sheet.assets?.current_assets?.bank || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }) }}
            </li>
            <li>
              Accounts Receivable: {{ (details.balance_sheet.assets?.current_assets?.accounts_receivable || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }) }}
            </li>
            <li>
              Inventory: {{ (details.balance_sheet.assets?.current_assets?.inventory || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }) }}
            </li>
          </ul>
          <h5 class="text-md font-medium text-gray-700 mt-4">Non-Current Assets</h5>
          <ul class="list-disc pl-5 text-gray-600">
            <li>
              Property, Plant, Equipment: {{ (details.balance_sheet.assets?.non_current_assets?.property_plant_equipment || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }) }}
            </li>
            <li>
              Long-Term Investments: {{ (details.balance_sheet.assets?.non_current_assets?.long_term_investments || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }) }}
            </li>
            <li>
              Intangible Assets: {{ (details.balance_sheet.assets?.non_current_assets?.intangible_assets || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }) }}
            </li>
          </ul>
        </div>
        <div>
          <h4 class="text-lg font-semibold text-gray-800 mb-2">Liabilities</h4>
          <h5 class="text-md font-medium text-gray-700">Current Liabilities</h5>
          <ul class="list-disc pl-5 text-gray-600">
            <li>
              Accounts Payable: {{
  (details.balance_sheet.liabilities?.current_liabilities?.accounts_payable || 0)
    .toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })
}}
            </li>
          </ul>
          <h5 class="text-md font-medium text-gray-700 mt-4">Non-Current Liabilities</h5>
          <ul class="list-disc pl-5 text-gray-600">
            <li>
              Long-Term Loans: {{ (details.balance_sheet.liabilities?.non_current_liabilities?.long_term_loans || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }) }}
            </li>
            <li>
              Deferred Tax Liability: {{ (details.balance_sheet.liabilities?.non_current_liabilities?.deferred_tax_liability || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }) }}
            </li>
          </ul>
        </div>
        <div>
          <h4 class="text-lg font-semibold text-gray-800 mb-2">Equity</h4>
          <ul class="list-disc pl-5 text-gray-600">
            <li>
              Owner Investment: {{ (details.balance_sheet.equity?.owner_investment || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }) }}
            </li>
            <li>
              Retained Earnings: {{ (details.balance_sheet.equity?.retained_earnings || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }) }}
            </li>
            <li>
              Dividends: {{ (details.balance_sheet.equity?.dividends || 0).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }) }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Card } from '@/components/UIComponents';
import LineChart from '@/components/UIComponents/Charts/LineChart';
import BarChart from '@/components/UIComponents/Charts/BarChart';
import PieChart from '@/components/UIComponents/Charts/PieChart';
import Reports from '@/javascript/Api/Reports';
import Shops from '@/javascript/Api/Shops';
import Swal from 'sweetalert2';
import moment from 'moment';
import html2pdf from 'html2pdf.js';

const tooltipOptions = {
  tooltipFillColor: 'rgba(0,0,0,0.8)',
  tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
  tooltipFontSize: 14,
  tooltipFontStyle: 'normal',
  tooltipFontColor: '#fff',
  tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
  tooltipTitleFontSize: 14,
  tooltipTitleFontStyle: 'bold',
  tooltipTitleFontColor: '#fff',
  tooltipYPadding: 6,
  tooltipXPadding: 6,
  tooltipCaretSize: 8,
  tooltipCornerRadius: 6,
  tooltipXOffset: 10,
};

export default {
  components: {
    Card,
    LineChart,
    BarChart,
    PieChart,
  },
  data() {
    return {
      form: { start_date: null, end_date: null, shop_id: 0 },
      loading: false,
      shops: [],
      details: null,
      salesKey: 0,
      opexKey: 0,
      debtKey: 0,
      payablesKey: 0,
      cogsKey: 0,
      budgetKey: 0,
      cashFlowKey: 0,
      salesPerformanceChart: {
        labels: [],
        datasets: [
          {
            label: 'Sales',
            borderColor: '#48BB78',
            fill: true,
            backgroundColor: 'rgba(72, 187, 120, 0.5)',
            hoverBorderColor: '#48BB78',
            borderWidth: 2,
            data: [],
          },
        ],
        options: { tooltips: tooltipOptions },
      },
      opexPerformanceChart: {
        labels: [],
        datasets: [
          {
            label: 'OPEX',
            borderColor: '#ED8936',
            pointBackgroundColor: '#ED8936',
            pointRadius: 4,
            pointHoverRadius: 6,
            lineTension: 0.4,
            fill: false,
            borderWidth: 3,
            data: [],
          },
        ],
        color: '#ED8936',
        options: {
          tooltips: tooltipOptions,
          scales: {
            yAxes: [{ ticks: { fontColor: '#4A5568', beginAtZero: true }, gridLines: { color: '#E2E8F0' } }],
            xAxes: [{ gridLines: { color: '#E2E8F0' }, ticks: { fontColor: '#4A5568' } }],
          },
        },
      },
      debReportChart: {
        labels: ['Total Receivables'],
        datasets: [
          {
            label: 'Receivables',
            borderColor: '#4299E1',
            fill: true,
            backgroundColor: 'rgba(66, 153, 225, 0.5)',
            hoverBorderColor: '#4299E1',
            borderWidth: 2,
            data: [],
          },
        ],
        options: { tooltips: tooltipOptions },
      },
      payablesChart: {
        labels: ['Total Payables'],
        datasets: [
          {
            label: 'Payables',
            borderColor: '#ED64A6',
            fill: true,
            backgroundColor: 'rgba(237, 100, 166, 0.5)',
            hoverBorderColor: '#ED64A6',
            borderWidth: 2,
            data: [],
          },
        ],
        options: { tooltips: tooltipOptions },
      },
      cogsActivityChart: {
        labels: [],
        datasets: [
          {
            label: 'COGS',
            borderColor: '#9F7AEA',
            fill: true,
            backgroundColor: 'rgba(159, 122, 234, 0.5)',
            hoverBorderColor: '#9F7AEA',
            borderWidth: 2,
            data: [],
          },
        ],
        options: { tooltips: tooltipOptions },
      },
      budgetVsActualChart: {
        labels: ['Revenue', 'Expenditure'],
        datasets: [
          {
            label: 'Budgeted',
            backgroundColor: '#ECC94B',
            borderColor: '#ECC94B',
            borderWidth: 1,
            data: [],
          },
          {
            label: 'Actual',
            backgroundColor: '#48BB78',
            borderColor: '#48BB78',
            borderWidth: 1,
            data: [],
          },
        ],
        options: { tooltips: tooltipOptions },
      },
      cashFlowChart: {
        labels: ['Cash Inflow', 'Cash Outflow'],
        datasets: [
          {
            label: 'Cash Flow',
            backgroundColor: ['#48BB78', '#F56565'],
            borderWidth: 0,
            data: [],
          },
        ],
        options: { tooltips: tooltipOptions },
      },
    };
  },
  methods: {
    setDefaultDate() {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      this.form.start_date = yesterday.toISOString().split('T')[0]; // 2025-04-18
      this.form.end_date = today.toISOString().split('T')[0]; // 2025-04-19
    },
    fetchReport() {
      this.loading = true;
      Reports.download_report(this.form)
        .then((res) => {
          this.details = res.data.data;
          console.log('API Response:', this.details); // Debug
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
        .catch((err) => {
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
        .then((res) => {
          this.shops = res.data.data;
          this.loading = false;
        })
        .catch((err) => {
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
    initCharts() {
      if (!this.details) {
        console.warn('No details available for charts');
        return;
      }

      // Sales Performance
      this.salesPerformanceChart.labels = [];
      this.salesPerformanceChart.datasets[0].data = [];
      const salesByDate = {};
      (this.details.ledger_details || [])
        .filter((entry) => entry.account_name.toLowerCase() === 'sales')
        .forEach((entry) => {
          const date = moment(entry.created_at).format('YYYY-MM-DD');
          salesByDate[date] = (salesByDate[date] || 0) + entry.amount;
        });
      Object.keys(salesByDate)
        .sort()
        .forEach((date) => {
          this.salesPerformanceChart.labels.push(date);
          this.salesPerformanceChart.datasets[0].data.push(salesByDate[date]);
        });
      if (!this.salesPerformanceChart.labels.length) {
        this.salesPerformanceChart.labels = ['No Data'];
        this.salesPerformanceChart.datasets[0].data = [0];
      }
      console.log('Sales Chart:', this.salesPerformanceChart);
      this.salesKey++;

      // OPEX Performance
      this.opexPerformanceChart.labels = [];
      this.opexPerformanceChart.datasets[0].data = [];
      const opexByDate = {};
      (this.details.ledger_details || [])
        .filter((entry) => entry.account_name.toLowerCase() === 'purchase')
        .forEach((entry) => {
          const date = moment(entry.created_at).format('YYYY-MM-DD');
          opexByDate[date] = (opexByDate[date] || 0) + entry.amount;
        });
      Object.keys(opexByDate)
        .sort()
        .forEach((date) => {
          this.opexPerformanceChart.labels.push(date);
          this.opexPerformanceChart.datasets[0].data.push(opexByDate[date]);
        });
      if (!this.opexPerformanceChart.labels.length) {
        this.opexPerformanceChart.labels = ['No Data'];
        this.opexPerformanceChart.datasets[0].data = [0];
      }
      console.log('OPEX Chart:', this.opexPerformanceChart);
      this.opexKey++;

      // Receivables
      const totalReceivables = this.details.receivables?.total_receivables || 0; // Sample data
      this.debReportChart.datasets[0].data = [totalReceivables];
      console.log('Receivables Chart:', this.debReportChart);
      this.debtKey++;

      // Payables
      const totalPayables = this.details.balance_sheet.liabilities?.current_liabilities?.accounts_payable || 0; // Sample data
      this.payablesChart.datasets[0].data = [totalPayables];
      console.log('Payables Chart:', this.payablesChart);
      this.payablesKey++;

      // COGS
      this.cogsActivityChart.labels = [];
      this.cogsActivityChart.datasets[0].data = [];
      const cogsByDate = {};
      (this.details.ledger_details || [])
        .filter((entry) => entry.account_name.toLowerCase() === 'cost_of_goods_sold')
        .forEach((entry) => {
          const date = moment(entry.created_at).format('YYYY-MM-DD');
          cogsByDate[date] = (cogsByDate[date] || 0) + entry.amount;
        });
      Object.keys(cogsByDate)
        .sort()
        .forEach((date) => {
          this.cogsActivityChart.labels.push(date);
          this.cogsActivityChart.datasets[0].data.push(cogsByDate[date]);
        });
      if (!this.cogsActivityChart.labels.length) {
        this.cogsActivityChart.labels = ['No Data'];
        this.cogsActivityChart.datasets[0].data = [0];
      }
      console.log('COGS Chart:', this.cogsActivityChart);
      this.cogsKey++;

      // Budget vs Actual
      const budget = this.details.budget_vs_actual || {};
      this.budgetVsActualChart.datasets[0].data = [
        budget.budgeted_revenue || 0,
        budget.budgeted_expenditure || 0,
      ];
      this.budgetVsActualChart.datasets[1].data = [
        budget.actual_revenue || 0,
        budget.actual_expenditure || 0,
      ];
      console.log('Budget vs Actual Chart:', this.budgetVsActualChart);
      this.budgetKey++;

      // Cash Flow
      const cashFlow = this.details.cash_flow || {};
      this.cashFlowChart.datasets[0].data = [
        cashFlow.cash_inflow || 0, // Sample data
        cashFlow.cash_outflow || 0, // Sample data
      ];
      console.log('Cash Flow Chart:', this.cashFlowChart);
      this.cashFlowKey++;
    },
    downloadCSV() {
      if (!this.details) return;

      let csvContent = 'Financial Dashboard Report\n';
      csvContent += `Period,${moment(this.form.start_date).format('MMMM D, YYYY')} - ${moment(this.form.end_date).format('MMMM D, YYYY')}\n`;
      csvContent += `Branch,${this.form.shop_id === '0' ? 'All Shops' : this.shops.find(s => s.id === this.form.shop_id)?.title || 'Unknown'}\n\n`;

      // Key Metrics
      csvContent += 'Key Metrics\n';
      csvContent += 'Metric,Value\n';
      csvContent += `Total Revenue,${this.details.profit_loss_statement.revenue || 0}\n`;
      csvContent += `Total Expenditure,${(this.details.profit_loss_statement.cost_of_goods_sold || 0) + (this.details.profit_loss_statement.operating_expenses || 0) + (this.details.profit_loss_statement.depreciation || 0) + (this.details.profit_loss_statement.amortization || 0) + (this.details.profit_loss_statement.tax_expense || 0)}\n`;
      csvContent += `Net Profit,${this.details.profit_loss_statement.net_profit || 0}\n\n`;

      // Profit & Loss Statement
      csvContent += 'Profit & Loss Statement\n';
      csvContent += 'Description,Amount\n';
      csvContent += `Revenue,${this.details.profit_loss_statement.revenue || 0}\n`;
      csvContent += `Other Income,${this.details.profit_loss_statement.other_income || 0}\n`;
      csvContent += `Cost of Goods Sold,${this.details.profit_loss_statement.cost_of_goods_sold || 0}\n`;
      csvContent += `Gross Profit,${this.details.profit_loss_statement.gross_profit || 0}\n`;
      csvContent += `Operating Expenses,${this.details.profit_loss_statement.operating_expenses || 0}\n`;
      csvContent += `Depreciation,${this.details.profit_loss_statement.depreciation || 0}\n`;
      csvContent += `Amortization,${this.details.profit_loss_statement.amortization || 0}\n`;
      csvContent += `Operating Profit,${this.details.profit_loss_statement.operating_profit || 0}\n`;
      csvContent += `Tax Expense,${this.details.profit_loss_statement.tax_expense || 0}\n`;
      csvContent += `Net Profit,${this.details.profit_loss_statement.net_profit || 0}\n`;
      csvContent += `Total Expenditure,${(this.details.profit_loss_statement.cost_of_goods_sold || 0) + (this.details.profit_loss_statement.operating_expenses || 0) + (this.details.profit_loss_statement.depreciation || 0) + (this.details.profit_loss_statement.amortization || 0) + (this.details.profit_loss_statement.tax_expense || 0)}\n`;
      csvContent += `Gross Profit Margin,${((this.details.profit_loss_statement.gross_profit || 0) / ((this.details.profit_loss_statement.revenue || 0) + (this.details.profit_loss_statement.other_income || 0) || 1) * 100).toFixed(2)}%\n`;
      csvContent += `Net Profit Margin,${((this.details.profit_loss_statement.net_profit || 0) / ((this.details.profit_loss_statement.revenue || 0) + (this.details.profit_loss_statement.other_income || 0) || 1) * 100).toFixed(2)}%\n\n`;

      // Balance Sheet
      csvContent += 'Balance Sheet\n';
      csvContent += 'Category,Item,Value\n';
      csvContent += `Assets,Cash,${this.details.balance_sheet.assets?.current_assets?.cash || 0}\n`;
      csvContent += `Assets,Bank,${this.details.balance_sheet.assets?.current_assets?.bank || 0}\n`;
      csvContent += `Assets,Accounts Receivable,${this.details.balance_sheet.assets?.current_assets?.accounts_receivable || 0}\n`;
      csvContent += `Assets,Inventory,${this.details.balance_sheet.assets?.current_assets?.inventory || 0}\n`;
      csvContent += `Assets,Property Plant Equipment,${this.details.balance_sheet.assets?.non_current_assets?.property_plant_equipment || 0}\n`;
      csvContent += `Assets,Long Term Investments,${this.details.balance_sheet.assets?.non_current_assets?.long_term_investments || 0}\n`;
      csvContent += `Assets,Intangible Assets,${this.details.balance_sheet.assets?.non_current_assets?.intangible_assets || 0}\n`;
      csvContent += `Liabilities,Accounts Payable,${this.details.balance_sheet.liabilities?.current_liabilities?.accounts_payable || 0}\n`;
      csvContent += `Liabilities,Long Term Loans,${this.details.balance_sheet.liabilities?.non_current_liabilities?.long_term_loans || 0}\n`;
      csvContent += `Liabilities,Deferred Tax Liability,${this.details.balance_sheet.liabilities?.non_current_liabilities?.deferred_tax_liability || 0}\n`;
      csvContent += `Equity,Owner Investment,${this.details.balance_sheet.equity?.owner_investment || 0}\n`;
      csvContent += `Equity,Retained Earnings,${this.details.balance_sheet.equity?.retained_earnings || 0}\n`;
      csvContent += `Equity,Dividends,${this.details.balance_sheet.equity?.dividends || 0}\n\n`;

      // Cash Flow
      csvContent += 'Cash Flow\n';
      csvContent += 'Metric,Value\n';
      csvContent += `Cash Inflow,${this.details.cash_flow?.cash_inflow || 0}\n`;
      csvContent += `Cash Outflow,${this.details.cash_flow?.cash_outflow || 0}\n\n`;

      // Receivables
      csvContent += 'Accounts Receivable\n';
      csvContent += 'Metric,Value\n';
      csvContent += `Total Receivables,${this.details.receivables?.total_receivables || 0}\n\n`;

      // Payables
      csvContent += 'Accounts Payables\n';
      csvContent += 'Metric,Value\n';
      csvContent += `Total Payables,${this.details.balance_sheet.liabilities?.current_liabilities?.accounts_payable || 0}\n`;

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `financial_report_${moment(this.form.start_date).format('YYYYMMDD')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    downloadPDF() {
      if (!this.details) return;

      const element = document.querySelector('.container-fluid');
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `financial_report_${moment(this.form.start_date).format('YYYYMMDD')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      };

      html2pdf()
        .set(opt)
        .from(element)
        .save()
        .catch((err) => {
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
    this.fetchReport();
  },
};
</script>

<style scoped>
.loader {
  border: 4px solid #E2E8F0;
  border-top: 4px solid #000;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.card {
  transition: box-shadow 0.3s ease;
  padding: 1.25rem; /* 20px */
}

.card:hover {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.table-auto th,
.table-auto td {
  border-color: #E2E8F0;
  padding: 0.75rem; /* Increased for readability */
}

.table-auto small {
  font-size: 0.75rem;
  line-height: 1.2;
}
</style>