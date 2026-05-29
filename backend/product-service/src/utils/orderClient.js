import axios from "axios";

const orderClient = axios.create({
  baseURL: "http://localhost:3003",
});

export default orderClient;