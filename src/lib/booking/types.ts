import { z } from "zod";

// ─── Per-passenger form ───────────────────────────────────────────────────────

export const PassengerFormSchema = z.object({
  type: z.enum(["adult", "child", "infant"]),
  firstName: z.string().min(2, "Prénom requis (min. 2 car.)"),
  lastName: z.string().min(2, "Nom requis (min. 2 car.)"),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide"),
  nationality: z.string().min(2, "Nationalité requise"),
  documentType: z.enum(["passport", "national_id"]),
  documentNumber: z.string().min(3, "Numéro de document requis"),
});
export type PassengerForm = z.infer<typeof PassengerFormSchema>;

// ─── Vehicle form ─────────────────────────────────────────────────────────────

export const VehicleFormSchema = z.object({
  category: z.enum(["car", "motorcycle", "van", "truck", "camper"]),
  plate: z.string().min(3, "Plaque d'immatriculation requise"),
  lengthCm: z.number().int().min(100).max(2000),
  heightCm: z.number().int().min(100).max(500).optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
});
export type VehicleForm = z.infer<typeof VehicleFormSchema>;

// ─── Options ──────────────────────────────────────────────────────────────────

export const BookingOptionsSchema = z.object({
  accommodationType: z
    .enum(["seat", "interior_cabin", "exterior_cabin"])
    .nullable(),
  hasPet: z.boolean(),
  petCount: z.number().int().min(0).max(3),
  hasMeal: z.boolean(),
  mealCount: z.number().int().min(0).max(10),
  isFlexible: z.boolean(),
});
export type BookingOptions = z.infer<typeof BookingOptionsSchema>;

export const DEFAULT_OPTIONS: BookingOptions = {
  accommodationType: null,
  hasPet: false,
  petCount: 0,
  hasMeal: false,
  mealCount: 0,
  isFlexible: false,
};

// ─── Contact info ─────────────────────────────────────────────────────────────

export const ContactFormSchema = z.object({
  email: z.string().email("E-mail invalide"),
  phone: z.string().optional(),
});
export type ContactForm = z.infer<typeof ContactFormSchema>;

// ─── Full booking state (client-side cart) ────────────────────────────────────

export interface BookingState {
  outboundId: string;
  inboundId?: string;
  searchParams: {
    adults: number;
    children: number;
    infants: number;
    vehicleCategory?: string;
    vehicleLengthCm?: number;
  };
  options: BookingOptions;
  passengers: PassengerForm[];
  vehicle?: VehicleForm;
  contact: ContactForm;
}

export type BookingStep = "options" | "passengers" | "vehicle" | "summary";
