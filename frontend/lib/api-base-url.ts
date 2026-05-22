const TRAILING_SLASHES = /\/+$/;

/**
 * Trailing slashes are stripped for stable URL building.
 * If NEXT_PUBLIC_API_URL is not set, returns an empty string to use same-origin proxying.
 */
export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL;
  if (raw == null) return "";
  const t = String(raw).trim();
  return t.replace(TRAILING_SLASHES, "");
}
