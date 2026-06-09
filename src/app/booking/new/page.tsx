import { getSailingById } from "@/lib/operators/get-sailing";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { Header } from "@/components/layout/Header";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getString(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

export default async function BookingNewPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const outboundId = getString(sp.outboundId);
  const inboundId = getString(sp.inboundId);
  const adults = Number(getString(sp.adults) || "1");
  const children = Number(getString(sp.children) || "0");
  const infants = Number(getString(sp.infants) || "0");
  const vehicleCategory = getString(sp.vehicleCategory) || undefined;
  const vehicleLengthCm = sp.vehicleLengthCm
    ? Number(getString(sp.vehicleLengthCm))
    : undefined;

  if (!outboundId) {
    return <ErrorPage message="Aucune traversée sélectionnée." />;
  }

  const passengers = { adults, children, infants };
  const vehicle = vehicleCategory ? { category: vehicleCategory, lengthCm: vehicleLengthCm } : undefined;

  const [outbound, inbound] = await Promise.all([
    getSailingById(outboundId, passengers, vehicle),
    inboundId ? getSailingById(inboundId, passengers, vehicle) : Promise.resolve(null),
  ]);

  if (!outbound) {
    return <ErrorPage message="La traversée sélectionnée est introuvable ou n'est plus disponible." />;
  }

  return (
    <>
      <Header />
      <BookingFlow
        outbound={outbound}
        inbound={inbound ?? undefined}
        searchParams={{
          adults,
          children,
          infants,
          vehicleCategory,
          vehicleLengthCm,
        }}
      />
    </>
  );
}

function ErrorPage({ message }: { message: string }) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-4xl">⚓</p>
        <h1 className="mt-4 text-xl font-semibold">Réservation impossible</h1>
        <p className="mt-2 text-muted-foreground">{message}</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-md bg-primary px-6 py-2 text-sm font-medium text-white"
        >
          Nouvelle recherche
        </Link>
      </main>
    </>
  );
}
