import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, CalendarRange, Clock3, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FleetExplorer } from "@/components/rental/fleet-explorer";
import heroImage from "@/assets/hero-creta.jpg";
import { rentalDays } from "@/lib/rental-data";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Velocity Fleet — Self-drive car rentals in Delhi NCR" },
    { name: "description", content: "Book verified self-drive cars in Delhi NCR with transparent daily rates and real-time availability." },
    { property: "og:title", content: "Velocity Fleet — Ready to roll" },
    { property: "og:description", content: "Realistic self-drive rentals with clear INR pricing and fast booking." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: HomePage,
});

function HomePage() {
  const [city, setCity] = useState("Delhi NCR");
  const [start, setStart] = useState("2026-10-01");
  const [end, setEnd] = useState("2026-10-05");
  const [carClass, setCarClass] = useState("Any class");
  const [searched, setSearched] = useState(false);
  const days = rentalDays(start, end);
  return <main>
    <section className="mx-auto grid max-w-7xl gap-10 px-5 py-10 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:py-12">
      <div className="lg:col-span-7">
        <p className="eyebrow animate-rise">Rent · Drive · Return</p>
        <h1 className="animate-rise mt-4 font-display text-[clamp(4rem,9vw,7rem)] leading-[0.86] text-ink"><span className="brand-gradient">READY</span><br />TO ROLL</h1>
        <p className="animate-rise mt-6 max-w-[45ch] text-base leading-7 text-muted-foreground">Self-drive rentals across Delhi NCR. Transparent daily rates, live fleet status, and keys in hand without the usual paperwork drama.</p>
        <form onSubmit={(event) => { event.preventDefault(); setSearched(true); document.getElementById("home-fleet")?.scrollIntoView({ behavior: "smooth" }); }} className="animate-rise-delay mt-8 rounded-card border border-line bg-panel p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="field-label">Pickup city<select value={city} onChange={(e) => setCity(e.target.value)} className="field-input h-9"><option>Delhi NCR</option><option>Mumbai</option><option>Bengaluru</option><option>Pune</option><option>Hyderabad</option></select></label>
            <label className="field-label">Pickup date<input type="date" value={start} min="2026-09-21" onChange={(e) => setStart(e.target.value)} className="field-input" /></label>
            <label className="field-label">Return date<input type="date" value={end} min={start} onChange={(e) => setEnd(e.target.value)} className="field-input" /></label>
            <label className="field-label">Car class<select value={carClass} onChange={(e) => setCarClass(e.target.value)} className="field-input h-9"><option>Any class</option><option>Hatchback</option><option>Sedan</option><option>SUV</option><option>MUV</option></select></label>
          </div>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="font-mono text-[11px] text-muted-foreground">{days || 0} days · rates per day shown · {city}</p><Button type="submit" disabled={days === 0} className="bg-brand px-6 text-brand-ink hover:bg-brand/90">Check availability <ArrowRight /></Button></div>
        </form>
        {searched && <p className="mt-3 text-sm text-ok">3 vehicles match your dates and {carClass.toLowerCase()} preference.</p>}
      </div>
      <div className="lg:col-span-5"><div className="animate-rise-late relative h-full min-h-[380px] overflow-hidden rounded-xl border border-line"><img src={heroImage} alt="Hyundai Creta ready for rental near India Gate at night" width={1024} height={1280} className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-paper to-transparent p-5 pt-24"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand">Featured vehicle</p><div className="mt-1 flex items-end justify-between"><div><p className="font-semibold text-ink">Hyundai Creta</p><p className="text-xs text-muted-foreground">DL01CD5678 · ₹3,200/day</p></div><span className="rounded-full bg-ok/20 px-2 py-1 font-mono text-[10px] text-ok">Available</span></div></div></div><div className="mt-3 flex gap-6 font-mono text-[11px] text-muted-foreground"><span><strong className="text-ink">4</strong> vehicles</span><span><strong className="text-ink">3</strong> available</span><span><strong className="text-ink">24/7</strong> support</span></div></div>
    </section>
    <section id="home-fleet" className="border-t border-line"><div className="mx-auto max-w-7xl px-5 py-12 sm:px-6"><FleetExplorer compact initialStart={start} initialEnd={end} /><div className="mt-6 text-right"><Button asChild variant="link" className="text-brand"><Link to="/fleet">View full fleet <ArrowRight /></Link></Button></div></div></section>
    <section className="border-t border-line"><div className="mx-auto max-w-7xl px-5 py-12 sm:px-6"><p className="eyebrow">(B) How it works</p><div className="mt-7 grid gap-8 sm:grid-cols-3">{[[CalendarRange,"01","Pick your dates","Choose your rental window and see available cars instantly."],[Clock3,"02","Reserve in minutes","Enter your details and confirm without hidden charges."],[MapPin,"03","Drive & return","Collect from Connaught Place and return at the same hub."]].map(([Icon,num,title,copy]) => { const IconComponent = Icon as typeof CalendarRange; return <div key={String(num)} className="border-l border-line pl-5"><IconComponent className="size-5 text-brand" /><span className="mt-4 block font-display text-3xl text-brand">{String(num)}</span><h2 className="mt-2 font-semibold text-ink">{String(title)}</h2><p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">{String(copy)}</p></div>; })}</div></div></section>
  </main>;
}
