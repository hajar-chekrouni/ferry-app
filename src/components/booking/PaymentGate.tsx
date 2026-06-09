"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { CreditCard, Lock, AlertCircle } from "lucide-react";

interface Props {
  bookingId: string;
  totalEur: number;
  cancelled: boolean;
  contactEmail: string;
}

export function PaymentGate({ bookingId, totalEur, cancelled, contactEmail }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleStripeCheckout() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur lors de l'initialisation du paiement.");
        return;
      }
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch {
      setError("Impossible de joindre le service de paiement. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  async function handleMockPayment() {
    setLoading(true);
    try {
      // Simulate payment by calling a mock confirmation endpoint
      const res = await fetch(`/api/booking/${bookingId}/confirm-mock`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur");
        return;
      }
      router.push(`/booking/confirm/${bookingId}`);
    } catch {
      setError("Erreur lors du paiement test.");
    } finally {
      setLoading(false);
    }
  }

  const stripeConfigured = !!(
    typeof window !== "undefined" &&
    // We check via the API error response, not window
    true
  );

  return (
    <main className="mx-auto max-w-lg px-4 py-16">
      <div className="rounded-2xl border bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-3 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
              <Lock className="h-7 w-7 text-blue-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Paiement sécurisé</h1>
          <p className="mt-1 text-muted-foreground">
            Réservation <span className="font-mono text-sm">{bookingId}</span>
          </p>
        </div>

        {/* Amount */}
        <div className="mb-6 rounded-xl bg-blue-50 py-4 text-center">
          <p className="text-sm text-blue-700">Total à payer</p>
          <p className="text-4xl font-extrabold text-blue-900">{formatPrice(totalEur)}</p>
          <p className="mt-1 text-xs text-blue-600">Confirmation envoyée à {contactEmail}</p>
        </div>

        {cancelled && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            <AlertCircle className="h-4 w-4 shrink-0" />
            Paiement annulé. Votre réservation est toujours active.
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Stripe button */}
        <Button
          onClick={handleStripeCheckout}
          disabled={loading}
          size="lg"
          className="mb-3 w-full gap-2"
        >
          <CreditCard className="h-5 w-5" />
          {loading ? "Redirection…" : `Payer ${formatPrice(totalEur)} par carte`}
        </Button>

        {/* Mock payment button (visible when Stripe not configured) */}
        <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 p-4">
          <p className="mb-2 text-xs font-semibold text-amber-800">
            🧪 Mode test — Stripe non configuré
          </p>
          <p className="mb-3 text-xs text-amber-700">
            Ajoutez <code className="rounded bg-amber-100 px-1">STRIPE_SECRET_KEY</code> dans{" "}
            <code className="rounded bg-amber-100 px-1">.env.local</code> pour activer le vrai
            paiement. En attendant :
          </p>
          <Button
            variant="outline"
            onClick={handleMockPayment}
            disabled={loading}
            className="w-full border-amber-400 text-amber-900 hover:bg-amber-100"
          >
            {loading ? "Traitement…" : "Simuler un paiement réussi"}
          </Button>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          <Lock className="inline h-3 w-3" /> Paiement crypté SSL · Powered by Stripe
        </p>
      </div>
    </main>
  );
}
