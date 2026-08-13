import { redirect } from "next/navigation";
import { getServerLanguage, getTokenHeaders } from "./cookies";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestConfig extends Omit<RequestInit, "method" | "body"> {
  params?: Record<string, string | number | boolean>;
}

interface HttpResponse<T = unknown> {
  data: T;
  status: number;
  ok: boolean;
}

class HttpError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.data = data;
  }
}

class ValidationError extends Error {
  status: 422;
  errors: Record<string, string[]>;

  constructor(data: unknown) {
    super("Validation failed");
    this.name = "ValidationError";
    this.status = 422;
    this.errors = ValidationError.parseErrors(data);
  }

  private static parseErrors(data: unknown): Record<string, string[]> {
    if (
      data !== null &&
      typeof data === "object" &&
      "errors" in data &&
      typeof (data as Record<string, unknown>).errors === "object"
    ) {
      return (data as { errors: Record<string, string[]> }).errors;
    }
    return {};
  }
}

function buildUrl(
  baseURL: string,
  path: string,
  params?: Record<string, string | number | boolean>,
): string {
  const url = new URL(path, baseURL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

function createHttp(baseURL: string) {
  const defaultHeaders: Record<string, string> = {
    Accept: "application/json",
  };

  async function handleUnauthorized(): Promise<never> {
    const logoutUrl = "/api/auth/logout?next=/login";

    if (typeof window === "undefined") {
      redirect(logoutUrl);
    }

    window.location.replace(logoutUrl);

    return new Promise<never>(() => {});
  }

  function isSerializableBody(body: unknown): body is BodyInit {
    return (
      body instanceof FormData ||
      body instanceof URLSearchParams ||
      body instanceof Blob ||
      body instanceof ArrayBuffer ||
      ArrayBuffer.isView(body) ||
      body instanceof ReadableStream ||
      typeof body === "string"
    );
  }

  async function request<T = unknown>(
    method: HttpMethod,
    path: string,
    body?: unknown,
    config: RequestConfig = {},
  ): Promise<HttpResponse<T>> {
    const { params, headers: extraHeaders, ...restConfig } = config;

    const url = buildUrl(baseURL, path, params);

    const headers = new Headers();
    Object.entries(defaultHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });

    const tokenHeaders = await getTokenHeaders();
    const language = await getServerLanguage();

    Object.entries(tokenHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });

    if (language) {
      headers.set("Accept-Language", language);
    }

    if (extraHeaders) {
      new Headers(extraHeaders).forEach((value, key) => {
        headers.set(key, value);
      });
    }

    let requestBody: BodyInit | undefined;

    if (body !== undefined) {
      if (isSerializableBody(body)) {
        requestBody = body;
      } else {
        requestBody = JSON.stringify(body);
        if (!headers.has("Content-Type")) {
          headers.set("Content-Type", "application/json");
        }
      }

      if (body instanceof FormData) {
        // Let fetch set multipart boundaries automatically.
        headers.delete("Content-Type");
      }
    }

    const response = await fetch(url, {
      method,
      headers,
      body: requestBody,
      ...restConfig,
    });

    let data: unknown;
    const contentType = response.headers.get("Content-Type") ?? "";
    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      if (response.status === 401) {
        await handleUnauthorized();
      }

      if (response.status === 422) {
        throw new ValidationError(data);
      }

      throw new HttpError(
        `Request failed with status ${response.status}`,
        response.status,
        data,
      );
    }

    return { data: data as T, status: response.status, ok: response.ok };
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
    /** Set or update a default header (e.g. Authorization token) */
    setHeader(key: string, value: string) {
      defaultHeaders[key] = value;
    },
    /** Remove a default header */
    removeHeader(key: string) {
      delete defaultHeaders[key];
    },
  };
}

const http = createHttp(process.env.NEXT_PUBLIC_API_URL ?? "");

export { http, createHttp, HttpError, ValidationError };
export type { HttpResponse, RequestConfig };
