import { YFRow } from "./api.types";

export type PriceActionResponse = {
    [k in keyof YFRow]: Array<number | string>;
};
