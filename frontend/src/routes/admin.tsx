import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertTriangle, Car, IndianRupee, Users, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/rental-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Fleet Operations - Velocity Fleet" }] }),
  component: AdminPage
});

function AdminPage(){
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addError, setAddError] = useState("");
  const navigate = useNavigate();

  const token = typeof window !== "undefined" ? sessionStorage.getItem("velocity-token") : null;

  function loadData() {
    if (!token) return;
    fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api/admin/stats", { headers: { "Authorization": `Bearer ${token}` }})
      .then(r => r.json()).then(data => setStats(data.stats)).catch(console.error);

    fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api/bookings", { headers: { "Authorization": `Bearer ${token}` }})
      .then(r => r.json()).then(data => setBookings(data.bookings || [])).catch(console.error);

    fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api/vehicles", { headers: { "Authorization": `Bearer ${token}` }})
      .then(r => r.json()).then(data => setVehicles(data.vehicles || [])).catch(console.error);
  }

  useEffect(() => {
    const userStr = sessionStorage.getItem("velocity-user");
    if (!token || !userStr || JSON.parse(userStr).role !== "admin") {
      navigate({ to: "/signin" });
      return;
    }
    loadData();
  }, [navigate]);

  async function handleAddVehicle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAddError("");
    const fd = new FormData(e.currentTarget);
    const data = {
      registrationNumber: fd.get("registrationNumber"),
      make: fd.get("make"),
      model: fd.get("model"),
      vehicleType: fd.get("vehicleType"),
      manufactureYear: Number(fd.get("manufactureYear")),
      seats: Number(fd.get("seats")),
      dailyRate: Number(fd.get("dailyRate")),
      operationalStatus: "available",
      odometerKm: 0
    };

    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const errorData = await res.json();
        setAddError(errorData.message || "Failed to add vehicle.");
        return;
      }
      setIsAddModalOpen(false);
      loadData(); // reload all stats and vehicles
    } catch(err) {
      setAddError("Server error.");
    }
  }

  async function handleDeleteVehicle(vehicleId: number) {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      const res = await fetch(`\${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/vehicles/${vehicleId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) {
        const errData = await res.json();
        alert(errData.message || "Failed to delete vehicle");
        return;
      }
      loadData();
    } catch(err) {
      alert("Server error");
    }
  }

  if (!stats) return null;

  return <main className="mx-auto min-h-[75vh] max-w-7xl px-5 py-10 sm:px-6">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="eyebrow">Operations console</p><h1 className="mt-2 font-display text-5xl text-ink">FLEET CONTROL</h1></div>
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-ok/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ok">All systems operational</span>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-brand text-brand-ink hover:bg-brand/90"><Plus className="mr-2 size-4"/>Add Vehicle</Button>
      </div>
    </div>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[
        [Car, "Total vehicles", stats.totalVehicles || 0],
        [Users, "Live bookings", stats.activeBookings || 0],
        [IndianRupee, "Revenue", formatCurrency(stats.revenue || 0)],
        [AlertTriangle, "In maintenance", stats.maintenanceVehicles || 0]
      ].map(([Icon,label,value])=>{
        const C=Icon as typeof Car;
        return <div key={String(label)} className="rounded-card border border-line bg-panel p-5"><C className="size-5 text-brand"/><p className="mt-5 text-xs text-muted-foreground">{String(label)}</p><p className="mt-1 text-2xl font-semibold text-ink">{String(value)}</p></div>
      })}
    </div>
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <section className="overflow-hidden rounded-card border border-line bg-panel">
        <div className="border-b border-line p-5"><p className="eyebrow">Active & upcoming</p><h2 className="mt-1 text-lg font-semibold text-ink">Booking queue</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"><tr>{["Ref","Customer","Vehicle","Dates","Status","Due"].map(x=><th key={x} className="px-5 py-3 font-medium">{x}</th>)}</tr></thead>
            <tbody>
              {bookings.map(b=><tr key={b.booking_id} className="border-t border-line"><td className="px-5 py-4 font-mono text-xs text-brand">VLC-{1000 + b.booking_id}</td><td className="px-5 py-4 text-ink">{b.customer_name}</td><td className="px-5 py-4 text-muted-foreground">{b.registration_number}</td><td className="px-5 py-4 text-muted-foreground">{b.start_date.split('T')[0]}<br/>{b.end_date.split('T')[0]}</td><td className="px-5 py-4"><span className="text-ok">{b.booking_status}</span></td><td className="px-5 py-4 text-ink">{formatCurrency(b.amount_due)}</td></tr>)}
            </tbody>
          </table>
        </div>
      </section>
      <section className="rounded-card border border-line bg-panel p-5">
        <p className="eyebrow">Fleet status</p><h2 className="mt-1 text-lg font-semibold text-ink">Vehicle readiness</h2>
        <div className="mt-5 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {vehicles.map(v=><div key={v.vehicle_id} className="flex items-center gap-3"><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-ink">{v.make} {v.model}</p><p className="font-mono text-[10px] text-muted-foreground">{v.registration_number} • {formatCurrency(v.daily_rate)}/day</p></div><span className={v.availability_status==="available"?"text-xs text-ok":"text-xs text-brand"}>{v.availability_status}</span><Button variant="ghost" size="sm" onClick={() => handleDeleteVehicle(v.vehicle_id)} className="h-8 w-8 p-0 text-muted-foreground hover:bg-danger/10 hover:text-danger"><Trash2 className="size-4"/></Button></div>)}
        </div>
      </section>
    </div>

    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-card border-line bg-panel text-ink sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl uppercase">Add New Vehicle</DialogTitle>
          <DialogDescription className="text-muted-foreground">Register a new car or bike to your fleet.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddVehicle} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="field-label">Make</label><Input required name="make" placeholder="e.g. Maruti" className="field-input mt-1" /></div>
            <div><label className="field-label">Model</label><Input required name="model" placeholder="e.g. Swift" className="field-input mt-1" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="field-label">Registration No.</label><Input required name="registrationNumber" placeholder="DL-1C-..." className="field-input mt-1" /></div>
            <div><label className="field-label">Type</label><select required name="vehicleType" className="field-input mt-1"><option value="sedan">Sedan</option><option value="suv">SUV</option><option value="hatchback">Hatchback</option><option value="bike">Bike</option><option value="muv">MUV</option></select></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="field-label">Seats</label><Input required name="seats" type="number" defaultValue="4" className="field-input mt-1" /></div>
            <div><label className="field-label">Year</label><Input required name="manufactureYear" type="number" defaultValue="2023" className="field-input mt-1" /></div>
            <div><label className="field-label">Daily Rate (₹)</label><Input required name="dailyRate" type="number" defaultValue="1500" className="field-input mt-1" /></div>
          </div>
          {addError && <p className="text-sm text-danger">{addError}</p>}
          <Button type="submit" className="w-full bg-brand text-brand-ink hover:bg-brand/90">Add to Fleet</Button>
        </form>
      </DialogContent>
    </Dialog>
  </main>
}
