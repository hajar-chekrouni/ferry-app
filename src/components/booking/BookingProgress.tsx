import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const STEPS = [
  { key: "options", label: "Options" },
  { key: "passengers", label: "Passagers" },
  { key: "vehicle", label: "Véhicule" },
  { key: "summary", label: "Récapitulatif" },
] as const;

type Step = (typeof STEPS)[number]["key"];

interface Props {
  current: Step;
  hasVehicle: boolean;
}

export function BookingProgress({ current, hasVehicle }: Props) {
  const visibleSteps = STEPS.filter((s) => s.key !== "vehicle" || hasVehicle);
  const currentIdx = visibleSteps.findIndex((s) => s.key === current);

  return (
    <nav aria-label="Étapes de réservation">
      <ol className="flex items-center">
        {visibleSteps.map((step, idx) => {
          const done = idx < currentIdx;
          const active = idx === currentIdx;

          return (
            <li key={step.key} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors",
                    done
                      ? "border-primary bg-primary text-white"
                      : active
                      ? "border-primary bg-white text-primary"
                      : "border-muted bg-white text-muted-foreground"
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : idx + 1}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {idx < visibleSteps.length - 1 && (
                <div
                  className={cn(
                    "mx-2 mb-5 h-px flex-1",
                    idx < currentIdx ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
