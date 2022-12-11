<template>
  <div>
      <h1>BIJOU CAFE</h1>
  </div>
</template>
<script>
  import CircleChartCard from '@/components/UIComponents/Cards/CircleChartCard.vue'
  import ChartCard from '@/components/UIComponents/Cards/ChartCard';
  import StatsCard from '@/components/UIComponents/Cards/StatsCard';
  import Card from '@/components/UIComponents/Cards/Card';
  import {Badge} from '@/components/UIComponents'
  import Loading from '@/components/Dashboard/Layout/LoadingMainPanel.vue'
  import TaskList from './Widgets/TaskList'
import Sales from '@/javascript/Api/Sales';
  const WorldMap = () => ({
    component: import('./../Maps/FullScreenMap.vue'),
    loading: Loading,
    delay: 200
  })

  export default {
    components: {
      StatsCard,
      ChartCard,
      CircleChartCard,
      WorldMap,
      Badge,
      TaskList,
      Card
    },
    /**
     * Chart data used to render stats, charts. Should be replaced with server data
     */
    data () {
      return {
        user:[],
        toggle:"all",
        all:null,
        completedTrips:null,
        cancelledTrips:null,
				dashboardData:[],
				cancelledData:[],
				dashboardCancelled:[],
				onlineDrivers:0,
				driversData:null,
				driversOnTrip:0,
				spanKey:0,
        statsCards: [
          {
            type: 'dark',
            icon: 'fa fa-list',
            title: 'Cash Payments',
            value: 0,
            footerText:'All Drivers',
            footerTextCount: '0',
          },
          {
            type: 'dark',
            icon: 'fa fa-check',
            title: 'Card Payments',
            value: 0,
            footerText: 'All Passengers',
            footerTextCount: '0',
          },
          {
            type: 'dark',
            icon: 'fa fa-hourglass',
            title: 'Bank Transfer',
            value: 0,
            footerText: 'Realtime Update',
          },
          {
            type: 'dark',
            icon: 'fa fa-exchange',
            title: 'Wallet Payment',
            value: 0,
            footerText: 'Realtime Update',
          },
          {
            type: 'dark',
            icon: 'fa fa-exchange',
            title: 'Credit Sales',
            value: 0,
            footerText: 'Realtime Update',
          },
        ],
        sales:null
      }
    },
    methods: {
      sales_today(){
        Sales.sales_today().then((result) => {
          this.sales = result.data.data[this.toggle]
          var cash = 0
          var card = 0
          var transfer = 0
          var wallet = 0
          var onCredit = 0

          for (let index = 0; index < this.sales.length; index++) {
            if(this.sales[index].sales[0].payment_method == "cash"){
              cash =  cash + this.sales[index].amount
            }else if(this.sales[index].sales[0].payment_method == "card"){
              card =  card + this.sales[index].amount
            }else if(this.sales[index].sales[0].payment_method == "transfer"){
              transfer =  transfer + this.sales[index].amount
            }else if(this.sales[index].sales[0].payment_method == "on_credit"){
              onCredit =  onCredit + this.sales[index].amount
            }else{
              wallet =  wallet + this.sales[index].amount
            }
          }
          this.statsCards[0].value = cash
          this.statsCards[1].value = card
          this.statsCards[2].value = transfer
          this.statsCards[3].value = wallet
          this.statsCards[4].value = onCredit
        })
      }
    },
    created(){
      this.sales_today()
    }
  }

</script>
<style>

</style>

