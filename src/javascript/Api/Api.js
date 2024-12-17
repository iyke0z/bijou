import axios from 'axios'

let Api = axios.create({
    baseURL: "https://api.enterprise.ngmkt.site/api/v1",
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
    },
})

Api.defaults.withCredentials = false

export default Api
