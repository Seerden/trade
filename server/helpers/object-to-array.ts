/**
 * Given an object and a list of fields, map the object to a list, where each
 * entry is object[field]. So this is like Object.values(object), except we control
 * which fields are present, and in which order.
 *
 * @usage postgres likes arrays, e.g. for multi-insert or for `IN()` statements.
 * If we have access to `fields` and to the result of this function, then
 * parametrized queries become much easier to build.
 *
 * @note in cases where object[field] doesn't have a primitive type, postgres will
 * probably not like us very much. Make sure to handle these cases separately.
 */
export function objectToArray<T>(object: T, fields: Array<keyof T>) {
	if (!fields.length) return;

	if (!fields.every((field) => field in object)) return;

	return fields.map((field) => object[field]);
}
