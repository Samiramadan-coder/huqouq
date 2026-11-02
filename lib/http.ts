import { redirect } from "next/navigation";
import { getServerLanguage, getTokenHeaders } from "./cookies";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type QueryParams = Record<string, string | number | boolean | null | undefined>;

interface RequestConfig extends Omit<RequestInit, "method" | "body"> {
  params?: QueryParams;
}

interface HttpResponse<T = unknown> {
  data: T;
  status: number;
  ok: boolean;
}

const LOGOUT_URL = "/api/auth/logout?next=/sign-in";

function readField(data: unknown, key: string): unknown {
  return data !== null && typeof data === "object"
    ? (data as Record<string, unknown>)[key]
    : undefined;
}

class HttpError extends Error {
  readonly status: number;
  readonly data: unknown;
  /** The API's `message`, safe to show to the user. */
  readonly responseMessage?: string;

  constructor(status: number, data: unknown) {
    const message = readField(data, "message");
    const responseMessage = typeof message === "string" ? message : undefined;

    super(responseMessage ?? `Request failed with status ${status}`);
    this.name = "HttpError";
    this.status = status;
    this.data = data;
    this.responseMessage = responseMessage;
  }
}

type UserFacingStatus = 401 | 403 | 422;

// An error whose message the user should see: validation errors (422) and
// 401/403 messages. Server actions return `errors` / `responseMessage` from
// their `instanceof ValidationError` branch, and the UI shows them in a toast.
class ValidationError extends HttpError {
  declare readonly status: UserFacingStatus;
  readonly errors: Record<string, string[]>;

  constructor(status: UserFacingStatus, data: unknown) {
    super(status, data);
    this.name = "ValidationError";

    const errors = readField(data, "errors");
    this.errors =
      errors !== null && typeof errors === "object"
        ? (errors as Record<string, string[]>)
        : {};
  }
}

function buildUrl(baseURL: string, path: string, params?: QueryParams) {
  const url = new URL(path, baseURL);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value != null) url.searchParams.set(key, String(value));
  });

  return url.toString();
}

async function buildHeaders(extraHeaders?: HeadersInit): Promise<Headers> {
  const [tokenHeaders, language] = await Promise.all([
    getTokenHeaders(),
    getServerLanguage(),
  ]);

  const headers = new Headers({ Accept: "application/json" });

  // Skip the empty Authorization header returned when there is no token
  Object.entries(tokenHeaders).forEach(([key, value]) => {
    if (value) headers.set(key, value);
  });

  if (language) headers.set("Accept-Language", language);

  new Headers(extraHeaders).forEach((value, key) => headers.set(key, value));

  return headers;
}

function isBodyInit(body: unknown): body is BodyInit {
  return (
    body instanceof URLSearchParams ||
    body instanceof Blob ||
    body instanceof ArrayBuffer ||
    ArrayBuffer.isView(body) ||
    body instanceof ReadableStream ||
    typeof body === "string"
  );
}

// Parse JSON when the API says so; empty bodies (e.g. 204) and non-JSON
// responses come back as text.
async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  const isJson = response.headers
    .get("Content-Type")
    ?.includes("application/json");

  if (!isJson || !text) return text;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function handleUnauthorized(): Promise<never> {
  if (typeof window === "undefined") redirect(LOGOUT_URL);

  window.location.replace(LOGOUT_URL);

  // Keep the caller waiting while the browser navigates away
  return new Promise<never>(() => {});
}

function createHttp(baseURL: string) {
  async function request<T = unknown>(
    method: HttpMethod,
    path: string,
    body?: unknown,
    config: RequestConfig = {},
  ): Promise<HttpResponse<T>> {
    const { params, headers: extraHeaders, ...init } = config;
    const headers = await buildHeaders(extraHeaders);

    let requestBody: BodyInit | undefined;

    if (body instanceof FormData) {
      // Let fetch set the multipart boundary
      headers.delete("Content-Type");
      requestBody = body;
    } else if (isBodyInit(body)) {
      requestBody = body;
    } else if (body != null) {
      requestBody = JSON.stringify(body);
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
    }

    const response = await fetch(buildUrl(baseURL, path, params), {
      ...init,
      method,
      headers,
      body: requestBody,
    });

    const data = await parseBody(response);

    if (response.ok) {
      return { data: data as T, status: response.status, ok: true };
    }

    switch (response.status) {
      case 401:
        // With a token the session is no longer valid. Without one (login,
        // register...) it's a user-facing error such as wrong credentials.
        if (headers.has("Authorization")) return handleUnauthorized();
        throw new ValidationError(401, data);
      case 403:
      case 422:
        throw new ValidationError(response.status, data);
      default:
        throw new HttpError(response.status, data);
    }
  }

  return {
    get<T = unknown>(path: string, config?: RequestConfig) {
      return request<T>("GET", path, undefined, config);
    },
    post<T = unknown>(path: string, body?: unknown, config?: RequestConfig) {
      return request<T>("POST", path, body, config);
    },
    put<T = unknown>(path: string, body?: unknown, config?: RequestConfig) {
      return request<T>("PUT", path, body, config);
    },
    patch<T = unknown>(path: string, body?: unknown, config?: RequestConfig) {
      return request<T>("PATCH", path, body, config);
    },
    delete<T = unknown>(path: string, config?: RequestConfig) {
      return request<T>("DELETE", path, undefined, config);
    },
  };
}

const http = createHttp(process.env.NEXT_PUBLIC_API_URL ?? "");

export { http, createHttp, HttpError, ValidationError };
export type { HttpResponse, RequestConfig };
