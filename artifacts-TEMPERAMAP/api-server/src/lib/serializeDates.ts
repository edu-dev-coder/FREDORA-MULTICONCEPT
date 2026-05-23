/**
 * Converts all Date values in an object (or array of objects) to ISO strings,
 * so they satisfy zod.string() schemas generated from OpenAPI date-time fields.
 */
export function serializeDates<T extends Record<string, unknown>>(row: T): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    out[k] = v instanceof Date ? v.toISOString() : v;
  }
  return out as T;
}

export function serializeDatesArray<T extends Record<string, unknown>>(rows: T[]): T[] {
  return rows.map(serializeDates);
}
