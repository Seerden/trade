import axios from "axios";
import { config } from "dotenv";

config();

const { POLYGON_KEY } = process.env;

// Axios instance with authentication header bearer token and api.polygon.io
// baseUrl.
export const axiosPolygon = axios.create({
	baseURL: "https://api.polygon.io",
	headers: {
		Authorization: `Bearer ${POLYGON_KEY}`,
	},
});
