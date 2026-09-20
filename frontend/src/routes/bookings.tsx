import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, CreditCard, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/rental-data";
import { toast } from "sonner";
import jsPDF from "jspdf";

export const Route = createFileRoute("/bookings")({
  head: () => ({ meta: [{ title: "My Bookings - Velocity Fleet" }] }),
  component: BookingsPage
});

function BookingsPage(){
  const [bookings, setBookings] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("velocity-token");
    const userStr = sessionStorage.getItem("velocity-user");
    if (!token || !userStr) {
      navigate({ to: "/signin" });
      return;
    }
    setUser(JSON.parse(userStr));

    fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api/bookings", {
      headers: { "Authorization": `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(data => setBookings(data.bookings || []))
    .catch(console.error);
  }, [navigate]);

  const generateInvoice = (b: any) => {
    
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Velocity Fleet - Invoice", 20, 20);
    doc.setFontSize(12);
    doc.text(`Invoice ID: #INV-00${b.booking_id}`, 20, 35);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 42);
    doc.text(`Customer Name: ${user.name}`, 20, 49);
    doc.line(20, 55, 190, 55);
    doc.setFontSize(16);
    doc.text("Booking Details", 20, 65);
    doc.setFontSize(12);
    doc.text(`Vehicle: ${b.make} ${b.model} (${b.registration_number})`, 20, 75);
    doc.text(`Pickup Date: ${new Date(b.start_date).toLocaleDateString()}`, 20, 82);
    doc.text(`Return Date: ${new Date(b.end_date).toLocaleDateString()}`, 20, 89);
    doc.text(`Status: ${b.booking_status.toUpperCase()}`, 20, 96);
    doc.line(20, 105, 190, 105);
    doc.setFontSize(16);
    doc.text("Payment Summary", 20, 115);
    doc.setFontSize(12);
    doc.text(`Total Amount: Rs. ${b.total_amount}`, 20, 125);
    doc.text(`Tax (18% included): Rs. ${(b.total_amount * 0.18).toFixed(2)}`, 20, 132);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Thank you for choosing Velocity Fleet!", 20, 150);
    doc.save(`velocity_invoice_${b.booking_id}.pdf`);
    toast.success("Invoice PDF Downloaded!");
  };

  if (!user) return null;

  return (
    <main className="mx-auto min-h-[75vh] max-w-5xl px-5 py-12 sm:px-6">
      <p className="eyebrow">Customer desk</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl text-ink">MY BOOKINGS</h1>
          <p className="mt-2 text-muted-foreground">Signed in as {user.name}</p>
        </div>
        <Button asChild className="bg-brand text-brand-ink hover:bg-brand/90">
          <Link to="/fleet">Book another car <ArrowRight /></Link>
        </Button>
      </div>
      <div className="mt-9 space-y-4">
        {bookings.length === 0 && <p className="text-muted-foreground">You have no active bookings.</p>}
        {bookings.map((b) => (
          <article key={b.booking_id} className="rounded-card border border-line bg-panel p-5">
            <div className="flex flex-col justify-between gap-5 sm:flex-row">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs text-brand">VLC-{1000 + b.booking_id}</span>
                  <span className="rounded-full bg-ok/15 px-2 py-1 font-mono text-[10px] uppercase text-ok">{b.booking_status}</span>
                </div>
                <h2 className="mt-3 text-xl font-semibold text-ink">{b.vehicle_name || "Vehicle"}</h2>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{b.registration_number}</p>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2"><CalendarDays className="size-4 text-brand" />{b.start_date.split('T')[0]} - {b.end_date.split('T')[0]}</span>
                  <span className="flex items-center gap-2"><MapPin className="size-4 text-brand" />Connaught Place</span>
                  <span className="flex items-center gap-2"><CreditCard className="size-4 text-brand" />{b.payment_status}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Booking total</p>
                <p className="mt-1 text-2xl font-semibold text-ink">{formatCurrency(b.total_amount)}</p>
                <p className="mt-1 text-xs text-muted-foreground">Paid {formatCurrency(b.amount_paid)}</p>
                <Button variant="outline" className="mt-4 border-line bg-brand/10 text-brand hover:bg-brand hover:text-brand-ink" onClick={() => generateInvoice(b)}>
                  <CreditCard className="mr-2 size-4" /> Download Invoice
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
