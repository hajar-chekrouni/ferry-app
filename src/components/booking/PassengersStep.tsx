"use client";

import { useState } from "react";
import { PassengerForm, PassengerFormSchema } from "@/lib/booking/types";
import { passengerLabel } from "@/lib/booking/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  passengers: PassengerForm[];
  onChange: (p: PassengerForm[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const NATIONALITIES = [
  "Marocaine", "Française", "Espagnole", "Italienne", "Belge",
  "Néerlandaise", "Britannique", "Allemande", "Autre",
];

function PassengerFormCard({
  index,
  passenger,
  onChange,
}: {
  index: number;
  passenger: PassengerForm;
  onChange: (p: PassengerForm) => void;
}) {
  const [open, setOpen] = useState(index === 0);
  const [errors, setErrors] = useState<Partial<Record<keyof PassengerForm, string>>>({});

  function update<K extends keyof PassengerForm>(key: K, value: PassengerForm[K]) {
    onChange({ ...passenger, [key]: value });
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  const isComplete =
    passenger.firstName.length >= 2 &&
    passenger.lastName.length >= 2 &&
    !!passenger.dateOfBirth &&
    !!passenger.nationality &&
    !!passenger.documentNumber;

  return (
    <div className={cn("rounded-xl border", open ? "border-primary/40" : "border-border")}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between p-4"
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
              isComplete
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground"
            )}
          >
            {isComplete ? "✓" : index + 1}
          </div>
          <div className="text-left">
            <p className="font-medium">
              {passenger.firstName && passenger.lastName
                ? `${passenger.firstName} ${passenger.lastName}`
                : `Passager ${index + 1}`}
            </p>
            <p className="text-xs text-muted-foreground">
              {passengerLabel(passenger.type)}
            </p>
          </div>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {open && (
        <div className="grid gap-4 border-t p-4 sm:grid-cols-2">
          <Field
            label="Prénom *"
            error={errors.firstName}
          >
            <Input
              value={passenger.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              placeholder="Prénom tel que sur le document"
              autoComplete="given-name"
            />
          </Field>

          <Field label="Nom *" error={errors.lastName}>
            <Input
              value={passenger.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              placeholder="Nom tel que sur le document"
              autoComplete="family-name"
            />
          </Field>

          <Field label="Date de naissance *" error={errors.dateOfBirth}>
            <Input
              type="date"
              value={passenger.dateOfBirth}
              max={new Date().toISOString().substring(0, 10)}
              onChange={(e) => update("dateOfBirth", e.target.value)}
            />
          </Field>

          <Field label="Nationalité *" error={errors.nationality}>
            <select
              value={passenger.nationality}
              onChange={(e) => update("nationality", e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Sélectionner…</option>
              {NATIONALITIES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Type de document *" error={errors.documentType}>
            <select
              value={passenger.documentType}
              onChange={(e) =>
                update("documentType", e.target.value as "passport" | "national_id")
              }
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="passport">Passeport</option>
              <option value="national_id">Carte nationale d&apos;identité</option>
            </select>
          </Field>

          <Field label="Numéro de document *" error={errors.documentNumber}>
            <Input
              value={passenger.documentNumber}
              onChange={(e) => update("documentNumber", e.target.value.toUpperCase())}
              placeholder="Ex: AB123456"
            />
          </Field>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-sm">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function PassengersStep({ passengers, onChange, onNext, onBack }: Props) {
  const [globalError, setGlobalError] = useState("");

  function validate() {
    for (let i = 0; i < passengers.length; i++) {
      const result = PassengerFormSchema.safeParse(passengers[i]);
      if (!result.success) {
        setGlobalError(
          `Passager ${i + 1} : ${Object.values(result.error.flatten().fieldErrors)[0]?.[0] ?? "Données incomplètes"}`
        );
        return false;
      }
    }
    setGlobalError("");
    return true;
  }

  function handleNext() {
    if (validate()) onNext();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Informations passagers</h2>
        <p className="text-sm text-muted-foreground">
          Renseignez les informations exactement comme elles apparaissent sur les documents officiels.
        </p>
      </div>

      <div className="space-y-3">
        {passengers.map((p, i) => (
          <PassengerFormCard
            key={i}
            index={i}
            passenger={p}
            onChange={(updated) => {
              const next = [...passengers];
              next[i] = updated;
              onChange(next);
            }}
          />
        ))}
      </div>

      {globalError && (
        <p className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {globalError}
        </p>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Retour
        </Button>
        <Button onClick={handleNext} className="flex-1">
          Continuer
        </Button>
      </div>
    </div>
  );
}
