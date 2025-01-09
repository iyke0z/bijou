import axios from 'axios';

let Api = axios.create({
    baseURL: "http://localhost:9009/api/v1",
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
    },
});

Api.defaults.withCredentials = false;

// Add an interceptor to modify `shop_id` globally for POST and PUT requests
Api.interceptors.request.use(config => {
    // Check if the request method is POST or PUT
    if (['post', 'put'].includes(config.method)) {
        // Parse the query string from the relative URL
        const url = new URL(config.url, Api.defaults.baseURL);
        const shopId = localStorage.getItem('shopId');

        if (shopId === '0') {
            // Replace `shop_id=0` with `shop_id=1` in the query params
            url.searchParams.set('shop_id', '1');
        }

        // Update only the `url` field in the Axios config
        config.url = url.pathname + url.search;
    }

    return config;
}, error => {
    return Promise.reject(error);
});

export default Api;
