"use client";

import { BookingOptions } from "@/lib/booking/types";
import { NormalisedSailing } from "@/lib/operators/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bed, PawPrint, UtensilsCrossed, RefreshCw, Armchair } from "lucide-react";

interface Props {
  options: BookingOptions;
  outbound: NormalisedSailing;
  hasReturn: boolean;
  onChange: (o: BookingOptions) => void;
  onNext: () => void;
}

const ACCOMMODATION_OPTIONS = [
  {
    value: "seat" as const,
    label: "Siège passager",
    desc: "Inclus dans le billet",
    price: 0,
    icon: <Armchair className="h-5 w-5" />,
  },
  {
    value: "interior_cabin" as const,
    label: "Cabine intérieure",
    desc: "Pour 2 pers., sans hublot",
    price: 45,
    icon: <Bed className="h-5 w-5" />,
  },
  {
    value: "exterior_cabin" as const,
    label: "Cabine extérieure",
    desc: "Pour 2 pers., avec hublot",
    price: 75,
    icon: <Bed className="h-5 w-5" />,
  },
];

function ToggleCard({
  active,
  onClick,
  icon,
  label,
  desc,
  price,
  suffix,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  desc: string;
  price?: number;
  suffix?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all",
        active
          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
          : "hover:border-primary/40 hover:bg-muted/50"
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          active ? "bg-primary text-white" : "bg-muted text-muted-foreground"
        )}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      {price !== undefined && (
        <div className="text-right">
          {price === 0 ? (
            <span className="text-sm text-green-600 font-medium">Inclus</span>
          ) : (
            <span className="text-sm font-semibold">
              +{price} €{suffix ? ` ${suffix}` : ""}
            </span>
          )}
        </div>
      )}
    </button>
  );
}

function Counter({
  value,
  onChange,
  min = 0,
  max = 9,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-7 w-7 items-center justify-center rounded-full border disabled:opacity-30"
      >
        −
      </button>
      <span className="w-4 text-center tabular-nums">{value}</span>
      <button
        type="button"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-7 w-7 items-center justify-center rounded-full border disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}

const hasAccommodation = (s: NormalisedSailing) =>
  s.amenities.some((a) => a.toLowerCase().includes("cabin") || a.toLowerCase().includes("cabine"));

export function OptionsStep({ options, outbound, hasReturn, onChange, onNext }: Props) {
  const showAccommodation = hasAccommodation(outbound);
  const legs = hasReturn ? 2 : 1;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Options de voyage</h2>
        <p className="text-sm text-muted-foreground">
          Personnalisez votre traversée. Ces options s&apos;appliquent à{" "}
          {legs === 2 ? "vos deux trajets" : "votre trajet"}.
        </p>
      </div>

      {/* Accommodation */}
      {showAccommodation && (
        <section className="space-y-3">
          <h3 className="font-medium">Hébergement à bord</h3>
          {ACCOMMODATION_OPTIONS.map((opt) => (
            <ToggleCard
              key={opt.value}
              active={options.accommodationType === opt.value}
              onClick={() =>
                onChange({
                  ...options,
                  accommodationType:
                    options.accommodationType === opt.value ? null : opt.value,
                })
              }
              icon={opt.icon}
              label={opt.label}
              desc={opt.desc}
              price={opt.price * legs}
              suffix={legs > 1 ? "A/R" : undefined}
            />
          ))}
        </section>
      )}

      {/* Extras */}
      <section className="space-y-3">
        <h3 className="font-medium">Extras</h3>

        {/* Pet */}
        <div
          className={cn(
            "rounded-xl border p-4 transition-all",
            options.hasPet ? "border-primary bg-primary/5 ring-2 ring-primary/20" : ""
          )}
        >
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                options.hasPet ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              )}
            >
              <PawPrint className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Animal de compagnie</p>
              <p className="text-sm text-muted-foreground">30 € / animal / trajet</p>
            </div>
            <div className="flex items-center gap-3">
              {options.hasPet && (
                <Counter
                  value={options.petCount}
                  min={1}
                  max={3}
                  onChange={(v) => onChange({ ...options, petCount: v })}
                />
              )}
              <input
                type="checkbox"
                checked={options.hasPet}
                onChange={(e) =>
                  onChange({
                    ...options,
                    hasPet: e.target.checked,
                    petCount: e.target.checked ? 1 : 0,
                  })
                }
                className="h-5 w-5 accent-primary"
              />
            </div>
          </div>
        </div>

        {/* Meal */}
        <div
          className={cn(
            "rounded-xl border p-4 transition-all",
            options.hasMeal ? "border-primary bg-primary/5 ring-2 ring-primary/20" : ""
          )}
        >
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                options.hasMeal ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              )}
            >
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Repas à bord</p>
              <p className="text-sm text-muted-foreground">15 € / repas / trajet</p>
            </div>
            <div className="flex items-center gap-3">
              {options.hasMeal && (
                <Counter
                  value={options.mealCount}
                  min={1}
                  max={10}
                  onChange={(v) => onChange({ ...options, mealCount: v })}
                />
              )}
              <input
                type="checkbox"
                checked={options.hasMeal}
                onChange={(e) =>
                  onChange({
                    ...options,
                    hasMeal: e.target.checked,
                    mealCount: e.target.checked ? 1 : 0,
                  })
                }
                className="h-5 w-5 accent-primary"
              />
            </div>
          </div>
        </div>

        {/* Flexible */}
        <ToggleCard
          active={options.isFlexible}
          onClick={() => onChange({ ...options, isFlexible: !options.isFlexible })}
          icon={<RefreshCw className="h-5 w-5" />}
          label="Billet flexible"
          desc="Modifiable / remboursable jusqu'à 24h avant le départ"
          price={undefined}
          suffix="+20% sur les tarifs passagers"
        />
        {options.isFlexible && (
          <p className="text-xs text-muted-foreground pl-2">
            ✓ Billet modifiable — surcharge de 20% sur le total passagers.
          </p>
        )}
      </section>

      <Button onClick={onNext} size="lg" className="w-full">
        Continuer — Informations passagers
      </Button>
    </div>
  );
}
