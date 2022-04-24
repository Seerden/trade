import { captureMessage } from "@sentry/node";
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

/** Send a Sentry message if we hit Polygon's rate limit. */
axiosPolygon.interceptors.response.use((response) => {
	if (response.status === 429) {
		const message = "Reached Polygon rate limit";
		captureMessage(message, { extra: { response } });
		return Promise.reject(message);
	}

	return response;
});
