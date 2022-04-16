import { CandlestickData, createChart, UTCTimestamp } from "lightweight-charts";
import { useEffect } from "react";
import data from "./data.json";

const d = JSON.parse(data.data).map(
	(d, i) =>
		({
			volume: d.v,
			open: d.o,
			high: d.h,
			low: d.l,
			close: d.c,
			// Have to cast to UTCTimestamp, this is a feature for whatever reason.
			// Add 2 hours because timezones don't work properly, I think.
			time: (d.t / 1000 + 2 * 3600) as UTCTimestamp,
			// time: dayjs(new Date())
			// 	.add(i, "day")
			// 	.format("YYYY-MM-DD"),
		} as CandlestickData)
);

export default function Chart(): JSX.Element {
	useEffect(() => {
		const chartContainer = document.createElement("div");
		chartContainer.style.width = "max-content";
		chartContainer.style.margin = "0 auto";
		chartContainer.id = "chart";
		document.body.appendChild(chartContainer);

		const chart = createChart(chartContainer, {
			width: 800,
			height: 450,
			grid: { horzLines: { visible: true } },
			timeScale: { timeVisible: true, secondsVisible: false },
		});
		const series = chart.addCandlestickSeries({});
		series.setData(d);
	}, []);

	return <>HEY THERE</>;
}
