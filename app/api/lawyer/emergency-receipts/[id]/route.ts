import type { NextRequest } from "next/server";
import { getServerLanguage, getTokenHeaders } from "@/lib/cookies";

// Streams an emergency membership receipt from the API, adding the lawyer's
// token from the HTTP-only cookie so the browser can download it with a plain link.
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/lawyer/emergency-receipts/[id]">,
) {
  const { id } = await ctx.params;

  if (!/^\d+$/.test(id)) {
    return new Response("Invalid receipt id", { status: 400 });
  }

  const [{ Authorization }, language] = await Promise.all([
    getTokenHeaders(),
    getServerLanguage(),
  ]);

  if (!Authorization) {
    return new Response("Unauthorized", { status: 401 });
  }

  const response = await fetch(
    new URL(
      `/api/lawyer/emergency/membership/receipts/${id}`,
      process.env.NEXT_PUBLIC_API_URL,
    ),
    {
      headers: {
        Authorization,
        Accept: "application/pdf, */*",
        ...(language ? { "Accept-Language": language } : {}),
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return new Response("Receipt not available", { status: response.status });
  }

  const headers = new Headers();
  headers.set(
    "Content-Type",
    response.headers.get("Content-Type") ?? "application/pdf",
  );
  headers.set(
    "Content-Disposition",
    response.headers.get("Content-Disposition") ??
      `attachment; filename="receipt-${id}.pdf"`,
  );
  headers.set("Cache-Control", "private, no-store");

  return new Response(response.body, { status: 200, headers });
}
