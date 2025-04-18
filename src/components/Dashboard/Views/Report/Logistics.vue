<template>
    <div>
       <div>
            <label for="" class="mr-2">From: </label>
            <input type="date" class="form-control col-5" v-model="sales_performance_from"> 
          </div>
          <div>
            <label for="" class="mr-2">To: </label>
            <input type="date" class="form-control col-5" v-model="sales_performance_to">
            <button class="btn btn-dark text-light" @click.prevent="getReport()">Get Report <span v-if="loading" class="loader"></span></button>

        </div>
        <table class="table">
            <thead>
                <tr>
                    <th>previous balance</th>
                    <th>transaction amount</th>
                    <th>current balance</th>
                    <th>transaction reference</th>
                    <th>transaction type</th>
                    <th>transaction date</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="data in statement" :key="data.id">
                    <td>{{ (data.previous_balance).toLocaleString() }}</td>
                    <td>{{ (data.amount).toLocaleString() }}</td>
                    <td>{{ (data.current_balance).toLocaleString() }}</td>
                    <td>#{{ data.transaction_id }}</td>
                    <td>{{ data.type }}</td>
                    <td>{{ dateTime(data.created_at)}}</td>
                </tr>
            </tbody>

        </table>
    </div>
</template>

<script setup>
import Reports from '@/javascript/Api/Reports';
import { onMounted, ref } from 'vue';

const loading = ref(false)
// Define today and last month
const today = new Date();
const formattedToday = today.toISOString().split('T')[0];

const lastMonth = new Date(today); // Create a new Date object for lastMonth
lastMonth.setMonth(today.getMonth() - 1); // Set it to one month back
const formattedLastMonth = lastMonth.toISOString().split('T')[0];

// Reactive variables
const sales_performance_from = ref(formattedLastMonth); // Start date
const sales_performance_to = ref(formattedToday); // End date
const statement = ref(null); // Placeholder for fetched data

const dateTime = (date) => {
        var date = new Date(date)
        var time = new Date(date)
        let hours = time.getHours()
        let minutes = time.getMinutes()
        let seconds = time.getSeconds()
        var ampm = hours >= 12 ? 'pm' : 'am'
        return date.toDateString() + " " + hours + ":" + minutes + " " + ampm
    }
// Fetch report function
const getReport = async () => {
    loading.value = true
    const payload = {
        start_date: sales_performance_from.value, // Use reactive variables
        end_date: sales_performance_to.value
    };

    try {
        const { status, data } = await Reports.get_logistics_statement(payload); // Pass payload to API
        if (status === 200) {
            statement.value = data.data; // Update statement with fetched 
            loading.value = false
            
        } else {
            console.error('Failed to fetch report:', data);
            loading.value = false

        }
    } catch (error) {
        console.error('Error fetching report:', error);
        loading.value = false

    }
};

// Fetch report on component mount
onMounted(() => {
    getReport();
});
</script>
