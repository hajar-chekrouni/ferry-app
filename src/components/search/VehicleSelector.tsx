"use client";

import { Car } from "lucide-react";
import { VEHICLE_TYPES } from "@/lib/seed/data";
import { cn } from "@/lib/utils";

export interface VehicleState {
  enabled: boolean;
  category: string;
  lengthCm: number;
}

interface Props {
  value: VehicleState;
  onChange: (v: VehicleState) => void;
  className?: string;
}

const LENGTH_OPTIONS = [
  { label: "< 4 m", value: 380 },
  { label: "4 – 5 m", value: 480 },
  { label: "5 – 6 m", value: 580 },
  { label: "> 6 m", value: 700 },
];

export function VehicleSelector({ value, onChange, className }: Props) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={value.enabled}
          onChange={(e) =>
            onChange({ ...value, enabled: e.target.checked })
          }
          className="h-4 w-4 rounded border-input accent-primary"
        />
        <Car className="h-4 w-4 text-muted-foreground" />
        <span>Avec un véhicule</span>
      </label>

      {value.enabled && (
        <div className="flex flex-wrap gap-2 pl-6">
          {VEHICLE_TYPES.map((vt) => (
            <button
              key={vt.id}
              type="button"
              onClick={() => onChange({ ...value, category: vt.category })}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                value.category === vt.category
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-background hover:bg-accent"
              )}
            >
              {vt.label}
            </button>
          ))}
          <select
            value={value.lengthCm}
            onChange={(e) => onChange({ ...value, lengthCm: Number(e.target.value) })}
            className="rounded-full border border-input bg-background px-3 py-1 text-xs"
          >
            {LENGTH_OPTIONS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
