export function parseBearerToken(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const match = value.match(/^Bearer\s+([^\s]+)$/i);
  const token = match?.[1];
  return token ? token : null;
}
