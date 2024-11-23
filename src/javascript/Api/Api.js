import axios from 'axios'

let Api = axios.create({
    // baseURL: "http://bijou.test/api/v1",
    baseURL: "api.edzain.ngmkt.site/api/v1",
    // baseURL: "https://api.bijoucafe.com.ng/api/v1",
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
    },
})

Api.defaults.withCredentials = false

export default Api
