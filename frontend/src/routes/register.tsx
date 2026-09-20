import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage(){
  const navigate=useNavigate();
  const [error,setError]=useState("");
  
  async function register(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        setError(result.message || "Failed to register");
        return;
      }
      
      alert("Registration successful! Please sign in.");
      void navigate({to:"/signin"});
    } catch (err) {
      setError("Server error.");
    }
  }
  
  return (
    <main className="grid min-h-[75vh] place-items-center px-5 py-12">
      <div className="w-full max-w-md rounded-card border border-line bg-panel p-6 sm:p-8">
        <h1 className="mt-2 font-display text-3xl text-ink uppercase">Register</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Create a new customer account.</p>
        <form onSubmit={register} className="mt-6 space-y-4">
          <div><label className="field-label">Full Name<Input name="name" required className="field-input mt-1"/></label></div>
          <div><label className="field-label">Email<Input name="email" type="email" required className="field-input mt-1"/></label></div>
          <div><label className="field-label">Phone<Input name="phone" required className="field-input mt-1"/></label></div>
          <div><label className="field-label">Licence Number<Input name="licenceNumber" required className="field-input mt-1"/></label></div>
          <div><label className="field-label">Password<Input name="password" type="password" required className="field-input mt-1"/></label></div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" className="w-full bg-brand text-brand-ink hover:bg-brand/90">Create Account</Button>
        </form>
        <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Already have an account? <Link to="/signin" className="text-brand">Sign in</Link></p>
      </div>
    </main>
  );
}
