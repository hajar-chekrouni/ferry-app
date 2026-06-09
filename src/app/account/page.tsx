import { Header } from "@/components/layout/Header";
import { AccountBookingsList } from "@/components/account/AccountBookingsList";
import { AccountHeader } from "@/components/account/AccountHeader";
import { getUser } from "@/lib/supabase/server";
import { getBookingRepository } from "@/lib/repositories/booking-repository";
import { bookingStore } from "@/lib/booking/store";
import type { StoredBooking } from "@/lib/booking/store";

export default async function AccountPage() {
  const user = await getUser();
  const repo = await getBookingRepository();

  let bookings: StoredBooking[] = [];

  if (user) {
    bookings = await repo.findByUserId(user.id);
  } else {
    // No auth configured — show all in-memory bookings (dev / demo mode)
    bookings = Array.from(bookingStore.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
          <AccountHeader user={user} />
          <AccountBookingsList bookings={bookings} />
        </div>
      </main>
    </>
  );
}
