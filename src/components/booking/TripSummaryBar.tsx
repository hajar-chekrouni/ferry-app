import { NormalisedSailing } from "@/lib/operators/types";
import { formatDuration, formatPrice } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface Props {
  outbound: NormalisedSailing;
  inbound?: NormalisedSailing;
}

function LegInfo({ sailing, label }: { sailing: NormalisedSailing; label: string }) {
  const dep = sailing.departureAt.substring(11, 16);
  const arr = sailing.arrivalAt.substring(11, 16);
  const date = new Date(sailing.departureAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="flex items-center gap-2 text-sm font-medium">
        <span>{sailing.departurePort.code}</span>
        <ArrowRight className="h-3 w-3 text-muted-foreground" />
        <span>{sailing.arrivalPort.code}</span>
        <span className="text-muted-foreground">·</span>
        <span>{dep}</span>
        <span className="text-muted-foreground">→</span>
        <span>{arr}</span>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">{formatDuration(sailing.durationMinutes)}</span>
      </div>
      <div className="text-xs text-muted-foreground">
        {date} · {sailing.operatorName} · {sailing.shipType}
      </div>
    </div>
  );
}

export function TripSummaryBar({ outbound, inbound }: Props) {
  const baseTotal = outbound.totalPriceEur + (inbound?.totalPriceEur ?? 0);

  return (
    <div className="rounded-xl border bg-blue-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <LegInfo sailing={outbound} label="Aller" />
          {inbound && <LegInfo sailing={inbound} label="Retour" />}
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs text-muted-foreground">À partir de</p>
          <p className="text-2xl font-bold text-primary">{formatPrice(baseTotal)}</p>
        </div>
      </div>
    </div>
  );
}
