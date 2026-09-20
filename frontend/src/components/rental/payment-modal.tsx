import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, ShieldCheck, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/rental-data";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  onSuccess: () => void;
}

export function PaymentModal({ open, onOpenChange, amount, onSuccess }: PaymentModalProps) {
  const [step, setStep] = useState<"card" | "processing" | "success">("card");

  // Reset state when opened
  useEffect(() => {
    if (open) setStep("card");
  }, [open]);

  const handlePay = () => {
    setStep("processing");
    setTimeout(() => {
      setStep("success");
      setTimeout(() => {
        onSuccess();
        onOpenChange(false);
      }, 2000);
    }, 2500);
  };

  return (
    <Dialog open={open} onOpenChange={step === "processing" ? undefined : onOpenChange}>
      <DialogContent className="max-w-md rounded-card border-line bg-panel text-ink sm:max-w-md">
        {step === "card" && (
          <>
            <DialogHeader className="mb-4 text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <DialogTitle className="font-display text-2xl">Secure Checkout</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Total Amount to Pay: <strong className="text-ink">{formatCurrency(amount)}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="rounded-lg border border-line bg-paper p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium">Credit / Debit Card</span>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Card Number (Dummy)"
                    className="w-full rounded-md border border-line bg-panel px-3 py-2 text-sm text-ink placeholder:text-muted-foreground focus:border-brand focus:outline-none"
                    defaultValue="4111 1111 1111 1111"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full rounded-md border border-line bg-panel px-3 py-2 text-sm text-ink placeholder:text-muted-foreground focus:border-brand focus:outline-none"
                      defaultValue="12/28"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      className="w-full rounded-md border border-line bg-panel px-3 py-2 text-sm text-ink placeholder:text-muted-foreground focus:border-brand focus:outline-none"
                      defaultValue="123"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Name on Card"
                    className="w-full rounded-md border border-line bg-panel px-3 py-2 text-sm text-ink placeholder:text-muted-foreground focus:border-brand focus:outline-none"
                    defaultValue="Velocity User"
                  />
                </div>
              </div>

              <Button onClick={handlePay} className="w-full bg-brand text-brand-ink hover:bg-brand/90">
                Pay {formatCurrency(amount)}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Secured by MockPay ? Test Environment
              </p>
            </div>
          </>
        )}

        {step === "processing" && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-brand" />
            <h3 className="text-lg font-semibold text-ink">Processing Payment...</h3>
            <p className="text-sm text-muted-foreground">Please do not close this window.</p>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ok/15 text-ok">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-display text-ink">Payment Successful!</h3>
            <p className="mt-2 text-sm text-muted-foreground">Redirecting to confirmation...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

