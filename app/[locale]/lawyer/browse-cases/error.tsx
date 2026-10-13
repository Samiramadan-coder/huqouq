"use client";

import RouteError from "@/components/client-lawyer/reusable/route-error";

export default function BrowseCasesError(
  props: React.ComponentProps<typeof RouteError>,
) {
  return <RouteError {...props} className="px-4 sm:px-6 py-10" />;
}
