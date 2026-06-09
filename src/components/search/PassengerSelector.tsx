"use client";

import { useState, useRef, useEffect } from "react";
import { Users, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PassengerCounts {
  adults: number;
  children: number;
  infants: number;
}

interface Props {
  value: PassengerCounts;
  onChange: (v: PassengerCounts) => void;
  className?: string;
}

function Counter({
  label,
  sublabel,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  sublabel: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{sublabel}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="flex h-8 w-8 items-center justify-center rounded-full border disabled:opacity-30"
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="w-4 text-center text-sm font-medium tabular-nums">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="flex h-8 w-8 items-center justify-center rounded-full border disabled:opacity-30"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

export function PassengerSelector({ value, onChange, className }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const total = value.adults + value.children + value.infants;
  const label =
    total === 1
      ? "1 passager"
      : `${total} passagers`;

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-12 w-full items-center gap-2 rounded-md border border-input bg-background px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          open && "ring-2 ring-ring"
        )}
      >
        <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="flex-1 text-left">{label}</span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-md border bg-popover p-3 shadow-lg">
          <Counter
            label="Adultes"
            sublabel="13 ans et plus"
            value={value.adults}
            min={1}
            max={9}
            onChange={(v) => onChange({ ...value, adults: v })}
          />
          <Counter
            label="Enfants"
            sublabel="4 – 12 ans"
            value={value.children}
            min={0}
            max={8}
            onChange={(v) => onChange({ ...value, children: v })}
          />
          <Counter
            label="Bébés"
            sublabel="Moins de 4 ans"
            value={value.infants}
            min={0}
            max={4}
            onChange={(v) => onChange({ ...value, infants: v })}
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-2 w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
          >
            Confirmer
          </button>
        </div>
      )}
    </div>
  );
}
