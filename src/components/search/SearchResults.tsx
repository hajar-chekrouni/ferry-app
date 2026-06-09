"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { NormalisedSailing } from "@/lib/operators/types";
import { SearchResult, SortKey } from "@/lib/search/aggregator";
import { FilterState, defaultFilters, applyFilters } from "@/lib/search/filters";
import { SailingCard, SailingCardSkeleton } from "./SailingCard";
import { FilterPanel } from "./FilterPanel";
import { SortBar } from "./SortBar";
import { SearchWidget } from "./SearchWidget";
import { Button } from "@/components/ui/button";
import { ArrowRight, SlidersHorizontal, X } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";

interface SearchParams {
  from: string;
  to: string;
  date: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  vehicleCategory?: string;
  vehicleLengthCm?: number;
}

interface Props {
  outbound: SearchResult;
  inbound?: SearchResult; // only for round trips
  searchParams: SearchParams;
}

export function SearchResults({ outbound, inbound, searchParams }: Props) {
  const router = useRouter();
  const [sort, setSort] = useState<SortKey>("price");
  const [filters, setFilters] = useState<FilterState>(defaultFilters());
  const [selectedOutbound, setSelectedOutbound] =
    useState<NormalisedSailing | null>(null);
  const [selectedInbound, setSelectedInbound] =
    useState<NormalisedSailing | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [step, setStep] = useState<"outbound" | "inbound" | "done">("outbound");

  const isRoundTrip = !!inbound;

  // Sort outbound results
  const sortedOutbound = useMemo(() => {
    const filtered = applyFilters(outbound.sailings, filters);
    return [...filtered].sort((a, b) => {
      if (sort === "price") return a.totalPriceEur - b.totalPriceEur;
      if (sort === "departure") return a.departureAt.localeCompare(b.departureAt);
      if (sort === "duration") return a.durationMinutes - b.durationMinutes;
      if (sort === "arrival") return a.arrivalAt.localeCompare(b.arrivalAt);
      return 0;
    });
  }, [outbound.sailings, filters, sort]);

  const sortedInbound = useMemo(() => {
    if (!inbound) return [];
    const filtered = applyFilters(inbound.sailings, filters);
    return [...filtered].sort((a, b) => {
      if (sort === "price") return a.totalPriceEur - b.totalPriceEur;
      if (sort === "departure") return a.departureAt.localeCompare(b.departureAt);
      if (sort === "duration") return a.durationMinutes - b.durationMinutes;
      if (sort === "arrival") return a.arrivalAt.localeCompare(b.arrivalAt);
      return 0;
    });
  }, [inbound, filters, sort]);

  const totalPrice =
    (selectedOutbound?.totalPriceEur ?? 0) +
    (selectedInbound?.totalPriceEur ?? 0);

  function handleSelectOutbound(s: NormalisedSailing) {
    setSelectedOutbound(s);
    if (isRoundTrip) {
      setStep("inbound");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleProceed() {
    if (!selectedOutbound) return;
    const params = new URLSearchParams({
      outboundId: selectedOutbound.id,
      ...(selectedInbound ? { inboundId: selectedInbound.id } : {}),
      ...Object.entries(searchParams).reduce(
        (acc, [k, v]) => (v !== undefined ? { ...acc, [k]: String(v) } : acc),
        {} as Record<string, string>
      ),
    });
    router.push(`/booking/new?${params.toString()}`);
  }

  const currentSailings = step === "inbound" ? sortedInbound : sortedOutbound;
  const currentLabel =
    step === "inbound"
      ? `Retour : ${searchParams.to} → ${searchParams.from}`
      : `Aller : ${searchParams.from} → ${searchParams.to}`;
  const currentDate =
    step === "inbound" ? searchParams.returnDate : searchParams.date;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact search bar at top */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <SearchWidget compact initialValues={searchParams} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Round-trip step indicator */}
        {isRoundTrip && (
          <div className="mb-4 flex items-center gap-3">
            <StepBadge
              label={`Aller`}
              date={searchParams.date}
              done={step !== "outbound"}
              active={step === "outbound"}
              selected={selectedOutbound}
              onClick={() => setStep("outbound")}
            />
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <StepBadge
              label="Retour"
              date={searchParams.returnDate}
              done={false}
              active={step === "inbound"}
              selected={selectedInbound}
              onClick={() => selectedOutbound && setStep("inbound")}
              disabled={!selectedOutbound}
            />
          </div>
        )}

        <div className="flex gap-6">
          {/* Filters — desktop sidebar */}
          <div className="hidden w-64 shrink-0 lg:block">
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              availableOperators={outbound.operators}
              maxPrice={outbound.maxPriceEur}
            />
          </div>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <h1 className="font-semibold">{currentLabel}</h1>
                {currentDate && (
                  <p className="text-sm text-muted-foreground">
                    {new Date(currentDate).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                )}
              </div>
              {/* Mobile filter toggle */}
              <button
                onClick={() => setShowFilters((v) => !v)}
                className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtres
              </button>
            </div>

            {/* Mobile filter panel */}
            {showFilters && (
              <div className="mb-4 rounded-xl border bg-white p-4 lg:hidden">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-medium">Filtres</span>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <FilterPanel
                  filters={filters}
                  onChange={setFilters}
                  availableOperators={outbound.operators}
                  maxPrice={outbound.maxPriceEur}
                />
              </div>
            )}

            <SortBar
              value={sort}
              onChange={setSort}
              count={currentSailings.length}
              className="mb-3"
            />

            {currentSailings.length === 0 ? (
              <EmptyState onReset={() => setFilters(defaultFilters())} />
            ) : (
              <div className="space-y-3">
                {currentSailings.map((sailing) => (
                  <SailingCard
                    key={sailing.id}
                    sailing={sailing}
                    selected={
                      step === "outbound"
                        ? selectedOutbound?.id === sailing.id
                        : selectedInbound?.id === sailing.id
                    }
                    onSelect={
                      step === "outbound"
                        ? handleSelectOutbound
                        : (s) => setSelectedInbound(s)
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky booking footer */}
      {(selectedOutbound || selectedInbound) && (
        <div className="sticky bottom-0 border-t bg-white shadow-lg">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
            <div>
              {selectedOutbound && (
                <p className="text-sm">
                  <span className="font-medium">Aller :</span>{" "}
                  {selectedOutbound.operatorName}{" "}
                  {selectedOutbound.departureAt.substring(11, 16)}
                </p>
              )}
              {selectedInbound && (
                <p className="text-sm">
                  <span className="font-medium">Retour :</span>{" "}
                  {selectedInbound.operatorName}{" "}
                  {selectedInbound.departureAt.substring(11, 16)}
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              {totalPrice > 0 && (
                <p className="text-xl font-bold text-primary">
                  {formatPrice(totalPrice)}
                </p>
              )}
              <Button
                onClick={handleProceed}
                disabled={isRoundTrip ? !selectedOutbound || !selectedInbound : !selectedOutbound}
                size="lg"
              >
                Continuer
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StepBadge({
  label,
  date,
  done,
  active,
  selected,
  onClick,
  disabled,
}: {
  label: string;
  date?: string;
  done: boolean;
  active: boolean;
  selected: NormalisedSailing | null;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex flex-col items-start rounded-xl border px-4 py-2 text-left transition-colors",
        active && "border-primary bg-primary/5",
        done && "border-green-200 bg-green-50",
        disabled && "opacity-40 cursor-not-allowed"
      )}
    >
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {selected ? (
        <span className="text-sm font-semibold">
          {selected.operatorName} · {selected.departureAt.substring(11, 16)} ·{" "}
          {formatPrice(selected.totalPriceEur)}
        </span>
      ) : (
        <span className="text-sm text-muted-foreground">
          {date
            ? new Date(date).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
              })
            : "—"}
        </span>
      )}
    </button>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
      <p className="text-4xl">⚓</p>
      <p className="font-medium">Aucune traversée ne correspond à vos filtres.</p>
      <button onClick={onReset} className="text-sm text-primary underline-offset-2 hover:underline">
        Effacer les filtres
      </button>
    </div>
  );
}
