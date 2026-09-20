import { Link } from "@tanstack/react-router";
import { Menu, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/fleet" as const, label: "Fleet" },
  { to: "/bookings" as const, label: "Bookings" },
  { to: "/support" as const, label: "Support" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="Velocity Fleet home">
          <span className="grid size-8 shrink-0 place-items-center rounded-brand bg-brand font-display text-lg text-brand-ink">V</span>
          <span className="font-display text-xl text-ink">VELOCITY</span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:inline">Fleet</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} activeProps={{ className: "text-ink" }} className="transition-colors hover:text-ink">{item.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <Button asChild variant="ghost" className="hidden text-muted-foreground hover:bg-panel hover:text-ink sm:inline-flex">
            <Link to="/admin"><ShieldCheck />Admin</Link>
          </Button>
          <Button asChild variant="outline" className="border-line bg-transparent text-ink hover:border-brand hover:bg-panel hover:text-ink">
            <Link to="/signin">Sign in</Link>
          </Button>
          <Button asChild variant="default" className="bg-brand text-brand-ink hover:bg-brand/90">
            <Link to="/register">Register</Link>
          </Button>
          <details className="relative md:hidden">
            <summary className="grid size-9 cursor-pointer list-none place-items-center rounded-brand border border-line text-ink"><Menu className="size-4" /></summary>
            <div className="absolute right-0 mt-2 w-44 rounded-card border border-line bg-panel p-2 shadow-2xl">
              {navItems.map((item) => <Link key={item.to} to={item.to} className="block rounded-brand px-3 py-2 text-sm text-muted-foreground hover:bg-paper hover:text-ink">{item.label}</Link>)}
              <Link to="/admin" className="block rounded-brand px-3 py-2 text-sm text-muted-foreground hover:bg-paper hover:text-ink">Admin</Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-9 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link to="/" className="flex items-center gap-2.5"><span className="grid size-7 place-items-center rounded-brand bg-brand font-display text-base text-brand-ink">V</span><span className="font-display text-lg text-ink">VELOCITY</span></Link>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link to="/fleet" className="hover:text-ink">Fleet</Link><Link to="/bookings" className="hover:text-ink">Bookings</Link><Link to="/support" className="hover:text-ink">Support</Link><Link to="/admin" className="hover:text-ink">Admin sign-in</Link>
        </div>
        <p className="font-mono text-[11px] text-muted-foreground">© 2026 Velocity Fleet · Delhi NCR</p>
      </div>
    </footer>
  );
}
