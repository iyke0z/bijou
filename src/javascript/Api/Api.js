import axios from 'axios'

let Api = axios.create({
    // baseURL: "http://bijou.test/api/v1",
    baseURL: "http://localhost:9005/api/v1",
    // baseURL: "https://api.aromaperk.ngmkt.site/api/v1",
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
    },
})

Api.defaults.withCredentials = false

export default Api
