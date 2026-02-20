export function buildQueryParams(params: Record<string, string | undefined>) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      query.append(key, value);
    }
  }

  return query.toString();
}
