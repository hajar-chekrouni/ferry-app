"use client";

import { useState } from "react";
import { NormalisedSailing } from "@/lib/operators/types";
import { BookingOptions, PassengerForm, VehicleForm, ContactFormSchema, ContactForm } from "@/lib/booking/types";
import { computeCart, passengerLabel } from "@/lib/booking/cart";
import { formatPrice, formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Clock } from "lucide-react";

interface Props {
  outbound: NormalisedSailing;
  inbound?: NormalisedSailing;
  passengers: PassengerForm[];
  vehicle?: VehicleForm;
  options: BookingOptions;
  contact: ContactForm;
  onContactChange: (c: ContactForm) => void;
  onBack: () => void;
  onConfirm: (contact: ContactForm) => void;
  loading: boolean;
}

function SailingRow({ sailing, label }: { sailing: NormalisedSailing; label: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <div className="flex items-center gap-2 text-sm font-medium">
          {sailing.departurePort.code}
          <ArrowRight className="h-3 w-3" />
          {sailing.arrivalPort.code}
          <span className="text-muted-foreground">
            {sailing.departureAt.substring(11, 16)} →{" "}
            {sailing.arrivalAt.substring(11, 16)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {new Date(sailing.departureAt).toLocaleDateString("fr-FR", {
            weekday: "short",
            day: "numeric",
            month: "long",
          })}{" "}
          · {sailing.operatorName} ·{" "}
          <Clock className="inline h-3 w-3" /> {formatDuration(sailing.durationMinutes)}
        </p>
      </div>
    </div>
  );
}

export function SummaryStep({
  outbound,
  inbound,
  passengers,
  vehicle,
  options,
  contact,
  onContactChange,
  onBack,
  onConfirm,
  loading,
}: Props) {
  const [contactErrors, setContactErrors] = useState<
    Partial<Record<keyof ContactForm, string>>
  >({});

  const cart = computeCart(outbound, inbound, passengers, vehicle, options);

  function validateContact() {
    const result = ContactFormSchema.safeParse(contact);
    if (!result.success) {
      const errs: Partial<Record<keyof ContactForm, string>> = {};
      for (const [k, v] of Object.entries(result.error.flatten().fieldErrors)) {
        errs[k as keyof ContactForm] = (v as string[])[0];
      }
      setContactErrors(errs);
      return false;
    }
    setContactErrors({});
    return true;
  }

  function handleConfirm() {
    if (validateContact()) onConfirm(contact);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Récapitulatif de votre réservation</h2>
        <p className="text-sm text-muted-foreground">
          Vérifiez les détails avant de passer au paiement.
        </p>
      </div>

      {/* Trip */}
      <section className="rounded-xl border p-4 space-y-1">
        <h3 className="font-medium">Traversée(s)</h3>
        <SailingRow sailing={outbound} label="Aller" />
        {inbound && <SailingRow sailing={inbound} label="Retour" />}
      </section>

      {/* Passengers */}
      <section className="rounded-xl border p-4">
        <h3 className="mb-2 font-medium">
          Passagers ({passengers.length})
        </h3>
        <ul className="space-y-1">
          {passengers.map((p, i) => (
            <li key={i} className="flex items-center justify-between text-sm">
              <span>
                {p.firstName} {p.lastName}
              </span>
              <span className="text-muted-foreground">
                {passengerLabel(p.type)} · {p.documentType === "passport" ? "Passeport" : "CNI"}{" "}
                {p.documentNumber}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Vehicle */}
      {vehicle && (
        <section className="rounded-xl border p-4">
          <h3 className="mb-2 font-medium">Véhicule</h3>
          <div className="grid grid-cols-2 gap-1 text-sm">
            <span className="text-muted-foreground">Plaque</span>
            <span className="font-medium">{vehicle.plate}</span>
            <span className="text-muted-foreground">Type</span>
            <span className="capitalize">{vehicle.category}</span>
            {vehicle.brand && (
              <>
                <span className="text-muted-foreground">Véhicule</span>
                <span>
                  {vehicle.brand} {vehicle.model}
                </span>
              </>
            )}
            <span className="text-muted-foreground">Longueur</span>
            <span>{vehicle.lengthCm} cm</span>
          </div>
        </section>
      )}

      {/* Options summary */}
      {(options.accommodationType || options.hasPet || options.hasMeal || options.isFlexible) && (
        <section className="rounded-xl border p-4">
          <h3 className="mb-2 font-medium">Options sélectionnées</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {options.accommodationType && options.accommodationType !== "seat" && (
              <li>
                ✓{" "}
                {options.accommodationType === "interior_cabin"
                  ? "Cabine intérieure"
                  : "Cabine extérieure"}
              </li>
            )}
            {options.hasPet && (
              <li>
                ✓ Animal de compagnie × {options.petCount}
              </li>
            )}
            {options.hasMeal && <li>✓ Repas × {options.mealCount}</li>}
            {options.isFlexible && <li>✓ Billet flexible</li>}
          </ul>
        </section>
      )}

      {/* Price breakdown */}
      <section className="rounded-xl border p-4">
        <h3 className="mb-3 font-medium">Détail du prix</h3>
        <div className="space-y-2">
          {cart.lines.map((line, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{line.label}</span>
              <span className="font-medium">{formatPrice(line.amount)}</span>
            </div>
          ))}
        </div>
        <Separator className="my-3" />
        <div className="flex items-center justify-between font-bold">
          <span>Total</span>
          <span className="text-xl text-primary">{formatPrice(cart.total)}</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Taxes et frais de service inclus
        </p>
      </section>

      {/* Contact */}
      <section className="rounded-xl border p-4 space-y-4">
        <h3 className="font-medium">Contact & confirmation</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label>E-mail de confirmation *</Label>
            <Input
              type="email"
              value={contact.email}
              onChange={(e) =>
                onContactChange({ ...contact, email: e.target.value })
              }
              placeholder="vous@exemple.com"
            />
            {contactErrors.email && (
              <p className="text-xs text-destructive">{contactErrors.email}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label>Téléphone (optionnel)</Label>
            <Input
              type="tel"
              value={contact.phone ?? ""}
              onChange={(e) =>
                onContactChange({ ...contact, phone: e.target.value })
              }
              placeholder="+212 6XX XXX XXX"
            />
          </div>
        </div>
      </section>

      <p className="text-xs text-muted-foreground text-center">
        En cliquant sur « Payer », vous acceptez nos conditions générales de vente.
        Votre billet vous sera envoyé à l&apos;adresse e-mail indiquée après le paiement.
      </p>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Retour
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={loading}
          size="lg"
          className="flex-1"
        >
          {loading ? "Préparation…" : `Payer ${formatPrice(cart.total)}`}
        </Button>
      </div>
    </div>
  );
}
