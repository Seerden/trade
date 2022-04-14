import axios from "axios";
import { config } from "dotenv";

config();

const { POLYGON_KEY } = process.env;

/** Axios instance with Polygon baseUrl and auth header. */
export const axiosPolygon = axios.create({
	baseURL: "https://api.polygon.io",
	headers: {
		Authorization: `Bearer ${POLYGON_KEY}`,
	},
});
