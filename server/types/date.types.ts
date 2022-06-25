import { Dayjs } from "dayjs";

export type DateOrDayjs = Date | Dayjs;
export type Datelike = DateOrDayjs | string;
