import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: "https://portfolio-backend-production-d996.up.railway.app/api/",
  withCredentials: true,
  headers: {
    "X-CSRFToken": Cookies.get("csrftoken") || "",
  },
});

export default instance;
