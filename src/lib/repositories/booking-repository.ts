import { StoredBooking, bookingStore, getBooking, saveBooking, updateBookingStatus } from "@/lib/booking/store";

// ─── Interface ────────────────────────────────────────────────────────────────

export interface BookingRepository {
  save(booking: StoredBooking): Promise<void>;
  findById(id: string): Promise<StoredBooking | null>;
  findByUserId(userId: string): Promise<StoredBooking[]>;
  update(id: string, updates: Partial<StoredBooking>): Promise<StoredBooking | null>;
  linkUser(bookingId: string, userId: string): Promise<void>;
}

// ─── In-memory implementation (no DB required) ────────────────────────────────

export class MemoryBookingRepository implements BookingRepository {
  async save(booking: StoredBooking): Promise<void> {
    saveBooking(booking);
  }

  async findById(id: string): Promise<StoredBooking | null> {
    return getBooking(id) ?? null;
  }

  async findByUserId(userId: string): Promise<StoredBooking[]> {
    return Array.from(bookingStore.values()).filter(
      (b) => (b as StoredBooking & { userId?: string }).userId === userId
    );
  }

  async update(id: string, updates: Partial<StoredBooking>): Promise<StoredBooking | null> {
    return updateBookingStatus(id, updates);
  }

  async linkUser(bookingId: string, userId: string): Promise<void> {
    updateBookingStatus(bookingId, { ...(getBooking(bookingId) ?? {}), userId } as Partial<StoredBooking>);
  }
}

// ─── Supabase implementation ──────────────────────────────────────────────────

export class SupabaseBookingRepository implements BookingRepository {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly supabase: any
  ) {}

  async save(booking: StoredBooking): Promise<void> {
    const { error } = await this.supabase.from("bookings_store").upsert({
      id: booking.id,
      status: booking.status,
      outbound_id: booking.outboundId,
      inbound_id: booking.inboundId ?? null,
      passengers: booking.passengers,
      vehicle: booking.vehicle ?? null,
      options: booking.options,
      contact: booking.contact,
      total_eur: booking.totalEur,
      stripe_session_id: booking.stripeSessionId ?? null,
      paid_at: booking.paidAt ?? null,
      user_id: (booking as StoredBooking & { userId?: string }).userId ?? null,
      created_at: booking.createdAt,
    });
    if (error) throw new Error(`Supabase save error: ${error.message}`);
  }

  async findById(id: string): Promise<StoredBooking | null> {
    const { data, error } = await this.supabase
      .from("bookings_store")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data) return null;
    return this.mapRow(data);
  }

  async findByUserId(userId: string): Promise<StoredBooking[]> {
    const { data, error } = await this.supabase
      .from("bookings_store")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map(this.mapRow);
  }

  async update(id: string, updates: Partial<StoredBooking>): Promise<StoredBooking | null> {
    const existing = await this.findById(id);
    if (!existing) return null;
    const merged = { ...existing, ...updates };
    await this.save(merged);
    return merged;
  }

  async linkUser(bookingId: string, userId: string): Promise<void> {
    await this.supabase
      .from("bookings_store")
      .update({ user_id: userId })
      .eq("id", bookingId);
  }

  private mapRow(row: Record<string, unknown>): StoredBooking {
    return {
      id: row.id as string,
      status: row.status as StoredBooking["status"],
      outboundId: row.outbound_id as string,
      inboundId: row.inbound_id as string | undefined,
      passengers: row.passengers as StoredBooking["passengers"],
      vehicle: row.vehicle as StoredBooking["vehicle"],
      options: row.options as StoredBooking["options"],
      contact: row.contact as StoredBooking["contact"],
      totalEur: row.total_eur as number,
      stripeSessionId: row.stripe_session_id as string | undefined,
      paidAt: row.paid_at as string | undefined,
      createdAt: row.created_at as string,
    };
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

let _repo: BookingRepository | null = null;

export async function getBookingRepository(): Promise<BookingRepository> {
  if (_repo) return _repo;

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    try {
      const { createSupabaseServerClient } = await import("@/lib/supabase/server");
      const supabase = await createSupabaseServerClient();
      _repo = new SupabaseBookingRepository(supabase);
    } catch {
      _repo = new MemoryBookingRepository();
    }
  } else {
    _repo = new MemoryBookingRepository();
  }

  return _repo;
}
