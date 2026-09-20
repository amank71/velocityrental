import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, CreditCard, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/rental-data";
import { toast } from "sonner";


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
    const invoiceHTML = `
      <html>
        <head>
          <title>Invoice - ${b.booking_id}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #111; }
            h1 { color: #facc15; }
            .details { margin-top: 20px; line-height: 1.6; }
            .line { border-bottom: 1px solid #ddd; margin: 20px 0; }
          </style>
        </head>
        <body>
          <h1>Velocity Fleet</h1>
          <h2>Booking Invoice #${b.booking_id}</h2>
          <div class="line"></div>
          <div class="details">
            <p><strong>Customer:</strong> ${user.name}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Vehicle:</strong> ${b.make} ${b.model} (${b.registration_number})</p>
            <p><strong>Rental Period:</strong> ${new Date(b.start_date).toLocaleDateString()} to ${new Date(b.end_date).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${b.booking_status.toUpperCase()}</p>
          </div>
          <div class="line"></div>
          <div class="details">
            <h3>Payment Summary</h3>
            <p><strong>Total Amount:</strong> Rs. ${b.total_amount}</p>
            <p><strong>Tax (18% included):</strong> Rs. ${(b.total_amount * 0.18).toFixed(2)}</p>
          </div>
          <div class="line"></div>
          <p style="color: #666; font-size: 14px;">Thank you for choosing Velocity Fleet!</p>
          <script>
            window.onload = () => { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(invoiceHTML);
      printWindow.document.close();
    }
    toast.success("Invoice generated!");
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
