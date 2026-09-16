import { createFileRoute } from "@tanstack/react-router";
import { WayoraApp } from "@/components/wayora/WayoraApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WAYORA — Plan Smarter Journeys" },
      { name: "description", content: "Compare routes, organize your itinerary, pack for the weather, and keep essential trip details offline with Wayora." },
      { property: "og:title", content: "WAYORA — Plan Smarter Journeys" },
      { property: "og:description", content: "An intelligent travel companion for route planning, trip preparation, and offline access." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WayoraApp,
});
