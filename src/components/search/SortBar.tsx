"use client";

import { SortKey } from "@/lib/search/aggregator";
import { cn } from "@/lib/utils";

const OPTIONS: { key: SortKey; label: string }[] = [
  { key: "departure", label: "Heure" },
  { key: "price", label: "Prix" },
  { key: "duration", label: "Durée" },
];

interface Props {
  value: SortKey;
  onChange: (k: SortKey) => void;
  count: number;
  className?: string;
}

export function SortBar({ value, onChange, count, className }: Props) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{count}</span>{" "}
        {count === 1 ? "traversée" : "traversées"}
      </p>
      <div className="flex items-center gap-1">
        <span className="text-sm text-muted-foreground">Trier :</span>
        {OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            className={cn(
              "rounded-full px-3 py-1 text-sm font-medium transition-colors",
              value === opt.key
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-muted-foreground"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
