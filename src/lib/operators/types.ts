import { z } from "zod";

// ─── Shared domain types ──────────────────────────────────────────────────────

export const PassengerCountsSchema = z.object({
  adults: z.number().int().min(1).max(9),
  children: z.number().int().min(0).max(9).default(0),
  infants: z.number().int().min(0).max(4).default(0),
});
export type PassengerCounts = z.infer<typeof PassengerCountsSchema>;

export const VehicleQuerySchema = z.object({
  category: z.enum(["car", "motorcycle", "van", "truck", "camper"]),
  lengthCm: z.number().int().min(100).max(2000).optional(),
  heightCm: z.number().int().min(100).max(500).optional(),
});
export type VehicleQuery = z.infer<typeof VehicleQuerySchema>;

export const SearchQuerySchema = z.object({
  departurePortCode: z.string().length(3),
  arrivalPortCode: z.string().length(3),
  departureDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  returnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  passengers: PassengerCountsSchema,
  vehicle: VehicleQuerySchema.optional(),
});
export type SearchQuery = z.infer<typeof SearchQuerySchema>;

// ─── Normalised sailing result returned by every adapter ─────────────────────

export interface NormalisedPort {
  code: string;
  name: string;
  city: string;
  countryCode: string;
}

export interface NormalisedSailing {
  id: string;
  operatorId: string;
  operatorName: string;
  operatorLogoUrl: string | null;
  departurePort: NormalisedPort;
  arrivalPort: NormalisedPort;
  departureAt: string; // ISO-8601
  arrivalAt: string;
  durationMinutes: number;
  shipType: string;
  availableSeats: number;
  /** Base fare per adult, without vehicle */
  basePriceEur: number;
  /** Total price for the given passenger/vehicle combo */
  totalPriceEur: number;
  /** Fare breakdown */
  fares: {
    label: string;
    type: "passenger" | "vehicle" | "cabin" | "extra";
    priceEur: number;
    refundable: boolean;
    flexible: boolean;
  }[];
  amenities: string[];
}

// ─── Adapter interface ────────────────────────────────────────────────────────

export interface FerryOperatorAdapter {
  operatorId: string;

  /**
   * Search available sailings for a given query.
   * Must never throw — return [] on error.
   */
  searchSailings(query: SearchQuery): Promise<NormalisedSailing[]>;

  /** Detailed pricing for a specific sailing + passenger mix */
  getPricing(
    sailingId: string,
    passengers: PassengerCounts,
    vehicle?: VehicleQuery
  ): Promise<{
    totalEur: number;
    breakdown: { label: string; unitPrice: number; qty: number; total: number }[];
    expiresAt: string;
  } | null>;

  checkAvailability(
    sailingId: string,
    passengers: PassengerCounts,
    vehicle?: VehicleQuery
  ): Promise<{ available: boolean; remainingSeats: number }>;

  /** Confirm a booking. Returns operator reference. */
  book(params: {
    sailingId: string;
    passengers: PassengerCounts;
    vehicle?: VehicleQuery;
    contactEmail: string;
    internalRef: string;
  }): Promise<{ operatorRef: string; confirmationUrl?: string }>;

  cancel(operatorRef: string): Promise<{ success: boolean; refundEur?: number }>;
}
