// src/axios.js
import axios from "axios";

// Point every request to your Express backend:
axios.defaults.baseURL = "http://localhost:3000";

// Required if you’re using cookies or want auth headers to be sent cross‐site
axios.defaults.withCredentials = true;

// Later on, your AuthHandler will do:
// axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

export default axios;
