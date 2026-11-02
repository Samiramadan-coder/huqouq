import { getAppUrl } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const nextParam = request.nextUrl.searchParams.get("next");
  const nextPath = nextParam?.startsWith("/") ? nextParam : "/sign-in";

  const appUrl = await getAppUrl(request.url);

  const response = NextResponse.redirect(new URL(nextPath, appUrl));

  response.cookies.delete("token");

  // Shown as a toast on the next page by <FlashToast />
  const message = request.nextUrl.searchParams.get("message");
  if (message) {
    response.cookies.set("flash_message", message.slice(0, 300), {
      path: "/",
      maxAge: 60,
      sameSite: "lax",
    });
  }

  return response;
}
