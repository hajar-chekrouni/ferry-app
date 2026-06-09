"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightLeft, Search, RotateCcw } from "lucide-react";
import { PortCombobox } from "./PortCombobox";
import { PassengerSelector, PassengerCounts } from "./PassengerSelector";
import { VehicleSelector, VehicleState } from "./VehicleSelector";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  compact?: boolean;
  initialValues?: {
    from?: string;
    to?: string;
    date?: string;
    returnDate?: string;
    adults?: number;
    children?: number;
    infants?: number;
    vehicleCategory?: string;
    vehicleLengthCm?: number;
  };
}

function today(): string {
  return new Date().toISOString().substring(0, 10);
}

function nextWeek(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().substring(0, 10);
}

export function SearchWidget({ compact = false, initialValues }: Props) {
  const router = useRouter();

  const [from, setFrom] = useState(initialValues?.from ?? "");
  const [to, setTo] = useState(initialValues?.to ?? "");
  const [date, setDate] = useState(initialValues?.date ?? today());
  const [isReturn, setIsReturn] = useState(!!initialValues?.returnDate);
  const [returnDate, setReturnDate] = useState(initialValues?.returnDate ?? "");
  const [passengers, setPassengers] = useState<PassengerCounts>({
    adults: initialValues?.adults ?? 1,
    children: initialValues?.children ?? 0,
    infants: initialValues?.infants ?? 0,
  });
  const [vehicle, setVehicle] = useState<VehicleState>({
    enabled: !!initialValues?.vehicleCategory,
    category: initialValues?.vehicleCategory ?? "car",
    lengthCm: initialValues?.vehicleLengthCm ?? 380,
  });
  const [error, setError] = useState("");

  function swapPorts() {
    setFrom(to);
    setTo(from);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!from) { setError("Sélectionnez un port de départ."); return; }
    if (!to) { setError("Sélectionnez un port d'arrivée."); return; }
    if (!date) { setError("Choisissez une date de départ."); return; }
    if (isReturn && returnDate && returnDate < date) {
      setError("La date de retour doit être après la date d'aller.");
      return;
    }
    setError("");

    const params = new URLSearchParams({
      from,
      to,
      date,
      adults: String(passengers.adults),
      children: String(passengers.children),
      infants: String(passengers.infants),
    });
    if (isReturn && returnDate) params.set("returnDate", returnDate);
    if (vehicle.enabled) {
      params.set("vehicleCategory", vehicle.category);
      params.set("vehicleLengthCm", String(vehicle.lengthCm));
    }

    router.push(`/search?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "rounded-2xl bg-white shadow-lg",
        compact ? "p-4" : "p-6"
      )}
    >
      {/* Trip type toggle */}
      {!compact && (
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setIsReturn(false)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              !isReturn
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            )}
          >
            Aller simple
          </button>
          <button
            type="button"
            onClick={() => {
              setIsReturn(true);
              if (!returnDate) setReturnDate(nextWeek());
            }}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              isReturn
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            )}
          >
            Aller-retour
          </button>
        </div>
      )}

      {/* Ports row */}
      <div className="flex items-stretch gap-2">
        <PortCombobox
          value={from}
          onChange={setFrom}
          placeholder="Port de départ"
          exclude={to}
          className="flex-1"
        />
        <button
          type="button"
          onClick={swapPorts}
          className="mt-0 flex h-12 w-10 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground hover:bg-accent"
          aria-label="Inverser les ports"
        >
          <ArrowRightLeft className="h-4 w-4" />
        </button>
        <PortCombobox
          value={to}
          onChange={setTo}
          placeholder="Port d'arrivée"
          exclude={from}
          className="flex-1"
        />
      </div>

      {/* Dates row */}
      <div className={cn("mt-3 grid gap-3", isReturn ? "grid-cols-2" : "grid-cols-1")}>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Départ
          </label>
          <input
            type="date"
            value={date}
            min={today()}
            onChange={(e) => setDate(e.target.value)}
            className="h-12 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        {isReturn && (
          <div>
            <label className="mb-1 flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Retour</span>
              <button
                type="button"
                onClick={() => setIsReturn(false)}
                className="text-xs text-destructive hover:underline"
              >
                Supprimer
              </button>
            </label>
            <input
              type="date"
              value={returnDate}
              min={date || today()}
              onChange={(e) => setReturnDate(e.target.value)}
              className="h-12 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        )}
      </div>

      {/* Passengers */}
      <div className="mt-3">
        <label className="mb-1 block text-xs font-medium text-muted-foreground">
          Passagers
        </label>
        <PassengerSelector value={passengers} onChange={setPassengers} />
      </div>

      {/* Vehicle */}
      {!compact && (
        <div className="mt-3">
          <VehicleSelector value={vehicle} onChange={setVehicle} />
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}

      <Button
        type="submit"
        size="lg"
        className={cn("mt-4 w-full gap-2", compact ? "h-10" : "h-12")}
      >
        <Search className="h-4 w-4" />
        Rechercher
      </Button>
    </form>
  );
}
