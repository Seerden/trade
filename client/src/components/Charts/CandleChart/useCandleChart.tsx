import { OHLC } from "./_.types";

type Props = {
    data: OHLC[];
};

/** Get minimum and maximum price of all candles in `data` */
function getDataPriceRange(data: OHLC[]) {
    // this is easy to read, but not at all optimized
    const min = Math.min(...data.map(d => d.low));
    const max = Math.max(...data.map(d => d.high));

    return {
        min,
        max
    };
}

type ChartData = {
    minPrice: number;
    maxPrice: number;
    // priceRange is just | minPrice - maxPrice |, but it's nice to have it as a
    // property instead of re-calculating
    priceDelta: number;
    width: number;
    height: number;
};
function getCandleRenderProps({
    candleData,
    chartData
}: {
    candleData: OHLC;
    chartData: ChartData;
}) {
    const bodyY =
        (Math.abs(Math.max(candleData.close, candleData.open) - chartData.maxPrice) /
            chartData.priceDelta) *
        chartData.height;
    const bodyHeight =
        (Math.abs(candleData.open - candleData.close) / chartData.priceDelta) *
        chartData.height;

    // this is easiest to compute outside of this function, since it's just
    // paddingLeft + index*(candleWidth + candlePadding)
    const bodyX = undefined;
    // this is bodyX + candleWidth/2
    const wickX = undefined;

    const wickY =
        (Math.abs(candleData.high - chartData.maxPrice) / chartData.priceDelta) *
        chartData.height;
    const wickHeight =
        (Math.abs(candleData.low - candleData.high) / chartData.priceDelta) *
        chartData.height;

    return {
        bodyY,
        bodyHeight,
        wickY,
        wickHeight
    };
}

export function useCandleChart({ data }: Props) {
    const chartSize = {
        height: 350,
        width: 750
    };

    const dataPriceRange = getDataPriceRange(data);

    /** Temporarily set min and max to data min and max. Eventually we want to
     * add some amount of padding that's dependent on the price range and maybe
     * even the price itself. */
    const chartPriceRange = {
        min: dataPriceRange.min,
        max: dataPriceRange.max
    };

    // this should be a mapping over data
    const { bodyHeight, bodyY, wickHeight, wickY } = getCandleRenderProps({
        candleData: data[0],
        chartData: {
            ...chartSize,
            minPrice: chartPriceRange.min,
            maxPrice: chartPriceRange.max,
            // again, this is also temporary since we don't consider margins here
            priceDelta: Math.abs(chartPriceRange.min - chartPriceRange.max)
        }
    });
}
