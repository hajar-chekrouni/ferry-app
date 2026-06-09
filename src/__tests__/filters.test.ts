import { describe, it, expect } from "vitest";
import { applyFilters, defaultFilters } from "@/lib/search/filters";
import type { NormalisedSailing } from "@/lib/operators/types";

function makeSailing(overrides: Partial<NormalisedSailing> = {}): NormalisedSailing {
  return {
    id: "test|2026-07-15T09:00",
    operatorId: "balearia",
    operatorName: "Baleàría",
    operatorLogoUrl: null,
    departurePort: { code: "TNG", name: "Tanger Med", city: "Tanger", countryCode: "MA" },
    arrivalPort: { code: "ALG", name: "Algésiras", city: "Algésiras", countryCode: "ES" },
    departureAt: "2026-07-15T09:00:00Z",
    arrivalAt: "2026-07-15T10:30:00Z",
    durationMinutes: 90,
    shipType: "grande_vitesse",
    availableSeats: 50,
    basePriceEur: 50,
    totalPriceEur: 50,
    fares: [],
    amenities: [],
    ...overrides,
  };
}

describe("applyFilters", () => {
  it("returns all sailings when default filters applied", () => {
    const sailings = [makeSailing(), makeSailing({ id: "test2|2026-07-15T14:00", totalPriceEur: 100 })];
    expect(applyFilters(sailings, defaultFilters())).toHaveLength(2);
  });

  it("filters by maxPriceEur", () => {
    const sailings = [
      makeSailing({ totalPriceEur: 40 }),
      makeSailing({ totalPriceEur: 80 }),
      makeSailing({ totalPriceEur: 120 }),
    ];
    const filtered = applyFilters(sailings, { ...defaultFilters(), maxPriceEur: 80 });
    expect(filtered).toHaveLength(2);
    filtered.forEach((s) => expect(s.totalPriceEur).toBeLessThanOrEqual(80));
  });

  it("filters by operator ids", () => {
    const sailings = [
      makeSailing({ operatorId: "balearia" }),
      makeSailing({ operatorId: "frs" }),
      makeSailing({ operatorId: "aml" }),
    ];
    const filtered = applyFilters(sailings, {
      ...defaultFilters(),
      operators: ["balearia", "frs"],
    });
    expect(filtered).toHaveLength(2);
    expect(filtered.map((s) => s.operatorId)).toContain("balearia");
    expect(filtered.map((s) => s.operatorId)).toContain("frs");
  });

  it("filters by minDepartureHour (morning only = 0-11)", () => {
    const sailings = [
      makeSailing({ departureAt: "2026-07-15T07:00:00Z" }),
      makeSailing({ departureAt: "2026-07-15T13:00:00Z" }),
      makeSailing({ departureAt: "2026-07-15T20:00:00Z" }),
    ];
    const filtered = applyFilters(sailings, {
      ...defaultFilters(),
      minDepartureHour: 0,
      maxDepartureHour: 11,
    });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].departureAt).toContain("07:00");
  });

  it("filters by maxDurationMinutes", () => {
    const sailings = [
      makeSailing({ durationMinutes: 60 }),
      makeSailing({ durationMinutes: 120 }),
      makeSailing({ durationMinutes: 180 }),
    ];
    const filtered = applyFilters(sailings, { ...defaultFilters(), maxDurationMinutes: 120 });
    expect(filtered).toHaveLength(2);
  });

  it("returns empty when no sailings match price filter", () => {
    const sailings = [makeSailing({ totalPriceEur: 500 })];
    const filtered = applyFilters(sailings, { ...defaultFilters(), maxPriceEur: 100 });
    expect(filtered).toHaveLength(0);
  });

  it("operators: empty array means no operator filter applied", () => {
    const sailings = [
      makeSailing({ operatorId: "balearia" }),
      makeSailing({ operatorId: "frs" }),
    ];
    const filtered = applyFilters(sailings, { ...defaultFilters(), operators: [] });
    expect(filtered).toHaveLength(2);
  });
});
