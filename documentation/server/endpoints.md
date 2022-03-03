## Notes:

We could turn this into an actual specification (e.g. with Swagger or Postman).

## Endpoints

### Routers:

-   devRouter
    -   /
-   authRouter
    -   /auth

---

-   `/`

    -   GET

        Sends the following json: { message: string }

#### devRouter

-   `/daily/all`

    -   GET
        calls `fetchDailyOHLC`

-   `/:ticker/1m/:to`

    -   POST
        -   calls `fetchAndInsertMaxOneMinuteData`
        -   sends the response of this function as json

-   `/:ticker/1m/max/:to`

    -   GET
        -   calls fetchOneMinuteMaxData
        -   sends return of `dev_firstAndLastMaxOneMinuteDataResultRow` as json

-   `/:ticker/1m/:from/:to`

    -   GET
        -   calls `fetchPriceActionForTicker`
        -   sends as json the .rows return property of this function

-   `/snapshot/:date`
    -   POST
        -   calls `fetchAndInsertSnapshot`,
        -   sends as json the response of this function

#### authRouter

-   `/register`
    -   POST
        -   calls `createUser`
        -   sends as json the result of this function
-   `/login`

    -   POST
        -   calls as middleware `passport.authenticate('local')`
        -   sends as json (part of) `req.user`

-   `/me`

    -   GET
        -   sends as json the object `req.user`

-   `/logout`
    -   POST
        -   calls `req.session.destroy`, which in turns calls `req.logOut`
        -   sends as json { success: boolean, message: string }
