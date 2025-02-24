import axios from "axios";

const API = axios.create({
  baseURL: "https://sivi-flask-app-production.up.railway.app/",  // Ganti dengan Railway URL-mu
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;