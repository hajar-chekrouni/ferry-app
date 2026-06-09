import { NextRequest } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe/client";
import { getBooking } from "@/lib/booking/store";
import { getSailingById } from "@/lib/operators/get-sailing";
import { computeCart } from "@/lib/booking/cart";

export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return Response.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY in .env.local." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { bookingId } = body as { bookingId?: string };
  if (!bookingId) {
    return Response.json({ error: "bookingId requis" }, { status: 400 });
  }

  const booking = getBooking(bookingId);
  if (!booking) {
    return Response.json({ error: "Réservation introuvable" }, { status: 404 });
  }
  if (booking.status !== "pending_payment") {
    return Response.json({ error: "Réservation déjà payée ou annulée" }, { status: 409 });
  }

  // Reconstruct sailings to build Stripe line items
  const passengers = {
    adults: booking.passengers.filter((p) => p.type === "adult").length,
    children: booking.passengers.filter((p) => p.type === "child").length,
    infants: booking.passengers.filter((p) => p.type === "infant").length,
  };
  const vehicleQuery = booking.vehicle
    ? { category: booking.vehicle.category, lengthCm: booking.vehicle.lengthCm }
    : undefined;

  const [outbound, inbound] = await Promise.all([
    getSailingById(booking.outboundId, passengers, vehicleQuery),
    booking.inboundId
      ? getSailingById(booking.inboundId, passengers, vehicleQuery)
      : Promise.resolve(null),
  ]);

  if (!outbound) {
    return Response.json({ error: "Traversée introuvable" }, { status: 404 });
  }

  const cart = computeCart(outbound, inbound ?? undefined, booking.passengers, booking.vehicle, booking.options);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const stripe = getStripe();

  const lineItems = cart.lines.map((line) => ({
    price_data: {
      currency: "eur",
      product_data: { name: line.label },
      unit_amount: Math.round(line.amount * 100), // Stripe uses cents
    },
    quantity: 1,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${baseUrl}/booking/confirm/${bookingId}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/booking/pay/${bookingId}?cancelled=1`,
    metadata: { bookingId },
    customer_email: booking.contact.email,
  });

  return Response.json({ url: session.url, sessionId: session.id });
}
