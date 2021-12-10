import dayjs from "dayjs";

/* Market holidays calendar: https://www.nyse.com/markets/hours-calendars
    No point in using a scraper for this, there are fewer than 10 dates per year,
    so it's much quicker to manually write them out  */
const holidays2021 = "Jan 1, Jan 18, Feb 15, Apr 2, May 31, Jul 5, Sep 6, Dec 24"
    .split(",")
    .map((date) => dayjs(`2021 ${date}`));

const holidays2022 = "Jan 17, Feb 21, Apr 15, May 30, Jun 20, Jul 4, Sep 5, Dec 26"
    .split(",")
    .map((date) => dayjs(`2022 ${date}`));

export const marketHolidays = holidays2021.concat(holidays2022);
