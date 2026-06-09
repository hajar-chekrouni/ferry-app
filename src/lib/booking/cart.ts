import { NormalisedSailing } from "../operators/types";
import { BookingOptions, PassengerForm, VehicleForm } from "./types";

export interface PriceLineItem {
  label: string;
  amount: number;
  category: "passenger" | "vehicle" | "accommodation" | "extra";
}

export interface CartTotal {
  lines: PriceLineItem[];
  subtotal: number;
  total: number;
}

// Option surcharges (flat per booking)
const OPTION_PRICES = {
  interior_cabin: 45,
  exterior_cabin: 75,
  pet: 30, // per animal
  meal: 15, // per person
  flexible_surcharge: 0.20, // +20% on passenger fares
} as const;

export function computeCart(
  outbound: NormalisedSailing,
  inbound: NormalisedSailing | undefined,
  passengers: PassengerForm[],
  vehicle: VehicleForm | undefined,
  options: BookingOptions
): CartTotal {
  const lines: PriceLineItem[] = [];

  // ── Passenger fares from sailing ─────────────────────────────────────────
  for (const fare of outbound.fares) {
    if (fare.type === "passenger") {
      lines.push({
        label: `Aller — ${fare.label}`,
        amount: fare.priceEur,
        category: "passenger",
      });
    }
  }
  if (inbound) {
    for (const fare of inbound.fares) {
      if (fare.type === "passenger") {
        lines.push({
          label: `Retour — ${fare.label}`,
          amount: fare.priceEur,
          category: "passenger",
        });
      }
    }
  }

  // ── Vehicle fare ─────────────────────────────────────────────────────────
  if (vehicle) {
    const outVehicleFare = outbound.fares.find((f) => f.type === "vehicle");
    if (outVehicleFare) {
      lines.push({
        label: `Aller — Véhicule`,
        amount: outVehicleFare.priceEur,
        category: "vehicle",
      });
    }
    if (inbound) {
      const inVehicleFare = inbound.fares.find((f) => f.type === "vehicle");
      if (inVehicleFare) {
        lines.push({
          label: `Retour — Véhicule`,
          amount: inVehicleFare.priceEur,
          category: "vehicle",
        });
      }
    }
  }

  // ── Accommodation ─────────────────────────────────────────────────────────
  if (options.accommodationType && options.accommodationType !== "seat") {
    const price = OPTION_PRICES[options.accommodationType];
    const legs = inbound ? 2 : 1;
    lines.push({
      label:
        options.accommodationType === "interior_cabin"
          ? `Cabine intérieure × ${legs} trajet${legs > 1 ? "s" : ""}`
          : `Cabine extérieure × ${legs} trajet${legs > 1 ? "s" : ""}`,
      amount: price * legs,
      category: "accommodation",
    });
  }

  // ── Pets ─────────────────────────────────────────────────────────────────
  if (options.hasPet && options.petCount > 0) {
    const legs = inbound ? 2 : 1;
    lines.push({
      label: `Animal de compagnie × ${options.petCount} × ${legs} trajet${legs > 1 ? "s" : ""}`,
      amount: OPTION_PRICES.pet * options.petCount * legs,
      category: "extra",
    });
  }

  // ── Meals ─────────────────────────────────────────────────────────────────
  if (options.hasMeal && options.mealCount > 0) {
    const legs = inbound ? 2 : 1;
    lines.push({
      label: `Repas × ${options.mealCount} × ${legs} trajet${legs > 1 ? "s" : ""}`,
      amount: OPTION_PRICES.meal * options.mealCount * legs,
      category: "extra",
    });
  }

  // ── Flexible ticket surcharge (+20% on passenger lines) ──────────────────
  if (options.isFlexible) {
    const passengerTotal = lines
      .filter((l) => l.category === "passenger")
      .reduce((s, l) => s + l.amount, 0);
    const surcharge = Math.round(passengerTotal * OPTION_PRICES.flexible_surcharge);
    lines.push({
      label: "Billet flexible (+20%)",
      amount: surcharge,
      category: "extra",
    });
  }

  const total = lines.reduce((s, l) => s + l.amount, 0);

  return { lines, subtotal: total, total };
}

export function passengerLabel(type: PassengerForm["type"]): string {
  return type === "adult" ? "Adulte" : type === "child" ? "Enfant" : "Bébé";
}
