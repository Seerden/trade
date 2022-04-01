Benchmark:

inserting 100 trade rows, separately, by running API.query() in a for-loop:
286.396ms
322.178ms

Insert as an array:
98.566ms
113.747ms
89.388ms

Insert using API.queries(queries) where queries is QueryArgs[]:
1.805ms
1.802ms
