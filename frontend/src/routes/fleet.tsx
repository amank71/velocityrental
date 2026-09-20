import { createFileRoute } from "@tanstack/react-router";
import { FleetExplorer } from "@/components/rental/fleet-explorer";
export const Route = createFileRoute("/fleet")({ head: () => ({ meta: [{ title: "Fleet — Velocity Fleet" },{ name: "description", content: "Browse available hatchbacks, sedans, SUVs and MUVs in the Velocity Fleet." },{ property: "og:title", content: "Browse the Velocity Fleet" },{ property: "og:description", content: "Compare verified vehicles, status and daily rental rates." },{ property: "og:type", content: "website" },{ name: "twitter:card", content: "summary_large_image" }] }), component: FleetPage });
function FleetPage(){return <main className="mx-auto min-h-[75vh] max-w-7xl px-5 py-12 sm:px-6"><FleetExplorer /></main>}
