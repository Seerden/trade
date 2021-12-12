To go from yf API -> our database, need to go through a few steps:1

1. fetch data from yf API
2. turn RawYFResponse into YFResponse with `makeYfResponseObject`
3. turn YFResponse into an array of individual rows with `yfResponseToRows`
4. bulk insert these rows into the database table corresponding to the ticker for which we fetched the data
