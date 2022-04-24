## Notes:

We could turn this into an actual specification (e.g. with Swagger or Postman).

## This file:

-   routes that mention `auth!` are accessible only by the user making a request
    for their own data
-   endpoint parameters like `:from` denote `req.param`s
-   endpoint parameters like `:from?` denote optional parameters

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
        calls `fetchSnapshot`

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

## To-do:

#### tradeRouter

-   `/tickets`

    -   auth!
    -   POST
        -   req.body contains `Array<BuyTicket | SellTicket>`
        -   insert tickets (could be just 1, but it's an array nonetheless) into database
        -   return inserted tickets (including (newly created) ticketIds and
            tradeIds)

-   `/tickets/:ticker/:from?/:to?`
    -   auth!
    -   GET
        -   retrieve from the database all of a user's tickets for a given ticker,
            optionally constrained to only a given date range ($\in [\text{from},
          \text{to}]$)
-   `/tickets?ids`
    -   auth!
    -   GET
        -   retrieve all of a user's tickets, optionally specifying only certain `ids`
-   `/trades`
    -   auth!
    -   GET
        -   retrieve a list of trades. Similar to /tickets, except trades contain
            more information than just ticket data.
