import { NextRequest } from "next/server";
import { getBooking, updateBookingStatus } from "@/lib/booking/store";
import { getSailingById } from "@/lib/operators/get-sailing";
import { sendConfirmationEmail } from "@/lib/email/send-confirmation";

interface Params {
  params: Promise<{ bookingId: string }>;
}

export async function POST(_request: NextRequest, { params }: Params) {
  const { bookingId } = await params;

  const booking = getBooking(bookingId);
  if (!booking) {
    return Response.json({ error: "Réservation introuvable" }, { status: 404 });
  }
  if (booking.status === "confirmed") {
    return Response.json({ ok: true, alreadyConfirmed: true });
  }

  const updated = updateBookingStatus(bookingId, {
    status: "confirmed",
    stripeSessionId: `mock_session_${Date.now()}`,
    paidAt: new Date().toISOString(),
  });

  if (!updated) {
    return Response.json({ error: "Mise à jour échouée" }, { status: 500 });
  }

  // Send confirmation email (stubbed if no API key)
  const passengers = {
    adults: booking.passengers.filter((p) => p.type === "adult").length,
    children: booking.passengers.filter((p) => p.type === "child").length,
    infants: booking.passengers.filter((p) => p.type === "infant").length,
  };
  const vehicleQuery = booking.vehicle
    ? { category: booking.vehicle.category, lengthCm: booking.vehicle.lengthCm }
    : undefined;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  try {
    const [outbound, inbound] = await Promise.all([
      getSailingById(booking.outboundId, passengers, vehicleQuery),
      booking.inboundId
        ? getSailingById(booking.inboundId, passengers, vehicleQuery)
        : Promise.resolve(null),
    ]);

    if (outbound) {
      await sendConfirmationEmail({
        booking: updated,
        outboundSailing: outbound,
        inboundSailing: inbound ?? undefined,
        ticketUrl: `${baseUrl}/booking/ticket/${bookingId}`,
      });
    }
  } catch (err) {
    console.error("[confirm-mock] email error:", err);
  }

  return Response.json({ ok: true, bookingId });
}
