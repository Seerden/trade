import axios from "axios";
import { config } from "dotenv";

config();

const { POLYGON_KEY } = process.env;

// create an axios instance with authentication header bearer token
const axiosInstance = axios.create({
	baseURL: "https://api.polygon.io",
	headers: {
		Authorization: `Bearer ${POLYGON_KEY}`,
	},
});

export default axiosInstance;
