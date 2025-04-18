import axios from 'axios';

let Api = axios.create({
  baseURL: "http://localhost:9009/api/v1",
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
  },
  responseType: 'json', // Set default
});

Api.defaults.withCredentials = false;

Api.interceptors.request.use(config => {
  // Set default responseType if not manually specified
  if (!config.responseType) {
    config.responseType = 'json';
  }

  // Only modify shop_id for POST or PUT
  if (['post', 'put'].includes(config.method)) {
    const url = new URL(config.url, Api.defaults.baseURL);
    const shopId = localStorage.getItem('shopId');

    if (shopId === '0') {
      url.searchParams.set('shop_id', '1');
    }

    config.url = url.pathname + url.search;
  }

  return config;
}, error => {
  return Promise.reject(error);
});

export default Api;
