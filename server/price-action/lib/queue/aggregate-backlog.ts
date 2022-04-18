// fetch most active tickers for all dates in backlog date range [2 years ago,
// today]

import dayjs from "dayjs";
import { formatYMD } from "../time/format-YMD";

/**
   Two options for store shape:
   (1)
      key: date,
      values: Set{ticker}

      On finding a date to fetch for a ticker, we're also fetching the previous
      52 days. So if we do this, we need to access 52 redis keys.

   (2)
      key: ticker
      values: Set{date}

      On finding a date to fetch, we need to add another 51 dates. With this
      method, we only need to access one Redis key.

*/

function queueAggregateBacklog() {
	const todayYMD = formatYMD(new Date());
	const twoYearsAgoPlusOneDay = formatYMD(
		dayjs(todayYMD).add(-2, "year").add(1, "day")
	);

	// let currentDate = todayYMD;

	// fetch daily most active for every date in the past two years, group by
	// timestamp

	// convert the above timestamps to dates

	// for each date, loop through all tickers

	// for each ticker, check store. If the date isn't in set 1m:{ticker}:
	// 1. add this date + 51 days before this date, to a job object
	// 2. add each of these 52 dates to 1m:{ticker] set

	// if date _is_ in 1m:{ticker}, (1) either do nothing, or (2) get the _earliest_
	// existing date-to-fetch (from the 52 dates of latest queued job), and get
	// add a job with the 52 days just before _that_ date, this way we get more
	// coverage of 1m data.

	// while (currentDate >= twoYearsAgoPlusOneDay) {
	// 1d data exists for this date
	// Fetch most active tickers for this date
	// await fetchDailyMostActive();
	//
	// }
}
