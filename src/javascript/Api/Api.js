import axios from 'axios'

let Api = axios.create({
    // baseURL: "http://bijou.test/api/v1",
    baseURL: "http://192.168.0.169:8000/api/v1",
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
    },
})

Api.defaults.withCredentials = false

export default Api
