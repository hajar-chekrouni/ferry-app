import { NormalisedSailing } from "@/lib/operators/types";
import { formatDuration, formatPrice, cn } from "@/lib/utils";
import { Clock, Wifi, Coffee, UtensilsCrossed, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="h-3 w-3" />,
  Bar: <Coffee className="h-3 w-3" />,
  Restaurant: <UtensilsCrossed className="h-3 w-3" />,
  "Boutique hors-taxe": <ShoppingBag className="h-3 w-3" />,
};

const OPERATOR_COLORS: Record<string, string> = {
  balearia: "bg-blue-50 text-blue-700 border-blue-200",
  frs: "bg-green-50 text-green-700 border-green-200",
  aml: "bg-orange-50 text-orange-700 border-orange-200",
  gnv: "bg-purple-50 text-purple-700 border-purple-200",
  trasmediterranea: "bg-red-50 text-red-700 border-red-200",
  intershipping: "bg-teal-50 text-teal-700 border-teal-200",
};

function fmt(iso: string) {
  return iso.substring(11, 16);
}

interface Props {
  sailing: NormalisedSailing;
  selected?: boolean;
  onSelect?: (sailing: NormalisedSailing) => void;
  className?: string;
}

export function SailingCard({ sailing, selected, onSelect, className }: Props) {
  const depTime = fmt(sailing.departureAt);
  const arrTime = fmt(sailing.arrivalAt);
  const opColor = OPERATOR_COLORS[sailing.operatorId] ?? "bg-gray-50 text-gray-700";

  return (
    <div
      onClick={() => onSelect?.(sailing)}
      className={cn(
        "relative rounded-xl border bg-white p-4 transition-all",
        onSelect && "cursor-pointer hover:shadow-md",
        selected
          ? "border-primary ring-2 ring-primary/20"
          : "border-border hover:border-primary/40",
        className
      )}
    >
      {/* Header: operator + ship type */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-xs font-semibold",
            opColor
          )}
        >
          {sailing.operatorName}
        </span>
        <span className="text-xs text-muted-foreground">{sailing.shipType}</span>
      </div>

      {/* Times + duration */}
      <div className="mt-3 flex items-center gap-3">
        <div className="text-center">
          <p className="text-2xl font-bold tabular-nums">{depTime}</p>
          <p className="text-xs text-muted-foreground">
            {sailing.departurePort.code}
          </p>
        </div>

        <div className="flex flex-1 flex-col items-center gap-0.5">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatDuration(sailing.durationMinutes)}
          </div>
          <div className="h-px w-full bg-border" />
          <div className="flex gap-1">
            {sailing.amenities.slice(0, 3).map((a) => (
              <span
                key={a}
                title={a}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground"
              >
                {AMENITY_ICONS[a] ?? <span className="text-[9px]">✦</span>}
              </span>
            ))}
            {sailing.amenities.length > 3 && (
              <span className="flex h-5 items-center px-1 text-[10px] text-muted-foreground">
                +{sailing.amenities.length - 3}
              </span>
            )}
          </div>
        </div>

        <div className="text-center">
          <p className="text-2xl font-bold tabular-nums">{arrTime}</p>
          <p className="text-xs text-muted-foreground">
            {sailing.arrivalPort.code}
          </p>
        </div>

        {/* Price */}
        <div className="ml-auto border-l pl-4 text-right">
          <p className="text-xl font-bold text-primary">
            {formatPrice(sailing.totalPriceEur)}
          </p>
          <p className="text-xs text-muted-foreground">total</p>
          {sailing.availableSeats <= 10 && (
            <Badge variant="warning" className="mt-1 text-[10px]">
              {sailing.availableSeats} places
            </Badge>
          )}
        </div>
      </div>

      {selected && (
        <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
          ✓
        </div>
      )}
    </div>
  );
}

export function SailingCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="h-5 w-24 rounded-full bg-muted" />
        <div className="h-4 w-20 rounded bg-muted" />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="space-y-1 text-center">
          <div className="h-8 w-14 rounded bg-muted" />
          <div className="h-3 w-8 rounded bg-muted" />
        </div>
        <div className="flex-1">
          <div className="h-px w-full bg-muted" />
        </div>
        <div className="space-y-1 text-center">
          <div className="h-8 w-14 rounded bg-muted" />
          <div className="h-3 w-8 rounded bg-muted" />
        </div>
        <div className="ml-auto border-l pl-4">
          <div className="h-7 w-16 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
