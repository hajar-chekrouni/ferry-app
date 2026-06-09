import {
  pgTable,
  text,
  integer,
  real,
  timestamp,
  boolean,
  pgEnum,
  uuid,
  index,
} from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const sailingStatusEnum = pgEnum("sailing_status", [
  "scheduled",
  "boarding",
  "departed",
  "arrived",
  "cancelled",
]);

export const passengerTypeEnum = pgEnum("passenger_type", [
  "adult",
  "child",
  "infant",
]);

export const fareTypeEnum = pgEnum("fare_type", [
  "passenger",
  "vehicle",
  "cabin",
  "extra",
]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "cancelled",
  "refunded",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
  "refunded",
]);

export const vehicleCategoryEnum = pgEnum("vehicle_category", [
  "car",
  "motorcycle",
  "van",
  "truck",
  "camper",
]);

// ─── Core entities ────────────────────────────────────────────────────────────

export const ports = pgTable("ports", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  countryCode: text("country_code").notNull(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  timezone: text("timezone").notNull(),
});

export const operators = pgTable("operators", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  logoUrl: text("logo_url"),
  website: text("website"),
  description: text("description"),
});

export const routes = pgTable(
  "routes",
  {
    id: text("id").primaryKey(),
    operatorId: text("operator_id")
      .notNull()
      .references(() => operators.id),
    departurePortId: text("departure_port_id")
      .notNull()
      .references(() => ports.id),
    arrivalPortId: text("arrival_port_id")
      .notNull()
      .references(() => ports.id),
    durationMinutes: integer("duration_minutes").notNull(),
    shipType: text("ship_type"),
    seasonal: boolean("seasonal").default(false),
  },
  (t) => [
    index("routes_departure_idx").on(t.departurePortId),
    index("routes_arrival_idx").on(t.arrivalPortId),
  ]
);

export const sailings = pgTable(
  "sailings",
  {
    id: text("id").primaryKey(),
    routeId: text("route_id")
      .notNull()
      .references(() => routes.id),
    departureAt: timestamp("departure_at", { withTimezone: true }).notNull(),
    arrivalAt: timestamp("arrival_at", { withTimezone: true }).notNull(),
    totalSeats: integer("total_seats").notNull(),
    availableSeats: integer("available_seats").notNull(),
    status: sailingStatusEnum("status").notNull().default("scheduled"),
  },
  (t) => [
    index("sailings_route_dep_idx").on(t.routeId, t.departureAt),
  ]
);

export const fares = pgTable("fares", {
  id: text("id").primaryKey(),
  sailingId: text("sailing_id")
    .notNull()
    .references(() => sailings.id),
  type: fareTypeEnum("type").notNull(),
  label: text("label").notNull(),
  priceEur: real("price_eur").notNull(),
  conditions: text("conditions"),
  refundable: boolean("refundable").default(false),
  flexible: boolean("flexible").default(false),
});

export const vehicleTypes = pgTable("vehicle_types", {
  id: text("id").primaryKey(),
  category: vehicleCategoryEnum("category").notNull(),
  label: text("label").notNull(),
  maxLengthCm: integer("max_length_cm"),
  maxHeightCm: integer("max_height_cm"),
  surchargeMultiplier: real("surcharge_multiplier").notNull().default(1.0),
});

// ─── Booking ──────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  status: bookingStatusEnum("status").notNull().default("pending"),
  totalEur: real("total_eur").notNull(),
  currency: text("currency").notNull().default("EUR"),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const bookingLegs = pgTable("booking_legs", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id")
    .notNull()
    .references(() => bookings.id),
  sailingId: text("sailing_id")
    .notNull()
    .references(() => sailings.id),
  direction: text("direction").notNull(), // "outbound" | "inbound"
  vehicleTypeId: text("vehicle_type_id").references(() => vehicleTypes.id),
  vehiclePlate: text("vehicle_plate"),
  vehicleLengthCm: integer("vehicle_length_cm"),
  priceEur: real("price_eur").notNull(),
});

export const passengers = pgTable("passengers", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingLegId: uuid("booking_leg_id")
    .notNull()
    .references(() => bookingLegs.id),
  type: passengerTypeEnum("type").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: text("date_of_birth"),
  nationality: text("nationality"),
  documentType: text("document_type"),
  documentNumber: text("document_number"),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id")
    .notNull()
    .references(() => bookings.id),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeCheckoutSessionId: text("stripe_checkout_session_id"),
  status: paymentStatusEnum("status").notNull().default("pending"),
  amountEur: real("amount_eur").notNull(),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
