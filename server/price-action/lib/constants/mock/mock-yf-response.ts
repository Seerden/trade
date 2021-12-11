import { RawYFResponse, YFResponse } from "../../../../types/api.types";

export const mockRawYfResponse: RawYFResponse = {
    chart: {
        error: null,
        result: [
            {
                meta: {},
                indicators: {
                    quote: [
                        {
                            close: [0],
                            open: [0],
                            high: [0],
                            low: [0],
                            volume: [0],
                        },
                    ],
                },
                timestamp: [0],
            },
        ],
    },
};

export const mockYfResponse: YFResponse = {
    close: [0],
    open: [0],
    high: [0],
    low: [0],
    volume: [0],
    timestamp: [0],
};
