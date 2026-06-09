import { NextRequest } from "next/server";
import { getBookingRepository } from "@/lib/repositories/booking-repository";
import { getAdapter } from "@/lib/operators/registry";
import { getSailingById } from "@/lib/operators/get-sailing";

interface Params {
  params: Promise<{ bookingId: string }>;
}

export async function POST(_request: NextRequest, { params }: Params) {
  const { bookingId } = await params;

  const repo = await getBookingRepository();
  const booking = await repo.findById(bookingId);

  if (!booking) {
    return Response.json({ error: "Réservation introuvable" }, { status: 404 });
  }

  if (booking.status === "cancelled" || booking.status === "refunded") {
    return Response.json({ error: "Réservation déjà annulée" }, { status: 409 });
  }

  // Call operator adapter cancel (mock always succeeds)
  const passengers = {
    adults: booking.passengers.filter((p) => p.type === "adult").length,
    children: booking.passengers.filter((p) => p.type === "child").length,
    infants: booking.passengers.filter((p) => p.type === "infant").length,
  };

  const outbound = await getSailingById(booking.outboundId, passengers);
  if (outbound) {
    const adapter = getAdapter(outbound.operatorId);
    if (adapter && booking.stripeSessionId) {
      try {
        await adapter.cancel(booking.stripeSessionId);
      } catch {
        // non-fatal
      }
    }
  }

  // If paid and Stripe configured, issue refund (stubbed)
  let refundAmount = 0;
  if (booking.status === "confirmed" && booking.stripeSessionId && process.env.STRIPE_SECRET_KEY) {
    try {
      const { getStripe } = await import("@/lib/stripe/client");
      const stripe = getStripe();
      const sessions = await stripe.checkout.sessions.list({ limit: 1 });
      const session = sessions.data.find((s) => s.id === booking.stripeSessionId);
      if (session?.payment_intent) {
        const refund = await stripe.refunds.create({
          payment_intent: session.payment_intent as string,
        });
        refundAmount = (refund.amount ?? 0) / 100;
      }
    } catch {
      // non-fatal — mark as cancelled anyway
    }
  }

  const newStatus = booking.status === "confirmed" ? "refunded" : "cancelled";
  await repo.update(bookingId, { status: newStatus });

  return Response.json({ ok: true, status: newStatus, refundAmount });
}
