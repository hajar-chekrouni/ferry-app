"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { NormalisedSailing } from "@/lib/operators/types";
import {
  BookingOptions,
  BookingStep,
  ContactForm,
  DEFAULT_OPTIONS,
  PassengerForm,
  VehicleForm,
} from "@/lib/booking/types";
import { BookingProgress } from "./BookingProgress";
import { TripSummaryBar } from "./TripSummaryBar";
import { OptionsStep } from "./OptionsStep";
import { PassengersStep } from "./PassengersStep";
import { VehicleStep } from "./VehicleStep";
import { SummaryStep } from "./SummaryStep";

interface Props {
  outbound: NormalisedSailing;
  inbound?: NormalisedSailing;
  searchParams: {
    adults: number;
    children: number;
    infants: number;
    vehicleCategory?: string;
    vehicleLengthCm?: number;
  };
}

function buildInitialPassengers(
  adults: number,
  children: number,
  infants: number
): PassengerForm[] {
  const empty = (type: PassengerForm["type"]): PassengerForm => ({
    type,
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "",
    documentType: "passport",
    documentNumber: "",
  });

  return [
    ...Array.from({ length: adults }, () => empty("adult")),
    ...Array.from({ length: children }, () => empty("child")),
    ...Array.from({ length: infants }, () => empty("infant")),
  ];
}

export function BookingFlow({ outbound, inbound, searchParams }: Props) {
  const router = useRouter();
  const hasVehicle = !!searchParams.vehicleCategory;

  const [step, setStep] = useState<BookingStep>("options");
  const [options, setOptions] = useState<BookingOptions>(DEFAULT_OPTIONS);
  const [passengers, setPassengers] = useState<PassengerForm[]>(() =>
    buildInitialPassengers(
      searchParams.adults,
      searchParams.children,
      searchParams.infants
    )
  );
  const [vehicle, setVehicle] = useState<VehicleForm>({
    category: (searchParams.vehicleCategory as VehicleForm["category"]) ?? "car",
    plate: "",
    lengthCm: searchParams.vehicleLengthCm ?? 380,
    heightCm: undefined,
    brand: "",
    model: "",
  });
  const [contact, setContact] = useState<ContactForm>({ email: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const stepOrder: BookingStep[] = hasVehicle
    ? ["options", "passengers", "vehicle", "summary"]
    : ["options", "passengers", "summary"];

  const currentIdx = stepOrder.indexOf(step);

  const goNext = useCallback(() => {
    const next = stepOrder[currentIdx + 1];
    if (next) setStep(next);
  }, [currentIdx, stepOrder]);

  const goBack = useCallback(() => {
    const prev = stepOrder[currentIdx - 1];
    if (prev) setStep(prev);
  }, [currentIdx, stepOrder]);

  async function handleConfirm(finalContact: ContactForm) {
    setLoading(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outboundId: outbound.id,
          inboundId: inbound?.id,
          passengers,
          vehicle: hasVehicle ? vehicle : undefined,
          options,
          contact: finalContact,
          searchParams,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Erreur lors de la réservation");
      }

      router.push(`/booking/pay/${data.bookingId}`);
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Progress */}
        <BookingProgress current={step} hasVehicle={hasVehicle} />

        {/* Trip summary */}
        <div className="my-6">
          <TripSummaryBar outbound={outbound} inbound={inbound} />
        </div>

        {/* Step content */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          {step === "options" && (
            <OptionsStep
              options={options}
              outbound={outbound}
              hasReturn={!!inbound}
              onChange={setOptions}
              onNext={goNext}
            />
          )}
          {step === "passengers" && (
            <PassengersStep
              passengers={passengers}
              onChange={setPassengers}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === "vehicle" && hasVehicle && (
            <VehicleStep
              vehicle={vehicle}
              onChange={setVehicle}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {step === "summary" && (
            <SummaryStep
              outbound={outbound}
              inbound={inbound}
              passengers={passengers}
              vehicle={hasVehicle ? vehicle : undefined}
              options={options}
              contact={contact}
              onContactChange={setContact}
              onBack={goBack}
              onConfirm={handleConfirm}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
