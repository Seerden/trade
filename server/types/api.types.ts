export type YFQuote = {
    open: number[];
    close: number[];
    high: number[];
    low: number[];
    volume: number[];
};

export interface YFResponse extends YFQuote {
    timestamp: number[];
}

export type YFRow = {
    [k in keyof YFResponse]: number;
};

export type RawYFResponse = {
    chart: {
        error: any;
        result: Array<{
            meta: any;
            timestamp: number[];
            indicators: {
                quote: Array<{
                    close: number[];
                    open: number[];
                    high: number[];
                    volume: number[];
                    low: number[];
                }>;
                adjclose?: Array<{
                    adjclose: number[];
                }>;
            };
        }>;
    };
};
