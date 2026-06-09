import { describe, it, expect } from "vitest";
import { computeCart } from "@/lib/booking/cart";
import type { NormalisedSailing } from "@/lib/operators/types";
import type { PassengerForm, VehicleForm, BookingOptions } from "@/lib/booking/types";

function makeSailing(fareOverrides?: { adult?: number; child?: number; vehicle?: number }): NormalisedSailing {
  const fares = [];
  if (fareOverrides?.adult !== undefined) {
    fares.push({ label: "Adulte", type: "passenger" as const, priceEur: fareOverrides.adult, refundable: false, flexible: false });
  }
  if (fareOverrides?.child !== undefined) {
    fares.push({ label: "Enfant", type: "passenger" as const, priceEur: fareOverrides.child, refundable: false, flexible: false });
  }
  if (fareOverrides?.vehicle !== undefined) {
    fares.push({ label: "Véhicule", type: "vehicle" as const, priceEur: fareOverrides.vehicle, refundable: false, flexible: false });
  }
  return {
    id: "balearia-tng-alg|2026-07-15T09:00",
    operatorId: "balearia",
    operatorName: "Baleàría",
    operatorLogoUrl: null,
    departurePort: { code: "TNG", name: "Tanger Med", city: "Tanger", countryCode: "MA" },
    arrivalPort: { code: "ALG", name: "Algésiras", city: "Algésiras", countryCode: "ES" },
    departureAt: "2026-07-15T09:00:00Z",
    arrivalAt: "2026-07-15T10:30:00Z",
    durationMinutes: 90,
    shipType: "grande_vitesse",
    availableSeats: 120,
    basePriceEur: fareOverrides?.adult ?? 0,
    totalPriceEur: fareOverrides?.adult ?? 0,
    fares,
    amenities: [],
  };
}

const adultPassenger: PassengerForm = {
  firstName: "Alice", lastName: "Doe", type: "adult",
  dateOfBirth: "1990-01-01", nationality: "FR",
  documentType: "passport", documentNumber: "AB123456",
};

const defaultOptions: BookingOptions = {
  accommodationType: "seat",
  hasPet: false, petCount: 0,
  hasMeal: false, mealCount: 0,
  isFlexible: false,
};

describe("computeCart", () => {
  it("sums passenger fares for one adult one-way", () => {
    const cart = computeCart(makeSailing({ adult: 50 }), undefined, [adultPassenger], undefined, defaultOptions);
    expect(cart.total).toBe(50);
    expect(cart.lines).toHaveLength(1);
    expect(cart.lines[0].category).toBe("passenger");
  });

  it("includes vehicle fare when vehicle provided", () => {
    const vehicle: VehicleForm = {
      plate: "1234-AB", category: "car", lengthCm: 430, brand: "Renault", model: "Clio",
    };
    const cart = computeCart(makeSailing({ adult: 50, vehicle: 80 }), undefined, [adultPassenger], vehicle, defaultOptions);
    expect(cart.total).toBe(130); // 50 passenger + 80 vehicle
  });

  it("doubles accommodation for round-trip", () => {
    const opts: BookingOptions = { ...defaultOptions, accommodationType: "interior_cabin" };
    const cart = computeCart(makeSailing({ adult: 50 }), makeSailing({ adult: 50 }), [adultPassenger], undefined, opts);
    // 50 + 50 (passenger both legs) + 45*2 (cabin both legs)
    expect(cart.total).toBe(190);
  });

  it("applies flexible surcharge (+20%) on passenger fares", () => {
    const opts: BookingOptions = { ...defaultOptions, isFlexible: true };
    const cart = computeCart(makeSailing({ adult: 50 }), undefined, [adultPassenger], undefined, opts);
    // 50 passenger + round(50 * 0.20) = 50 + 10 = 60
    expect(cart.total).toBe(60);
  });

  it("counts pet fees per leg and per animal", () => {
    const opts: BookingOptions = { ...defaultOptions, hasPet: true, petCount: 2 };
    // one-way: 30 * 2 * 1 = 60
    const cart = computeCart(makeSailing({ adult: 50 }), undefined, [adultPassenger], undefined, opts);
    expect(cart.total).toBe(50 + 60);
  });

  it("counts meal fees per leg and per meal", () => {
    const opts: BookingOptions = { ...defaultOptions, hasMeal: true, mealCount: 3 };
    // one-way: 15 * 3 * 1 = 45
    const cart = computeCart(makeSailing({ adult: 50 }), undefined, [adultPassenger], undefined, opts);
    expect(cart.total).toBe(50 + 45);
  });

  it("returns empty lines for sailing with no passenger fares", () => {
    const cart = computeCart(makeSailing(), undefined, [adultPassenger], undefined, defaultOptions);
    expect(cart.total).toBe(0);
    expect(cart.lines).toHaveLength(0);
  });

  it("does not include vehicle fare if no vehicle passed", () => {
    const cart = computeCart(makeSailing({ adult: 50, vehicle: 80 }), undefined, [adultPassenger], undefined, defaultOptions);
    expect(cart.total).toBe(50);
    const vehicleLines = cart.lines.filter((l) => l.category === "vehicle");
    expect(vehicleLines).toHaveLength(0);
  });
});
