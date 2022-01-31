import { constructDatabasePool } from "./construct-pool";
import {
    apiDatabasePoolCredentials,
    priceActionDatabasePoolCredentials,
} from "./pool-credentials";

export const apiPool = constructDatabasePool(apiDatabasePoolCredentials);
export const priceActionPool = constructDatabasePool(priceActionDatabasePoolCredentials);
