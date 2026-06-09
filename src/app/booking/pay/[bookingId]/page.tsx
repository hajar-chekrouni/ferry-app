import { Header } from "@/components/layout/Header";
import { PaymentGate } from "@/components/booking/PaymentGate";
import { getBooking } from "@/lib/booking/store";
import Link from "next/link";

interface PageProps {
  params: Promise<{ bookingId: string }>;
  searchParams: Promise<{ cancelled?: string }>;
}

export default async function PayPage({ params, searchParams }: PageProps) {
  const { bookingId } = await params;
  const { cancelled } = await searchParams;

  const booking = getBooking(bookingId);

  if (!booking) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-md px-4 py-16 text-center">
          <p className="text-4xl">⚓</p>
          <h1 className="mt-4 text-xl font-semibold">Réservation introuvable</h1>
          <Link href="/" className="mt-6 inline-block rounded-md bg-primary px-6 py-2 text-sm font-medium text-white">
            Retour à l&apos;accueil
          </Link>
        </main>
      </>
    );
  }

  if (booking.status === "confirmed") {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-md px-4 py-16 text-center">
          <p className="text-4xl">✅</p>
          <h1 className="mt-4 text-xl font-semibold">Déjà payée</h1>
          <p className="mt-2 text-muted-foreground">Cette réservation est déjà confirmée.</p>
          <Link href={`/booking/confirm/${bookingId}`} className="mt-6 inline-block rounded-md bg-primary px-6 py-2 text-sm font-medium text-white">
            Voir ma confirmation
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <PaymentGate
        bookingId={bookingId}
        totalEur={booking.totalEur}
        cancelled={!!cancelled}
        contactEmail={booking.contact.email}
      />
    </>
  );
}
