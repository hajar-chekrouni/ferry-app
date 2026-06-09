"use client";

import { FilterState } from "@/lib/search/filters";
import { cn } from "@/lib/utils";

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  availableOperators: { id: string; name: string }[];
  maxPrice: number;
  className?: string;
}

const HOUR_SLOTS = [
  { label: "Nuit (0–6h)", min: 0, max: 6 },
  { label: "Matin (6–12h)", min: 6, max: 12 },
  { label: "Après-midi (12–18h)", min: 12, max: 18 },
  { label: "Soir (18–24h)", min: 18, max: 23 },
];

export function FilterPanel({
  filters,
  onChange,
  availableOperators,
  maxPrice,
  className,
}: Props) {
  function toggleOperator(id: string) {
    const ops = filters.operators.includes(id)
      ? filters.operators.filter((o) => o !== id)
      : [...filters.operators, id];
    onChange({ ...filters, operators: ops });
  }

  function setHourSlot(min: number, max: number) {
    const already =
      filters.minDepartureHour === min && filters.maxDepartureHour === max;
    onChange({
      ...filters,
      minDepartureHour: already ? 0 : min,
      maxDepartureHour: already ? 23 : max,
    });
  }

  function reset() {
    onChange({
      operators: [],
      maxPriceEur: null,
      minDepartureHour: 0,
      maxDepartureHour: 23,
      maxDurationMinutes: null,
    });
  }

  const hasActive =
    filters.operators.length > 0 ||
    filters.maxPriceEur !== null ||
    filters.minDepartureHour !== 0 ||
    filters.maxDepartureHour !== 23 ||
    filters.maxDurationMinutes !== null;

  return (
    <aside className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filtres</h2>
        {hasActive && (
          <button
            onClick={reset}
            className="text-xs text-primary underline-offset-2 hover:underline"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Price */}
      <div>
        <p className="mb-2 text-sm font-medium">Prix max</p>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={maxPrice}
            step={5}
            value={filters.maxPriceEur ?? maxPrice}
            onChange={(e) =>
              onChange({
                ...filters,
                maxPriceEur:
                  Number(e.target.value) === maxPrice ? null : Number(e.target.value),
              })
            }
            className="h-1.5 w-full cursor-pointer accent-primary"
          />
          <span className="min-w-[50px] text-right text-sm font-medium">
            {filters.maxPriceEur !== null ? `${filters.maxPriceEur} €` : "Tous"}
          </span>
        </div>
      </div>

      {/* Departure time */}
      <div>
        <p className="mb-2 text-sm font-medium">Heure de départ</p>
        <div className="space-y-1">
          {HOUR_SLOTS.map((slot) => {
            const active =
              filters.minDepartureHour === slot.min &&
              filters.maxDepartureHour === slot.max;
            return (
              <button
                key={slot.label}
                type="button"
                onClick={() => setHourSlot(slot.min, slot.max)}
                className={cn(
                  "w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors",
                  active
                    ? "bg-primary/10 font-medium text-primary"
                    : "hover:bg-muted"
                )}
              >
                {slot.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Operators */}
      {availableOperators.length > 1 && (
        <div>
          <p className="mb-2 text-sm font-medium">Compagnie</p>
          <div className="space-y-1">
            {availableOperators.map((op) => (
              <label
                key={op.id}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
              >
                <input
                  type="checkbox"
                  checked={
                    filters.operators.length === 0 ||
                    filters.operators.includes(op.id)
                  }
                  onChange={() => toggleOperator(op.id)}
                  className="h-4 w-4 rounded accent-primary"
                />
                {op.name}
              </label>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
