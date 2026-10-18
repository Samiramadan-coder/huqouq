"use client";

import RouteError from "@/components/client-lawyer/reusable/route-error";

export default function DashboardError(
  props: React.ComponentProps<typeof RouteError>,
) {
  return (
    <RouteError {...props} className="container max-w-7xl mx-auto py-10" />
  );
}
