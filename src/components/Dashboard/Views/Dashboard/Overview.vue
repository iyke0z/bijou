<template>
  <div class="row"><br><br>
    <div class="loader" v-if="loading"></div>
   
      <marquee class="col-12 mt-4 mb-3" behavior="" direction="LEFT">
        <b class="mr-3">OPENING BALANCE: &#8358; {{ (profitLoss?.accounting_balance?.opening_cash_balance).toLocaleString() }}</b> | 
        <b class="mr-3">OPENING RECIEVABLE BALANCE: &#8358; {{ (profitLoss?.accounting_balance?.opening_receivables_balance).toLocaleString() }}</b> |
        <b class="mr-3">CLOSING BALANCE: &#8358; {{ (profitLoss?.accounting_balance?.closing_cash_balance).toLocaleString() }}</b> |
        <b class="mr-3">CLOSING RECIEVABLE BALANCE: &#8358; {{ (profitLoss?.accounting_balance?.closing_receivables_balance).toLocaleString() }}</b> |
      </marquee>
    <div class="col-md-12">
      
    </div>
    <div class="col-md-6">
      <card>
        <template slot="header">
          <h4 class="card-title">Sales Performance</h4>
          <p class="category"> Total of the goods or services that a company sells during a specific period.</p>

          <div>
            <label for="" class="mr-2">From: </label>
            <input type="date" class="border border-gray text-primary mb-2" v-model="sales_performance_from"> 
          </div>
          <div>
            <label for="" class="mr-2">To: </label>
            <input type="date" class="border border-gray text-primary mb-2" v-model="sales_performance_to">
          </div>
          <button class="btn btn-dark text-light" @click.prevent="getSalesPerformance()">Get Report <span v-if="isLoading" class="loader"></span></button>

        </template>
        <bar-chart :labels="salesPerformanceChart.labels"
                   :height="250"
                   :datasets="salesPerformanceChart.datasets"
                   :key="salesKey">
        </bar-chart>
        
      </card>
    </div>

    <div class="col-md-6">
      <card>
        <template slot="header">
          <h4 class="card-title">OPEX Performance</h4>
          <p class="category">OPEX refers to the indirect costs required to run the day-to-day operations of a business.</p>

          <div>
            <label for="" class="mr-2">From: </label>
            <input type="date" class="border border-gray text-primary mb-2" v-model="opex_performance_from">
          </div>
          <div>
            <label for="" class="mr-2">To: </label>
            <input type="date" class="border border-gray text-primary mb-2" v-model="opex_performance_to">
          </div>
          <button class="btn btn-dark text-light" @click.prevent="getOpexPerformance()">Get Report <span v-if="isLoading" class="loader"></span></button>
        </template>
        
        <line-chart :labels="opexPerformanceChart.labels"
                    :height="250"
                    :color="opexPerformanceChart.color"
                    :extra-options="opexPerformanceChart.options"
                    :datasets="opexPerformanceChart.datasets"
                    :key="opexKey">
        </line-chart>
      </card>
    </div>
    <div class="col-md-6">
      <card>
        <template slot="header">
          <h4 class="card-title">Receivables</h4>
          <p class="category">Debt Chart for the period</p>
        </template>
        <bar-chart :labels="debReportChart.labels"
                   :height="250"
                   :datasets="debReportChart.datasets" :key="debtKey">
        </bar-chart>
      </card>
    </div>
    <div class="col-md-6">
      <card>
        <template slot="header">
          <h4 class="card-title">COGS</h4>
          <p class="category">COGS refers to the direct costs incurred in producing or purchasing the goods or services that a company sells during a specific period.</p>
          <div>
            <label for="" class="mr-2">From: </label>
            <input type="date" class="border border-gray text-primary mb-2" v-model="cogs_performance_from">
          </div>
          <div>
            <label for="" class="mr-2">To: </label>
            <input type="date" class="border border-gray text-primary mb-2" v-model="cogs_performance_to">
          </div>
          <button class="btn btn-dark text-light" @click.prevent="getCogs()">Get Report <span v-if="isLoading" class="loader"></span></button>

        </template>
        <bar-chart :labels="cogsActivityChart.labels"
                   :height="250"
                   :extra-options="cogsActivityChart.options"
                   :datasets="cogsActivityChart.datasets" 
                   :key="cogsKey">
        </bar-chart>
      </card>
    </div>

    <div class="col-md-4">
      <chart-card :chart-data="paymentMethodChart"
                  chart-type="Pie"
                  title="Payment Method Performane Chart"
                  description="Last Campaign Performance" :key="performanceKey">
        <template slot="header">
          <h5 class="card-title">Payment Method Performance</h5>
          <p class="category">This shows how the different payment methods are performing and it shows which one is used more by customers.</p>

          <div>
            <label for="" class="mr-2">From: </label>
            <input type="date" class="border border-gray text-primary mb-2" v-model="method_performance_from">
          </div>
          <div>
            <label for="" class="mr-2">To: </label>
            <input type="date" class="border border-gray text-primary mb-2" v-model="method_performance_to">
          </div>
          <button class="btn btn-dark text-light" @click.prevent="getMethodPerformance()">Get Report <span v-if="isLoading" class="loader"></span></button>

        </template>
        <template slot="footer">
          <hr>
        </template>
      </chart-card>
    </div>
    <div class="col-md-8">
    

      <div class="card card-stats">
    <div class="card-body">
      <div class="row">

        <div class="col-12 col-md-12" :key="pnlKey">
            <div>
            <center>
              <p class="card-title"><h3>Profit & Loss Account</h3></p></center>
              <div class="card-body">
                <div>
                  <label for="" class="mr-2">From: </label>
                  <input type="date" class="border border-gray text-primary mb-2" v-model="profit_loss_from">
                </div>
                <div>
                  <label for="" class="mr-2">To: </label>
                  <input type="date" class="border border-gray text-primary mb-2" v-model="profit_loss_to">
                </div>
                <button class="btn btn-dark text-light" @click.prevent="getProfitLoss()">Get Report <span v-if="isLoading" class="loader"></span></button>

                <div class="table-responsive">
                  <table class="table">
                  <tr>
                    <td>Turnover <br><small>Refers to the total revenue or sales <br>generated by the business during a specific period.
                    <br>Represents the income before any <br>costs or expenses are deducted.</small></td>
                    <td>&#8358;{{ (profitLoss?.turnover).toLocaleString() }}</td>
                  </tr>
                  <tr>
                    <td>Less: COGS <br><small>Stands for Cost of Goods Sold, which includes the direct costs <br> of producing or purchasing the goods or services sold by the company</small></td>
                    <td>&#8358;{{ (profitLoss?.cogs).toLocaleString() }}</td>
                  </tr>
                  <tr>
                    <td>Gross Profit <br><small>Gross Profit= Turnover − COGS.</small></td>
                    <td>&#8358;{{ (profitLoss?.gross_profit).toLocaleString() }}</td>
                  </tr>
                  <tr>
                    <td>Less: Operating Expenses <br><small>Short for Operating Expenses, which are the indirect costs involved in running the business.</small></td>
                    <td>&#8358;{{ (profitLoss?.opex).toLocaleString() }}</td>
                  </tr>
                  <tr>
                    <td>Net Profit <br><small>Net Profit= Turnover − Total Expenditure</small></td>
                    <td>&#8358;{{ (profitLoss?.net_profit).toLocaleString() }}</td>
                  </tr>
                  <tr>
                    <td>Depreciation <br><small>Value of assets</small></td>
                    <td>&#8358;{{ (profitLoss?.depreciation).toLocaleString() }}</td>
                  </tr>
                  <tr>
                    <td>Total Expense <br><small>Total Expenditure= COGS + OPEX.</small></td>
                    <td>&#8358;{{ (profitLoss?.total_expenditure).toLocaleString() }}</td>
                  </tr>
                  <!-- <tr>
                    <td>Profit Before Tax <br><small>Refers to the total revenue or sales <br>generated by the business during a specific period.
<br>Represents the income before any <br>costs or expenses are deducted.</small></td>
                    <td>&#8358;{{ (profitLoss?.net_profit).toLocaleString() }}</td>
                  </tr> -->
                  <tr>
                    <td>Gross Profit Margin <br><small>A percentage that measures the proportion of revenue left as Gross Profit after covering COGS.</small></td>
                    <td>{{ (profitLoss?.gross_profit_margin).toFixed(2) }}%</td>
                  </tr>
                  <tr>
                    <td>Net Profit Margin <br><small>A percentage that measures the proportion of revenue left as <br> Net Profit after covering all expenses, including COGS and OPEX.</small></td>
                    <td>{{ (profitLoss?.net_profit_margin).toFixed(2) }}%</td>
                  </tr>
                  <tr>
                      <td>OPENING BALANCE <br><small>Amount of cash available at the beginning of a financial period.</small></td>
                      <td style="width:30%">&#8358; {{ (profitLoss?.accounting_balance?.opening_cash_balance).toLocaleString() }}</td>
                  </tr>
                  <tr>
                      <td>OPENING RECEIVABLE BALANCE <br><small>Total amount owed to the business by customers at the beginning of a financial period.</small></td>
                      <td style="width:30%">&#8358; {{ (profitLoss?.accounting_balance?.opening_receivables_balance).toLocaleString() }}</td>
                  </tr>
                  <tr>
                      <td>CLOSING BALANCE <br><small>Amount of cash available at the end of a financial period.</small></td>
                      <td style="width:30%">&#8358; {{ (profitLoss?.accounting_balance?.closing_cash_balance).toLocaleString() }}</td>
                  </tr>
                  <tr>
                      <td>CLOSING RECEIVABLE BALANCE <br><small>Total amount owed to the business by customers at the end of a financial period.</small></td>
                      <td style="width:30%">&#8358; {{ (profitLoss?.accounting_balance?.closing_receivables_balance).toLocaleString() }}</td>
                  </tr>
                </table>
                </div>
               
              </div>
              </div>
             
        </div>
      </div>
    </div>
    <div class="card-footer">
      <hr/>
      <slot name="footer"></slot>
    </div>

  </div>
    </div>
    </div>
      
</template>
<script>
  import { Card } from '@/components/UIComponents'
  import ChartCard from '@/components/UIComponents/Cards/ChartCard'
  import StatCard from '@/components/UIComponents/Cards/StatsCard'
  import LineChart from '@/components/UIComponents/Charts/LineChart'
  import BarChart from '@/components/UIComponents/Charts/BarChart'
  import PieChart from '@/components/UIComponents/Charts/PieChart'
  import Reports from '@/javascript/Api/Reports'

  const tooltipOptions = {
    tooltipFillColor: "rgba(0,0,0,0.5)",
    tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
    tooltipFontSize: 14,
    tooltipFontStyle: "normal",
    tooltipFontColor: "#fff",
    tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
    tooltipTitleFontSize: 14,
    tooltipTitleFontStyle: "bold",
    tooltipTitleFontColor: "#fff",
    tooltipYPadding: 6,
    tooltipXPadding: 6,
    tooltipCaretSize: 8,
    tooltipCornerRadius: 6,
    tooltipXOffset: 10,
  };
  export default {
    components: {
      Card,
      ChartCard,
      LineChart,
      BarChart,
      PieChart,
      StatCard
    },
    data() {
      return {
        loading:false,
        sales_performance_from:null,
        sales_performance_to:null,
        opex_performance_from:null,
        opex_performance_to:null,
        cogs_performance_from:null,
        cogs_performance_to:null,
        method_performance_from: null,
        method_performance_to: null, 
        profit_loss_from: null,
        profit_loss_to: null, 
        isLoading:false,

        salesPerformanceChart: {
          labels: [],
          datasets: [
            {
              label: "Data",
              borderColor: '#b993bc',
              fill: true,
              backgroundColor: '#b993bc',
              hoverBorderColor: '#b993bc',
              borderWidth: 5,
              data: [],
            }
          ]
        },
        salesKey: 0,
        opexKey: 0,
        debtKey: 0,
        cogsKey: 0,
        performanceKey: 0,
        pnlKey: 0,

        profitLoss:{
          turnover:0,
          cogs:0,
          opex:0,
          gross_profit:0,
          total_expenditure:0,
          net_profit:0,
          gross_profit_margin:0,
          net_profit_margin:0
        },
        opexPerformanceChart: {
          labels: [],
          datasets: [{
            label: "Data",
            borderColor: "#f17e5d",
            pointBackgroundColor: "#f17e5d",
            pointRadius: 3,
            pointHoverRadius: 3,
            lineTension: 0,
            fill: false,
            borderWidth: 3,
            data: []
          }],
          color: '#f17e5d',
          options: {
            tooltips: tooltipOptions,
            scales: {
              yAxes: [{

                ticks: {
                  fontColor: "#9f9f9f",
                  beginAtZero: false,
                  maxTicksLimit: 5,
                },
                gridLines: {
                  drawBorder: false,
                  borderDash: [8, 5],
                  zeroLineColor: "transparent",
                  color: '#9f9f9f'
                }

              }],

              xAxes: [{
                barPercentage: 1.6,
                gridLines: {
                  drawBorder: false,
                  borderDash: [8, 5],
                  color: '#9f9f9f',
                  zeroLineColor: "transparent"
                },
                ticks: {
                  padding: 20,
                  fontColor: "#9f9f9f"
                }
              }]
            }
          }
        },
        debReportChart: {
          labels: [],
          datasets: [
            {
              label: "Data",
              borderColor: '#add8e6',
              fill: true,
              backgroundColor: '#add8e6',
              hoverBorderColor: '#add8e6',
              borderWidth: 5,
              data: [],
            }
          ]
        },
        cogsActivityChart: {
          labels: [],
          datasets: [
            {
              label: "Data",
              borderColor: '#a2b9bc',
              fill: false,
              backgroundColor: '#a2b9bc',
              hoverBorderColor: '#a2b9bc',
              borderWidth: 8,
              data: [],
            },
            
          ],
          options: {
            tooltips: tooltipOptions
          }
        },
        paymentMethodChart: {
          labels: [],
          datasets: [{
            label: "Payment Method Performance",
            pointRadius: 0,
            pointHoverRadius: 0,
            backgroundColor: [
              '#e3e3e3',
              '#4acccd',
              '#fcc468',
              '#a2b9bc',
              '#b993bc',
              '#d5f4e6',
              '#92a8d1',
              '#fefbd8',
            ],
            borderWidth: 0,
            data: []
          }],
          options: {
            tooltips: tooltipOptions
          }
        },
        chartHours: {
          data: {

            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
            datasets: [{
              borderColor: "#6bd098",
              backgroundColor: "#6bd098",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 3,
              data: [300, 310, 316, 322, 330, 326, 333, 345, 338, 354]
            },
              {
                borderColor: "#f17e5d",
                backgroundColor: "#f17e5d",
                pointRadius: 0,
                pointHoverRadius: 0,
                borderWidth: 3,
                data: [320, 340, 365, 360, 370, 385, 390, 384, 408, 420]
              },
              {
                borderColor: "#fcc468",
                backgroundColor: "#fcc468",
                pointRadius: 0,
                pointHoverRadius: 0,
                borderWidth: 3,
                data: [370, 394, 415, 409, 425, 445, 460, 450, 478, 484]
              }
            ]
          },

          options: {
            tooltips: tooltipOptions,
            scales: {
              yAxes: [{

                ticks: {
                  fontColor: "#9f9f9f",
                  beginAtZero: false,
                  maxTicksLimit: 5,
                  //padding: 20
                },
                gridLines: {
                  drawBorder: false,
                  zeroLineColor: "transparent",
                  color: 'rgba(255,255,255,0.05)'
                }

              }],


              xAxes: [{
                barPercentage: 1.6,
                gridLines: {
                  drawBorder: false,
                  color: 'rgba(255,255,255,0.1)',
                  zeroLineColor: "transparent",
                  display: false,
                },
                ticks: {
                  padding: 20,
                  fontColor: "#9f9f9f"
                }
              }]
            }
          }
        }
      }
    },

    methods:{
      setDefaultDate(){
        const today = new Date();

        const formattedToday = today.toISOString().split('T')[0]; 

        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);

        const formattedLastMonth = lastMonth.toISOString().split('T')[0];

        this.sales_performance_to = formattedToday;
        this.sales_performance_from = formattedLastMonth;
        this.opex_performance_from = formattedLastMonth
        this.opex_performance_to = formattedToday
        this.cogs_performance_from = formattedLastMonth
        this.cogs_performance_to = formattedToday
        this.method_performance_from = formattedLastMonth
        this.method_performance_to = formattedToday
        this.profit_loss_from = formattedLastMonth
        this.profit_loss_to = formattedToday
      },
      getSalesPerformance(){
        this.loading = true
        let payload = {
          start_date: this.sales_performance_from,
          end_date: this.sales_performance_to
        }
        if (payload.start_date !== null && payload.end_date !== null) {
            Reports.get_sales_performance(payload).then((res) => {

              if ((res.data.data).length > 0) {
                res.data.data.forEach(element => {
                  this.salesPerformanceChart.labels.push(element.sale_date)
                  this.salesPerformanceChart.datasets[0].data.push(element.total_amount)
                });
              }else{
                this.salesPerformanceChart.labels = []
                  this.salesPerformanceChart.datasets[0].data = []
              }
            
            this.salesKey ++
          }).catch(() => {
          })
        }
        this.loading = false

      },

      getOpexPerformance(){
        this.loading = true
        // getCost
        let payload = {
          start_date: this.opex_performance_from,
          end_date: this.opex_performance_to
        }
        if (payload.start_date !== null && payload.end_date !== null) {
            Reports.get_opex_report(payload).then((res) => {
            res.data.data.forEach(element => {
              this.opexPerformanceChart.labels.push(element.request_date)
              this.opexPerformanceChart.datasets[0].data.push(element.total_amount)
            });
            this.opexKey ++
          }).catch(() => {
          })
        this.loading = false
      }
      },

      getDebtPerformance(){
        this.loading = true
        Reports.get_debt_report().then((res) => {
            res.data.data[0].forEach(element => {
              this.debReportChart.labels.push(element.fullname)
              this.debReportChart.datasets[0].data.push(element.wallet_balance)
            });
            this.debtKey ++
          }).catch(() => {
        this.loading = false
      })
      },

      getCogs(){
        this.loading = true
        let payload = {
          start_date: this.cogs_performance_from,
          end_date: this.cogs_performance_to
        }
        if (payload.start_date !== null && payload.end_date !== null) {
            Reports.get_cogs(payload).then((res) => {
              console.log(res.data.data)
              if ((res.data.data).length > 0) {
                res.data.data.forEach(element => {
                  this.cogsActivityChart.labels.push(element.purchase_date)
                  this.cogsActivityChart.datasets[0].data.push(element.total_amount + element.other_cogs)
                });
              }else{
                  this.cogsActivityChart.labels = []
                  this.cogsActivityChart.datasets[0].data = []
              }
            
            this.cogsKey ++
          }).catch(() => {
          })
          this.loading = false
        }
        
      },

      getMethodPerformance(){
        this.loading = true
        let payload = {
          start_date: this.method_performance_from,
          end_date: this.method_performance_to
        }
        if (payload.start_date !== null && payload.end_date !== null) {
            Reports.get_method_performance(payload).then((res) => {

            Object.keys(res.data.data).forEach(element => {
              this.paymentMethodChart.labels.push(element)
              this.paymentMethodChart.datasets[0].data.push(res.data.data[element][0])
            });
            this.performanceKey ++
          }).catch(() => {
          })
          this.loading = false
        }
      },
      getProfitLoss(){
        this.loading = true
        let payload = {
          start_date: this.profit_loss_from,
          end_date: this.profit_loss_to
        }
        if (payload.start_date !== null && payload.end_date !== null) {
            Reports.get_profit_loss(payload).then((res) => {
              this.profitLoss = res.data.data
           
            this.pnlKey ++
          }).catch(() => {
          })
          this.loading = false
        }
      },
    },

    created(){
      this.setDefaultDate()
      this.getSalesPerformance()
      this.getOpexPerformance()
      this.getDebtPerformance()
      this.getCogs()
      this.getMethodPerformance()
      this.getProfitLoss()
    }
  }
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