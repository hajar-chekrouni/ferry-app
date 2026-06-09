import { Header } from "@/components/layout/Header";
import { getBookingRepository } from "@/lib/repositories/booking-repository";
import { getSailingById } from "@/lib/operators/get-sailing";
import { formatPrice, formatDuration } from "@/lib/utils";
import { generateQRDataURL } from "@/lib/ticket/qr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock } from "lucide-react";
import { CancelButton } from "@/components/account/CancelButton";

interface PageProps {
  params: Promise<{ bookingId: string }>;
}

const STATUS_BADGE = {
  pending_payment: { label: "En attente", variant: "warning" as const },
  confirmed: { label: "Confirmée", variant: "success" as const },
  cancelled: { label: "Annulée", variant: "destructive" as const },
  refunded: { label: "Remboursée", variant: "outline" as const },
};

export default async function AccountBookingDetailPage({ params }: PageProps) {
  const { bookingId } = await params;
  const repo = await getBookingRepository();
  const booking = await repo.findById(bookingId);
  if (!booking) notFound();

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

  const leadPassenger = booking.passengers[0];
  const qrDataUrl =
    booking.status === "confirmed"
      ? await generateQRDataURL({
          bookingId,
          passengerName: `${leadPassenger.firstName} ${leadPassenger.lastName}`,
          outboundId: booking.outboundId,
          inboundId: booking.inboundId,
          totalEur: booking.totalEur,
          issuedAt: booking.paidAt ?? booking.createdAt,
        })
      : null;

  const statusInfo = STATUS_BADGE[booking.status];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-2xl space-y-5 px-4">
          {/* Back */}
          <Link href="/account" className="text-sm text-muted-foreground hover:text-foreground">
            ← Mes réservations
          </Link>

          {/* Header card */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Réservation
                </p>
                <p className="font-mono text-lg font-bold">{bookingId}</p>
                <p className="text-sm text-muted-foreground">
                  Créée le{" "}
                  {new Date(booking.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                <p className="text-xl font-bold text-primary">{formatPrice(booking.totalEur)}</p>
              </div>
            </div>
          </div>

          {/* QR + ticket link (confirmed only) */}
          {qrDataUrl && (
            <div className="flex items-center gap-4 rounded-2xl border bg-white p-6 shadow-sm">
              <div className="rounded-xl border p-2">
                <Image src={qrDataUrl} alt="QR code" width={96} height={96} />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Billet électronique</p>
                <p className="text-sm text-muted-foreground">
                  Présentez ce QR code à l&apos;embarquement.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" asChild>
                    <Link href={`/booking/confirm/${bookingId}`}>Voir le billet</Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/booking/ticket/${bookingId}`} target="_blank">
                      Imprimer / PDF
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Pay button if pending */}
          {booking.status === "pending_payment" && (
            <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
              <p className="font-semibold text-yellow-800">Paiement en attente</p>
              <p className="mt-1 text-sm text-yellow-700">
                Cette réservation n&apos;a pas encore été payée.
              </p>
              <Button asChild className="mt-3">
                <Link href={`/booking/pay/${bookingId}`}>Finaliser le paiement</Link>
              </Button>
            </div>
          )}

          {/* Sailings */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-semibold">Traversée(s)</h2>
            {outbound && <LegBlock sailing={outbound} label="Aller" />}
            {inbound && (
              <>
                <Separator />
                <LegBlock sailing={inbound} label="Retour" />
              </>
            )}
          </div>

          {/* Passengers */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-3 font-semibold">
              Passagers ({booking.passengers.length})
            </h2>
            <div className="space-y-2">
              {booking.passengers.map((p, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{p.firstName} {p.lastName}</span>
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
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-3 font-semibold">Véhicule</h2>
              <div className="grid grid-cols-2 gap-1 text-sm">
                <span className="text-muted-foreground">Plaque</span>
                <span className="font-mono font-semibold">{booking.vehicle.plate}</span>
                <span className="text-muted-foreground">Type</span>
                <span className="capitalize">{booking.vehicle.category}</span>
                {booking.vehicle.brand && (
                  <>
                    <span className="text-muted-foreground">Véhicule</span>
                    <span>{booking.vehicle.brand} {booking.vehicle.model}</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Cancellation */}
          {(booking.status === "confirmed" || booking.status === "pending_payment") && (
            <CancelButton bookingId={bookingId} status={booking.status} />
          )}
        </div>
      </main>
    </>
  );
}

function LegBlock({
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
  const dep = sailing.departureAt.substring(11, 16);
  const arr = sailing.arrivalAt.substring(11, 16);
  const date = new Date(sailing.departureAt).toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="text-xl font-bold tabular-nums">{dep}</p>
          <p className="text-xs text-muted-foreground">{sailing.departurePort.code}</p>
        </div>
        <div className="flex flex-1 flex-col items-center gap-0.5">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />{formatDuration(sailing.durationMinutes)}
          </span>
          <div className="flex w-full items-center">
            <div className="h-px flex-1 bg-border" />
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
          </div>
          <span className="text-xs text-muted-foreground">{sailing.shipType}</span>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold tabular-nums">{arr}</p>
          <p className="text-xs text-muted-foreground">{sailing.arrivalPort.code}</p>
        </div>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {date} · {sailing.operatorName}
      </p>
    </div>
  );
}
