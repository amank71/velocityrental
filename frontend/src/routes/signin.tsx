import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export const Route = createFileRoute("/signin")({ head: () => ({ meta: [{ title: "Customer Sign in — Velocity Fleet" },{ name: "description", content: "Sign in to view your Velocity Fleet rentals and payment status." },{ property: "og:title", content: "Sign in to Velocity Fleet" },{ property: "og:description", content: "Access bookings and rental details." },{ property: "og:type", content: "website" },{ name: "twitter:card", content: "summary_large_image" }] }), component: SignInPage });
function SignInPage(){
  const navigate=useNavigate();
  const [error,setError]=useState("");
  
  async function login(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email=String(fd.get("email")??"");
    const password=String(fd.get("password")??"");
    
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || "Failed to login");
        return;
      }
      
      sessionStorage.setItem("velocity-token", data.token);
      sessionStorage.setItem("velocity-user", JSON.stringify(data.user));
      sessionStorage.setItem("velocity-signed-in", "true");
      if (data.user.role === "admin") {
        void navigate({to:"/admin"});
      } else {
        void navigate({to:"/bookings"});
      }
    } catch (err) {
      setError("Server error. Make sure backend is running.");
    }
  }return <main className="grid min-h-[75vh] place-items-center px-5 py-12"><div className="w-full max-w-md rounded-card border border-line bg-panel p-6 sm:p-8"><span className="grid size-11 place-items-center rounded-brand bg-brand/15 text-brand"><LockKeyhole className="size-5"/></span><p className="eyebrow mt-6">Portal access</p><h1 className="mt-2 font-display text-4xl text-ink">WELCOME BACK</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Use your registered email and password to log in.</p><form onSubmit={login} className="mt-6 space-y-4"><label className="field-label">Email<Input name="email" type="email" defaultValue="" className="field-input"/></label><label className="field-label">Password<Input name="password" type="password" defaultValue="" className="field-input"/></label>{error&&<p role="alert" className="text-sm text-danger">{error}</p>}<Button className="w-full bg-brand text-brand-ink hover:bg-brand/90">Sign in <ArrowRight/></Button></form>
<p className="mt-5 text-center text-sm text-muted-foreground">Don't have an account? <Link to="/register" className="text-brand hover:underline">Register here</Link></p>
<p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Secure Login Portal</p></div></main>}
