/** @note Each key here is also a key of aggregateResponseKeyMap */
export type PolygonAggregateResult = {
	v: number;
	vw: number;
	o: number;
	c: number;
	h: number;
	l: number;
	t: number;
	n: number;
};

export type PolygonAggregateResults = PolygonAggregateResult[];

export interface SnapshotResult extends PolygonAggregateResult {
	T: string;
}

export type SnapshotResults = SnapshotResult[];
