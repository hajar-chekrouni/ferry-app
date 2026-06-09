export const dynamic = "force-dynamic";

import { Header } from "@/components/layout/Header";
import { getBooking } from "@/lib/booking/store";
import { getSailingById } from "@/lib/operators/get-sailing";
import { computeCart } from "@/lib/booking/cart";
import { formatPrice, formatDuration } from "@/lib/utils";
import { generateQRDataURL } from "@/lib/ticket/qr";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, CheckCircle2, Download } from "lucide-react";

interface PageProps {
  params: Promise<{ bookingId: string }>;
  searchParams: Promise<{ session_id?: string }>;
}

export default async function ConfirmPage({ params }: PageProps) {
  const { bookingId } = await params;

  const booking = getBooking(bookingId);

  if (!booking) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-md px-4 py-16 text-center">
          <p className="text-4xl">⚓</p>
          <h1 className="mt-4 text-xl font-semibold">Réservation introuvable</h1>
          <p className="mt-2 text-muted-foreground">
            La réservation n&apos;existe pas ou a expiré.
          </p>
          <Button asChild className="mt-6">
            <Link href="/">Nouvelle recherche</Link>
          </Button>
        </main>
      </>
    );
  }

  // Reconstruct sailing data
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

  const cart = outbound
    ? computeCart(outbound, inbound ?? undefined, booking.passengers, booking.vehicle, booking.options)
    : null;

  const leadPassenger = booking.passengers[0];
  const qrDataUrl = await generateQRDataURL({
    bookingId,
    passengerName: `${leadPassenger.firstName} ${leadPassenger.lastName}`,
    outboundId: booking.outboundId,
    inboundId: booking.inboundId,
    totalEur: booking.totalEur,
    issuedAt: booking.paidAt ?? booking.createdAt,
  });

  const isPending = booking.status === "pending_payment";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-2xl space-y-6 px-4">
          {/* Status banner */}
          <div className={`flex items-center gap-3 rounded-2xl p-5 ${
            isPending
              ? "bg-yellow-50 border border-yellow-200"
              : "bg-green-50 border border-green-200"
          }`}>
            <CheckCircle2 className={`h-8 w-8 shrink-0 ${isPending ? "text-yellow-500" : "text-green-500"}`} />
            <div>
              <h1 className={`text-lg font-bold ${isPending ? "text-yellow-800" : "text-green-800"}`}>
                {isPending ? "Réservation en attente de paiement" : "Réservation confirmée !"}
              </h1>
              <p className={`text-sm ${isPending ? "text-yellow-700" : "text-green-700"}`}>
                Référence : <span className="font-mono font-semibold">{bookingId}</span>
                {booking.paidAt && (
                  <> · Payé le {new Date(booking.paidAt).toLocaleDateString("fr-FR")}</>
                )}
              </p>
            </div>
          </div>

          {/* Ticket card */}
          <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            {/* QR + header */}
            <div className="flex flex-col items-center gap-4 bg-gradient-to-br from-blue-700 to-blue-500 p-6 text-white sm:flex-row sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-200">Billet électronique</p>
                <p className="text-2xl font-extrabold">{leadPassenger.firstName} {leadPassenger.lastName}</p>
                <p className="text-sm text-blue-200">
                  {booking.passengers.length} passager{booking.passengers.length > 1 ? "s" : ""}
                  {booking.vehicle && ` · ${booking.vehicle.category}`}
                </p>
              </div>
              <div className="rounded-xl bg-white p-2">
                <Image
                  src={qrDataUrl}
                  alt="QR code billet"
                  width={120}
                  height={120}
                  className="h-28 w-28"
                />
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Sailing legs */}
              {outbound && (
                <SailingLegBlock sailing={outbound} label="Aller" />
              )}
              {inbound && (
                <>
                  <Separator />
                  <SailingLegBlock sailing={inbound} label="Retour" />
                </>
              )}

              <Separator />

              {/* Passengers */}
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Passagers
                </p>
                <div className="space-y-1">
                  {booking.passengers.map((p, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span>{p.firstName} {p.lastName}</span>
                      <span className="text-muted-foreground">
                        {p.type === "adult" ? "Adulte" : p.type === "child" ? "Enfant" : "Bébé"} ·{" "}
                        {p.documentType === "passport" ? "Passeport" : "CNI"} {p.documentNumber}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vehicle */}
              {booking.vehicle && (
                <>
                  <Separator />
                  <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Véhicule
                    </p>
                    <p className="text-sm">
                      {booking.vehicle.brand} {booking.vehicle.model} ·{" "}
                      <span className="font-mono font-semibold">{booking.vehicle.plate}</span> ·{" "}
                      {booking.vehicle.lengthCm} cm
                    </p>
                  </div>
                </>
              )}

              {/* Price breakdown */}
              {cart && (
                <>
                  <Separator />
                  <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Détail du prix
                    </p>
                    <div className="space-y-1.5">
                      {cart.lines.map((line, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{line.label}</span>
                          <span>{formatPrice(line.amount)}</span>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span>Total payé</span>
                      <span className="text-primary">{formatPrice(booking.totalEur)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Ticket footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-gray-50 px-6 py-4">
              <p className="text-xs text-muted-foreground">
                ℹ️ Présentez ce QR code à l&apos;embarquement. Arrivez 90 min à l&apos;avance.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/booking/ticket/${bookingId}`} target="_blank">
                    <Download className="mr-1.5 h-4 w-4" />
                    Ticket imprimable
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" asChild className="flex-1">
              <Link href="/">Nouvelle recherche</Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/account">Mes réservations</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}

function SailingLegBlock({
  sailing,
  label,
}: {
  sailing: {
    operatorName: string;
    departurePort: { code: string; name: string };
    arrivalPort: { code: string; name: string };
    departureAt: string;
    arrivalAt: string;
    durationMinutes: number;
    shipType: string;
  };
  label: string;
}) {
  const depTime = sailing.departureAt.substring(11, 16);
  const arrTime = sailing.arrivalAt.substring(11, 16);
  const date = new Date(sailing.departureAt).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold tabular-nums">{depTime}</p>
          <p className="text-xs text-muted-foreground">{sailing.departurePort.code}</p>
          <p className="text-xs text-muted-foreground">{sailing.departurePort.name}</p>
        </div>
        <div className="flex flex-1 flex-col items-center">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatDuration(sailing.durationMinutes)}
          </div>
          <div className="flex w-full items-center">
            <div className="h-px flex-1 bg-border" />
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">{sailing.shipType}</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold tabular-nums">{arrTime}</p>
          <p className="text-xs text-muted-foreground">{sailing.arrivalPort.code}</p>
          <p className="text-xs text-muted-foreground">{sailing.arrivalPort.name}</p>
        </div>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {date} · {sailing.operatorName}
      </p>
    </div>
  );
}
