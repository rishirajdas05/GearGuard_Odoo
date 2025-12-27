/**
 * Lightweight API client for the FastAPI backend.
 * - Base URL comes from VITE_API_URL (defaults to http://localhost:8000)
 * - Automatically attaches Bearer token if present
 */

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";

const TOKEN_KEY = "gearguard_access_token";

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}

type ApiFetchOptions = RequestInit & {
  /** set to false to disable Authorization header */
  auth?: boolean;
};

function buildHeaders(options?: ApiFetchOptions) {
  const headers = new Headers(options?.headers ?? {});
  headers.set("Accept", "application/json");

  const hasBody = typeof options?.body !== "undefined" && options?.body !== null;
  const isFormData = hasBody && options?.body instanceof FormData;
  const isBlob = hasBody && options?.body instanceof Blob;

  if (hasBody && !isFormData && !isBlob && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options?.auth !== false) {
    const token = getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}

function toAbsoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (!path.startsWith("/")) return `${API_BASE_URL}/${path}`;
  return `${API_BASE_URL}${path}`;
}

function extractErrorMessage(payload: unknown, fallback: string) {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;

  const anyPayload = payload as any;
  if (typeof anyPayload.detail === "string") return anyPayload.detail;

  if (Array.isArray(anyPayload.detail)) {
    const msgs = anyPayload.detail
      .map((d: any) => d?.msg)
      .filter(Boolean)
      .join(" | ");
    if (msgs) return msgs;
  }

  try {
    return JSON.stringify(payload);
  } catch {
    return fallback;
  }
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const url = toAbsoluteUrl(path);
  const headers = buildHeaders(options);

  const res = await fetch(url, { ...options, headers });

  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) {
    throw new Error(extractErrorMessage(payload, res.statusText));
  }

  return payload as T;
}

export async function apiFetchBlob(path: string, options: ApiFetchOptions = {}): Promise<Blob> {
  const url = toAbsoluteUrl(path);
  const headers = buildHeaders({ ...options, headers: options.headers });

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const contentType = res.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");
    const payload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);
    throw new Error(extractErrorMessage(payload, res.statusText));
  }

  return await res.blob();
}

