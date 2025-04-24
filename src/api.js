import axios from "axios";

const API = axios.create({
  baseURL: "https://d5b1-34-125-144-74.ngrok-free.app/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
