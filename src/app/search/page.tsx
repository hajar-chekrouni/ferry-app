import { aggregateSearch } from "@/lib/search/aggregator";
import { SearchQuerySchema } from "@/lib/operators/types";
import { SearchResults } from "@/components/search/SearchResults";
import { Header } from "@/components/layout/Header";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getString(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

export default async function SearchPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const rawOutbound = {
    departurePortCode: getString(sp.from),
    arrivalPortCode: getString(sp.to),
    departureDate: getString(sp.date),
    passengers: {
      adults: Number(getString(sp.adults) || "1"),
      children: Number(getString(sp.children) || "0"),
      infants: Number(getString(sp.infants) || "0"),
    },
    vehicle:
      sp.vehicleCategory
        ? {
            category: getString(sp.vehicleCategory),
            lengthCm: sp.vehicleLengthCm ? Number(getString(sp.vehicleLengthCm)) : undefined,
          }
        : undefined,
  };

  const parsedOutbound = SearchQuerySchema.safeParse(rawOutbound);

  if (!parsedOutbound.success) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-md px-4 py-16 text-center">
          <p className="text-4xl">⚓</p>
          <h1 className="mt-4 text-xl font-semibold">Paramètres invalides</h1>
          <p className="mt-2 text-muted-foreground">
            Veuillez relancer une recherche depuis la page d&apos;accueil.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-md bg-primary px-6 py-2 text-sm font-medium text-white"
          >
            Retour à l&apos;accueil
          </Link>
        </main>
      </>
    );
  }

  const outbound = await aggregateSearch(parsedOutbound.data);

  // Round-trip: run a second search for the return leg
  let inbound = undefined;
  const returnDate = getString(sp.returnDate);
  if (returnDate) {
    const rawInbound = {
      departurePortCode: getString(sp.to),
      arrivalPortCode: getString(sp.from),
      departureDate: returnDate,
      passengers: parsedOutbound.data.passengers,
      vehicle: parsedOutbound.data.vehicle,
    };
    const parsedInbound = SearchQuerySchema.safeParse(rawInbound);
    if (parsedInbound.success) {
      inbound = await aggregateSearch(parsedInbound.data);
    }
  }

  const clientParams = {
    from: getString(sp.from),
    to: getString(sp.to),
    date: getString(sp.date),
    returnDate: returnDate || undefined,
    adults: parsedOutbound.data.passengers.adults,
    children: parsedOutbound.data.passengers.children ?? 0,
    infants: parsedOutbound.data.passengers.infants ?? 0,
    vehicleCategory: parsedOutbound.data.vehicle?.category,
    vehicleLengthCm: parsedOutbound.data.vehicle?.lengthCm,
  };

  return (
    <>
      <Header />
      <SearchResults
        outbound={outbound}
        inbound={inbound}
        searchParams={clientParams}
      />
    </>
  );
}
