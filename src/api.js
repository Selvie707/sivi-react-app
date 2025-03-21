import axios from "axios";

const API = axios.create({
  baseURL: "https://via707-sivi.hf.space",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;