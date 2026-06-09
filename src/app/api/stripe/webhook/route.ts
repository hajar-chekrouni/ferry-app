import { NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe/client";
import { getBooking, updateBookingStatus } from "@/lib/booking/store";
import { getSailingById } from "@/lib/operators/get-sailing";
import { sendConfirmationEmail } from "@/lib/email/send-confirmation";

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json({ error: "Webhook secret not configured" }, { status: 503 });
  }

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return Response.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    return Response.json({ error: `Webhook signature invalid: ${err}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { metadata?: { bookingId?: string }; id: string; customer_email?: string | null };
    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      return Response.json({ error: "No bookingId in session metadata" }, { status: 400 });
    }

    const booking = getBooking(bookingId);
    if (!booking) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    const updated = updateBookingStatus(bookingId, {
      status: "confirmed",
      stripeSessionId: session.id,
      paidAt: new Date().toISOString(),
    });

    if (updated) {
      // Send confirmation email (async, non-blocking)
      const passengers = {
        adults: booking.passengers.filter((p) => p.type === "adult").length,
        children: booking.passengers.filter((p) => p.type === "child").length,
        infants: booking.passengers.filter((p) => p.type === "infant").length,
      };
      const vehicleQuery = booking.vehicle
        ? { category: booking.vehicle.category, lengthCm: booking.vehicle.lengthCm }
        : undefined;

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

      Promise.all([
        getSailingById(booking.outboundId, passengers, vehicleQuery),
        booking.inboundId
          ? getSailingById(booking.inboundId, passengers, vehicleQuery)
          : Promise.resolve(null),
      ])
        .then(([outbound, inbound]) => {
          if (!outbound) return;
          return sendConfirmationEmail({
            booking: updated,
            outboundSailing: outbound,
            inboundSailing: inbound ?? undefined,
            ticketUrl: `${baseUrl}/booking/ticket/${bookingId}`,
          });
        })
        .catch((err) => console.error("[webhook] email error:", err));
    }
  }

  return Response.json({ received: true });
}
