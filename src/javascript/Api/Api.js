import axios from 'axios'

let Api = axios.create({
    // baseURL: "http://localhost:9009/api/v1",
    baseURL: "https://api.enterprise.ngmkt.site/api/v1",
    // baseURL: "https://api.aromaperk.ngmkt.site/api/v1",
    // baseURL: "https://api.bingoml.ngmkt.site/api/v1",
    // baseURL: "https://api.edzain.ngmkt.site/api/v1",
    // baseURL: "https://api.fitandfeet.ngmkt.site/api/v1",
    // baseURL: "https://api.totech.ngmkt.site/api/v1",
    // baseURL: "https://api.chosenconcept.ngmkt.site/api/v1",
    // baseURL: "https://api.bethany.ngmkt.site/api/v1",
    // baseURL: "https://api.royalrelish.ngmkt.site/api/v1",
    // baseURL: "https://api.jtscorner.ngmkt.site/api/v1",
    // baseURL: "https://api.phlorah.ngmkt.site/api/v1",
    // baseURL: "https://api.bijoucafe.com.ng/api/v1",

    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
    },
})

Api.defaults.withCredentials = false

export default Api
