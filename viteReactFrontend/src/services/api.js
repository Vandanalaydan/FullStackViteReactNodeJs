// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api", // change if needed
  withCredentials: true, // for cookies/session
});

export default api;
