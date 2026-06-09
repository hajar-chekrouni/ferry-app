import {
  FerryOperatorAdapter,
  NormalisedSailing,
  PassengerCounts,
  SearchQuery,
  VehicleQuery,
} from "./types";
import {
  PORTS,
  OPERATORS,
  ROUTES,
  BASE_FARES,
  SCHEDULES,
  AMENITIES_BY_SHIP_TYPE,
} from "../seed/data";

type PortId = (typeof PORTS)[number]["id"];
type RouteId = (typeof ROUTES)[number]["id"];

const portMap = Object.fromEntries(PORTS.map((p) => [p.id, p])) as Record<
  PortId,
  (typeof PORTS)[number]
>;
const portByCode = Object.fromEntries(PORTS.map((p) => [p.code, p])) as Record<
  string,
  (typeof PORTS)[number]
>;

function seededRand(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/** Deterministic ±20% price variation based on date + sailing id */
function priceVariation(basePrice: number, sailingId: string, date: string): number {
  const seed =
    sailingId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) +
    date.replace(/-/g, "").split("").reduce((acc, c) => acc + Number(c), 0);
  const factor = 0.85 + seededRand(seed) * 0.35; // 0.85 - 1.20
  return Math.round(basePrice * factor);
}

/** Deterministic availability based on date + sailing id */
function availableSeats(sailingId: string, date: string): number {
  const seed =
    sailingId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) +
    parseInt(date.replace(/-/g, ""), 10);
  const base = Math.floor(seededRand(seed * 7) * 200);
  return Math.max(0, base);
}

function buildSailingId(routeId: string, date: string, time: string): string {
  return `${routeId}|${date}T${time}`;
}

function computeTotalPrice(
  routeId: RouteId,
  date: string,
  time: string,
  passengers: PassengerCounts,
  vehicle?: VehicleQuery
): { total: number; fares: NormalisedSailing["fares"] } {
  const base = BASE_FARES[routeId];
  const sid = buildSailingId(routeId, date, time);

  const adultPrice = priceVariation(base.adult, sid, date);
  const childPrice = priceVariation(base.child, sid, date);
  const infantPrice = priceVariation(base.infant, sid, date);

  const fareItems: NormalisedSailing["fares"] = [];

  if (passengers.adults > 0) {
    fareItems.push({
      label: `Adulte × ${passengers.adults}`,
      type: "passenger",
      priceEur: adultPrice * passengers.adults,
      refundable: false,
      flexible: false,
    });
  }
  if ((passengers.children ?? 0) > 0) {
    fareItems.push({
      label: `Enfant (4-11 ans) × ${passengers.children}`,
      type: "passenger",
      priceEur: childPrice * (passengers.children ?? 0),
      refundable: false,
      flexible: false,
    });
  }
  if ((passengers.infants ?? 0) > 0) {
    fareItems.push({
      label: `Bébé (< 4 ans) × ${passengers.infants}`,
      type: "passenger",
      priceEur: infantPrice * (passengers.infants ?? 0),
      refundable: false,
      flexible: false,
    });
  }
  if (vehicle && base.vehicle > 0) {
    const vehiclePrice = priceVariation(base.vehicle, sid + "v", date);
    fareItems.push({
      label: "Véhicule",
      type: "vehicle",
      priceEur: vehiclePrice,
      refundable: false,
      flexible: false,
    });
  }

  const total = fareItems.reduce((s, f) => s + f.priceEur, 0);
  return { total, fares: fareItems };
}

export class MockOperatorAdapter implements FerryOperatorAdapter {
  constructor(public readonly operatorId: string) {}

  async searchSailings(query: SearchQuery): Promise<NormalisedSailing[]> {
    const depPort = portByCode[query.departurePortCode];
    const arrPort = portByCode[query.arrivalPortCode];
    if (!depPort || !arrPort) return [];

    const matchingRoutes = ROUTES.filter(
      (r) =>
        r.operatorId === this.operatorId &&
        r.departurePortId === depPort.id &&
        r.arrivalPortId === arrPort.id
    );

    const operator = OPERATORS.find((o) => o.id === this.operatorId);
    if (!operator) return [];

    const results: NormalisedSailing[] = [];

    for (const route of matchingRoutes) {
      const times = SCHEDULES[route.id as RouteId];
      if (!times) continue;

      for (const time of times) {
        const [h, m] = time.split(":").map(Number);
        const depDate = new Date(`${query.departureDate}T${time}:00`);
        const arrDate = new Date(
          depDate.getTime() + route.durationMinutes * 60_000
        );

        const sailingId = buildSailingId(route.id, query.departureDate, time);
        const seats = availableSeats(route.id, query.departureDate);
        if (seats === 0) continue;

        const { total, fares } = computeTotalPrice(
          route.id as RouteId,
          query.departureDate,
          time,
          query.passengers,
          query.vehicle
        );

        results.push({
          id: sailingId,
          operatorId: operator.id,
          operatorName: operator.name,
          operatorLogoUrl: operator.logoUrl,
          departurePort: {
            code: depPort.code,
            name: depPort.name,
            city: depPort.city,
            countryCode: depPort.countryCode,
          },
          arrivalPort: {
            code: arrPort.code,
            name: arrPort.name,
            city: arrPort.city,
            countryCode: arrPort.countryCode,
          },
          departureAt: depDate.toISOString(),
          arrivalAt: arrDate.toISOString(),
          durationMinutes: route.durationMinutes,
          shipType: route.shipType,
          availableSeats: seats,
          basePriceEur: BASE_FARES[route.id as RouteId].adult,
          totalPriceEur: total,
          fares,
          amenities: AMENITIES_BY_SHIP_TYPE[route.shipType] ?? [],
        });
      }
    }

    return results;
  }

  async getPricing(
    sailingId: string,
    passengers: PassengerCounts,
    vehicle?: VehicleQuery
  ) {
    const [routeId, dateTime] = sailingId.split("|");
    if (!routeId || !dateTime) return null;
    const [date, time] = [dateTime.substring(0, 10), dateTime.substring(11, 16)];

    const route = ROUTES.find((r) => r.id === routeId);
    if (!route || route.operatorId !== this.operatorId) return null;

    const base = BASE_FARES[routeId as RouteId];
    const sid = sailingId;

    const adultPrice = priceVariation(base.adult, sid, date);
    const childPrice = priceVariation(base.child, sid, date);
    const infantPrice = priceVariation(base.infant, sid, date);

    const breakdown: { label: string; unitPrice: number; qty: number; total: number }[] = [];

    if (passengers.adults > 0)
      breakdown.push({ label: "Adulte", unitPrice: adultPrice, qty: passengers.adults, total: adultPrice * passengers.adults });
    if ((passengers.children ?? 0) > 0)
      breakdown.push({ label: "Enfant", unitPrice: childPrice, qty: passengers.children ?? 0, total: childPrice * (passengers.children ?? 0) });
    if ((passengers.infants ?? 0) > 0)
      breakdown.push({ label: "Bébé", unitPrice: infantPrice, qty: passengers.infants ?? 0, total: infantPrice * (passengers.infants ?? 0) });
    if (vehicle && base.vehicle > 0) {
      const vp = priceVariation(base.vehicle, sid + "v", date);
      breakdown.push({ label: "Véhicule", unitPrice: vp, qty: 1, total: vp });
    }

    const totalEur = breakdown.reduce((s, b) => s + b.total, 0);
    const expiresAt = new Date(Date.now() + 15 * 60_000).toISOString();

    return { totalEur, breakdown, expiresAt };
  }

  async checkAvailability(
    sailingId: string,
    passengers: PassengerCounts,
    _vehicle?: VehicleQuery
  ) {
    const [routeId, dateTime] = sailingId.split("|");
    const date = dateTime?.substring(0, 10) ?? "";
    const remaining = availableSeats(routeId ?? "", date);
    const needed = passengers.adults + (passengers.children ?? 0);
    return { available: remaining >= needed, remainingSeats: remaining };
  }

  async book(params: {
    sailingId: string;
    passengers: PassengerCounts;
    vehicle?: VehicleQuery;
    contactEmail: string;
    internalRef: string;
  }) {
    // Mock: always succeeds
    return {
      operatorRef: `MOCK-${params.internalRef.toUpperCase()}-${Date.now()}`,
    };
  }

  async cancel(_operatorRef: string) {
    return { success: true, refundEur: 0 };
  }
}
