import axios from "axios";

const productClient = axios.create({
  baseURL: "http://localhost:3002",
});

export default productClient;