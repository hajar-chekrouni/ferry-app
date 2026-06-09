import { NormalisedSailing, PassengerCounts } from "./types";
import { getAdapter } from "./registry";
import { ROUTES } from "../seed/data";

/**
 * Reconstruct a NormalisedSailing from its opaque ID.
 * ID format: "{routeId}|{date}T{time}" e.g. "balearia-tng-alg|2026-07-15T00:30"
 */
export async function getSailingById(
  sailingId: string,
  passengers: PassengerCounts,
  vehicle?: { category: string; lengthCm?: number }
): Promise<NormalisedSailing | null> {
  const pipeIdx = sailingId.indexOf("|");
  if (pipeIdx === -1) return null;

  const routeId = sailingId.substring(0, pipeIdx);
  const route = ROUTES.find((r) => r.id === routeId);
  if (!route) return null;

  const adapter = getAdapter(route.operatorId);
  if (!adapter) return null;

  // Derive departure port code from the route
  // We need to search on the departure date so the adapter generates this sailing
  const dateStr = sailingId.substring(pipeIdx + 1, pipeIdx + 11); // "YYYY-MM-DD"

  // Import port data to get codes
  const { PORTS } = await import("../seed/data");
  const depPort = PORTS.find((p) => p.id === route.departurePortId);
  const arrPort = PORTS.find((p) => p.id === route.arrivalPortId);
  if (!depPort || !arrPort) return null;

  const sailings = await adapter.searchSailings({
    departurePortCode: depPort.code,
    arrivalPortCode: arrPort.code,
    departureDate: dateStr,
    passengers,
    vehicle: vehicle as { category: "car" | "motorcycle" | "van" | "truck" | "camper"; lengthCm?: number } | undefined,
  });

  return sailings.find((s) => s.id === sailingId) ?? null;
}
