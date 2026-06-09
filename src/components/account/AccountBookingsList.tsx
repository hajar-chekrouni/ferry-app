import { StoredBooking } from "@/lib/booking/store";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Anchor } from "lucide-react";
import { ROUTES, PORTS } from "@/lib/seed/data";

interface Props {
  bookings: StoredBooking[];
}

const STATUS_BADGE = {
  pending_payment: { label: "À payer", variant: "warning" as const },
  confirmed: { label: "Confirmée", variant: "success" as const },
  cancelled: { label: "Annulée", variant: "destructive" as const },
  refunded: { label: "Remboursée", variant: "outline" as const },
};

function getRouteLabel(sailingId: string): string {
  const routeId = sailingId.split("|")[0];
  const route = ROUTES.find((r) => r.id === routeId);
  if (!route) return sailingId;
  const dep = PORTS.find((p) => p.id === route.departurePortId);
  const arr = PORTS.find((p) => p.id === route.arrivalPortId);
  return `${dep?.code ?? "?"} → ${arr?.code ?? "?"}`;
}

function getSailingDate(sailingId: string): string {
  const dt = sailingId.split("|")[1];
  if (!dt) return "";
  return new Date(dt).toLocaleDateString("fr-FR", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export function AccountBookingsList({ bookings }: Props) {
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed bg-white py-16 text-center">
        <Anchor className="h-10 w-10 text-muted-foreground/40" />
        <div>
          <p className="font-semibold">Aucune réservation</p>
          <p className="text-sm text-muted-foreground">
            Vos réservations apparaîtront ici une fois créées.
          </p>
        </div>
        <Link
          href="/"
          className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-white"
        >
          Rechercher une traversée
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => {
        const statusInfo = STATUS_BADGE[booking.status];
        const outboundLabel = getRouteLabel(booking.outboundId);
        const depDate = getSailingDate(booking.outboundId);
        const isRoundTrip = !!booking.inboundId;
        const passengerCount = booking.passengers.length;

        return (
          <Link
            key={booking.id}
            href={`/account/booking/${booking.id}`}
            className="group flex items-center justify-between gap-4 rounded-xl border bg-white p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50">
                <Anchor className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold group-hover:text-primary">
                    {outboundLabel}
                    {isRoundTrip && (
                      <span className="ml-1 text-muted-foreground text-sm font-normal">A/R</span>
                    )}
                  </p>
                  <Badge variant={statusInfo.variant} className="text-[10px]">
                    {statusInfo.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {depDate} · {passengerCount} passager{passengerCount > 1 ? "s" : ""}
                  {booking.vehicle && " · Avec véhicule"}
                </p>
                <p className="font-mono text-xs text-muted-foreground/60">{booking.id}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <p className="text-lg font-bold text-primary">{formatPrice(booking.totalEur)}</p>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
