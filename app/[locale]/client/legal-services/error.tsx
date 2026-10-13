"use client";

import RouteError from "@/components/client-lawyer/reusable/route-error";

export default function LegalServicesError(
  props: React.ComponentProps<typeof RouteError>,
) {
  return <RouteError {...props} className="container max-w-5xl py-10" />;
}
