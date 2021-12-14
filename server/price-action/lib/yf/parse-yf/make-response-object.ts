import { RawYFResponse, YFResponse } from "../../../../types/api.types";

/**
 * Convert a raw yf response to a YFResponse object
 */
export function makeYfResponseObject(response: RawYFResponse): YFResponse {
    const { result } = response.chart;
    const { indicators, timestamp } = result[0];
    return {
        ...indicators.quote[0],
        timestamp,
    };
}
