// src/axios.js
import axios from 'axios';

// Point all axios requests to your backend
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true; // if you rely on cookies/sessions

export default axios;
