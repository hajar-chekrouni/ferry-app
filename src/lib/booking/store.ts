import { PassengerForm, VehicleForm, BookingOptions, ContactForm } from "./types";

export type BookingStatus =
  | "pending_payment"
  | "confirmed"
  | "cancelled"
  | "refunded";

export interface StoredBooking {
  id: string;
  status: BookingStatus;
  outboundId: string;
  inboundId?: string;
  passengers: PassengerForm[];
  vehicle?: VehicleForm;
  options: BookingOptions;
  contact: ContactForm;
  totalEur: number;
  stripeSessionId?: string;
  paidAt?: string;
  createdAt: string;
}

// In-memory store — singleton across the Node.js process.
// Replaced by Supabase in Phase 5.
declare global {
  // eslint-disable-next-line no-var
  var __bookingStore: Map<string, StoredBooking> | undefined;
}

if (!global.__bookingStore) {
  global.__bookingStore = new Map<string, StoredBooking>();
}

export const bookingStore = global.__bookingStore;

export function getBooking(id: string): StoredBooking | undefined {
  return bookingStore.get(id);
}

export function saveBooking(booking: StoredBooking): void {
  bookingStore.set(booking.id, booking);
}

export function updateBookingStatus(
  id: string,
  updates: Partial<StoredBooking>
): StoredBooking | null {
  const existing = bookingStore.get(id);
  if (!existing) return null;
  const updated = { ...existing, ...updates };
  bookingStore.set(id, updated);
  return updated;
}
