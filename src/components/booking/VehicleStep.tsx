"use client";

import { useState } from "react";
import { VehicleForm, VehicleFormSchema } from "@/lib/booking/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VEHICLE_TYPES } from "@/lib/seed/data";
import { cn } from "@/lib/utils";
import { Car } from "lucide-react";

interface Props {
  vehicle: VehicleForm;
  onChange: (v: VehicleForm) => void;
  onNext: () => void;
  onBack: () => void;
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <Label>
        {label}
        {required && " *"}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function VehicleStep({ vehicle, onChange, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<
    Partial<Record<keyof VehicleForm, string>>
  >({});

  function update<K extends keyof VehicleForm>(key: K, value: VehicleForm[K]) {
    onChange({ ...vehicle, [key]: value });
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate() {
    const result = VehicleFormSchema.safeParse(vehicle);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof VehicleForm, string>> = {};
      for (const [key, msgs] of Object.entries(
        result.error.flatten().fieldErrors
      )) {
        fieldErrors[key as keyof VehicleForm] = msgs?.[0];
      }
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Informations véhicule</h2>
        <p className="text-sm text-muted-foreground">
          Ces informations sont transmises à la compagnie pour l&apos;embarquement.
        </p>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>Type de véhicule *</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {VEHICLE_TYPES.map((vt) => (
            <button
              key={vt.id}
              type="button"
              onClick={() =>
                update("category", vt.category as VehicleForm["category"])
              }
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border p-3 text-sm transition-all",
                vehicle.category === vt.category
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "hover:border-primary/40"
              )}
            >
              <Car
                className={cn(
                  "h-6 w-6",
                  vehicle.category === vt.category
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              />
              <span className="text-center font-medium leading-tight">
                {vt.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Plaque d'immatriculation" required error={errors.plate}>
          <Input
            value={vehicle.plate}
            onChange={(e) => update("plate", e.target.value.toUpperCase())}
            placeholder="Ex: 12345-A-78 ou AB-123-CD"
            className="uppercase"
          />
        </Field>

        <Field label="Longueur (cm)" required error={errors.lengthCm}>
          <Input
            type="number"
            value={vehicle.lengthCm || ""}
            min={100}
            max={2000}
            onChange={(e) => update("lengthCm", Number(e.target.value))}
            placeholder="Ex: 420"
          />
        </Field>

        <Field label="Hauteur (cm)" error={errors.heightCm}>
          <Input
            type="number"
            value={vehicle.heightCm || ""}
            min={100}
            max={500}
            onChange={(e) =>
              update("heightCm", e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder="Ex: 155 (optionnel)"
          />
        </Field>

        <Field label="Marque" error={errors.brand}>
          <Input
            value={vehicle.brand ?? ""}
            onChange={(e) => update("brand", e.target.value)}
            placeholder="Ex: Renault"
          />
        </Field>

        <Field label="Modèle" error={errors.model}>
          <Input
            value={vehicle.model ?? ""}
            onChange={(e) => update("model", e.target.value)}
            placeholder="Ex: Clio"
          />
        </Field>
      </div>

      <p className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
        ℹ️ Présentez-vous au guichet d&apos;enregistrement au moins 90 min avant le
        départ avec votre véhicule et vos documents.
      </p>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Retour
        </Button>
        <Button onClick={() => validate() && onNext()} className="flex-1">
          Continuer
        </Button>
      </div>
    </div>
  );
}
