"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

interface Props {
  bookingId: string;
  status: "confirmed" | "pending_payment";
}

export function CancelButton({ bookingId, status }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleCancel() {
    setLoading(true); setError("");
    try {
      const res = await fetch(`/api/booking/${bookingId}/cancel`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Erreur"); return; }
      router.refresh();
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  }

  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
      <div className="flex items-start gap-3">
        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
        <div className="flex-1">
          <p className="font-semibold text-red-800">Annuler cette réservation</p>
          <p className="mt-1 text-sm text-red-700">
            {status === "confirmed"
              ? "Un remboursement partiel peut s'appliquer selon les conditions tarifaires."
              : "Aucun montant n'a été débité — l'annulation est gratuite."}
          </p>

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

          {!showConfirm ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowConfirm(true)}
              className="mt-3"
            >
              Annuler la réservation
            </Button>
          ) : (
            <div className="mt-3 flex items-center gap-3">
              <p className="text-sm font-medium text-red-800">Confirmer l&apos;annulation ?</p>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleCancel}
                disabled={loading}
              >
                {loading ? "Annulation…" : "Confirmer"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfirm(false)}
                disabled={loading}
              >
                Non
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
