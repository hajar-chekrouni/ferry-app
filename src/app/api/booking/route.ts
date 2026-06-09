import { NextRequest } from "next/server";
import { z } from "zod";
import { getSailingById } from "@/lib/operators/get-sailing";
import { computeCart } from "@/lib/booking/cart";
import {
  PassengerFormSchema,
  VehicleFormSchema,
  BookingOptionsSchema,
  ContactFormSchema,
} from "@/lib/booking/types";
import { getAdapter } from "@/lib/operators/registry";
import { saveBooking } from "@/lib/booking/store";

const BookingRequestSchema = z.object({
  outboundId: z.string().min(1),
  inboundId: z.string().optional(),
  passengers: z.array(PassengerFormSchema).min(1),
  vehicle: VehicleFormSchema.optional(),
  options: BookingOptionsSchema,
  contact: ContactFormSchema,
  searchParams: z.object({
    adults: z.number().int().min(1),
    children: z.number().int().min(0),
    infants: z.number().int().min(0),
    vehicleCategory: z.string().optional(),
    vehicleLengthCm: z.number().optional(),
  }),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = BookingRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { outboundId, inboundId, passengers, vehicle, options, contact, searchParams } =
    parsed.data;

  const passengerCounts = {
    adults: searchParams.adults,
    children: searchParams.children,
    infants: searchParams.infants,
  };
  const vehicleQuery = searchParams.vehicleCategory
    ? {
        category: searchParams.vehicleCategory as
          | "car"
          | "motorcycle"
          | "van"
          | "truck"
          | "camper",
        lengthCm: searchParams.vehicleLengthCm,
      }
    : undefined;

  const [outbound, inbound] = await Promise.all([
    getSailingById(outboundId, passengerCounts, vehicleQuery),
    inboundId
      ? getSailingById(inboundId, passengerCounts, vehicleQuery)
      : Promise.resolve(null),
  ]);

  if (!outbound) {
    return Response.json({ error: "Traversée aller introuvable" }, { status: 404 });
  }

  const cart = computeCart(outbound, inbound ?? undefined, passengers, vehicle, options);

  const bookingId = `BKG-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase()}`;

  // Call operator adapter
  const adapter = getAdapter(outbound.operatorId);
  if (adapter) {
    try {
      await adapter.book({
        sailingId: outboundId,
        passengers: passengerCounts,
        vehicle: vehicleQuery,
        contactEmail: contact.email,
        internalRef: bookingId,
      });
    } catch {
      // mock never fails; real adapter might — we continue anyway for now
    }
  }

  saveBooking({
    id: bookingId,
    status: "pending_payment",
    outboundId,
    inboundId,
    passengers,
    vehicle,
    options,
    contact,
    totalEur: cart.total,
    createdAt: new Date().toISOString(),
  });

  return Response.json({ bookingId, totalEur: cart.total }, { status: 201 });
}
