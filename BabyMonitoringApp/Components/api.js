import axios from 'axios';

// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: 'http:///3.12.146.153:4000/api', // Replace this with your actual base URL
  // baseURL: 'http:///192.168.212.30:4000/api', // Replace this with your actual base URL
});

export default api;