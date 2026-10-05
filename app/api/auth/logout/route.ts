import { getAppUrl } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const nextParam = request.nextUrl.searchParams.get("next");
  const nextPath = nextParam?.startsWith("/") ? nextParam : "/sign-in";

  const appUrl = await getAppUrl(request.url);

  const response = NextResponse.redirect(new URL(nextPath, appUrl));

  response.cookies.delete("token");

  return response;
}
