/**
 * Realistic seed data for the Morocco-Spain ferry corridor.
 * All prices in EUR, times in local timezone noted per port.
 */

export const PORTS = [
  {
    id: "tanger-med",
    name: "Tanger Med",
    code: "TNG",
    city: "Ksar Sghir",
    country: "Maroc",
    countryCode: "MA",
    lat: 35.862,
    lng: -5.498,
    timezone: "Africa/Casablanca",
  },
  {
    id: "tanger-ville",
    name: "Tanger Ville",
    code: "TAV",
    city: "Tanger",
    country: "Maroc",
    countryCode: "MA",
    lat: 35.788,
    lng: -5.812,
    timezone: "Africa/Casablanca",
  },
  {
    id: "algeciras",
    name: "Algésiras",
    code: "ALG",
    city: "Algésiras",
    country: "Espagne",
    countryCode: "ES",
    lat: 36.131,
    lng: -5.449,
    timezone: "Europe/Madrid",
  },
  {
    id: "tarifa",
    name: "Tarifa",
    code: "TAR",
    city: "Tarifa",
    country: "Espagne",
    countryCode: "ES",
    lat: 36.014,
    lng: -5.605,
    timezone: "Europe/Madrid",
  },
  {
    id: "nador",
    name: "Nador",
    code: "NAD",
    city: "Nador",
    country: "Maroc",
    countryCode: "MA",
    lat: 35.178,
    lng: -2.928,
    timezone: "Africa/Casablanca",
  },
  {
    id: "almeria",
    name: "Almería",
    code: "AML",
    city: "Almería",
    country: "Espagne",
    countryCode: "ES",
    lat: 36.836,
    lng: -2.479,
    timezone: "Europe/Madrid",
  },
  {
    id: "sete",
    name: "Sète",
    code: "STE",
    city: "Sète",
    country: "France",
    countryCode: "FR",
    lat: 43.406,
    lng: 3.699,
    timezone: "Europe/Paris",
  },
  {
    id: "genova",
    name: "Gênes",
    code: "GEN",
    city: "Gênes",
    country: "Italie",
    countryCode: "IT",
    lat: 44.408,
    lng: 8.934,
    timezone: "Europe/Rome",
  },
] as const;

export const OPERATORS = [
  {
    id: "balearia",
    name: "Baleària",
    shortName: "Baleària",
    logoUrl: null,
    website: "https://www.balearia.com",
    description:
      "Compagnie valencienne spécialisée dans les liaisons Espagne-Maroc et les îles Baléares.",
  },
  {
    id: "frs",
    name: "FRS Iberia",
    shortName: "FRS",
    logoUrl: null,
    website: "https://www.frs.es",
    description:
      "Liaison rapide Tarifa-Tanger, pionnière du détroit depuis 1996.",
  },
  {
    id: "aml",
    name: "Africa Morocco Link",
    shortName: "AML",
    logoUrl: null,
    website: "https://www.aml.ma",
    description: "Compagnie nationale marocaine sur la liaison Tanger Med-Algésiras.",
  },
  {
    id: "gnv",
    name: "Grandi Navi Veloci",
    shortName: "GNV",
    logoUrl: null,
    website: "https://www.gnv.it",
    description: "GNV opère des liaisons longue distance Maroc-Italie/France.",
  },
  {
    id: "trasmediterranea",
    name: "Trasmediterránea",
    shortName: "Trasmed.",
    logoUrl: null,
    website: "https://www.trasmediterranea.es",
    description: "Historique du détroit, dessert plusieurs ports espagnols.",
  },
  {
    id: "intershipping",
    name: "Intershipping",
    shortName: "Intershipping",
    logoUrl: null,
    website: "https://www.intershipping.es",
    description: "Opérateur spécialisé sur la liaison Tanger Med-Algésiras.",
  },
] as const;

export type OperatorId = (typeof OPERATORS)[number]["id"];
export type PortId = (typeof PORTS)[number]["id"];

/**
 * Route definitions: operator, route, duration, ship type.
 * duration in minutes.
 */
export const ROUTES = [
  // ── Tanger Med ↔ Algésiras ──────────────────────────────────────────────
  {
    id: "balearia-tng-alg",
    operatorId: "balearia" as OperatorId,
    departurePortId: "tanger-med" as PortId,
    arrivalPortId: "algeciras" as PortId,
    durationMinutes: 90,
    shipType: "Ferry rapide",
    seasonal: false,
  },
  {
    id: "aml-tng-alg",
    operatorId: "aml" as OperatorId,
    departurePortId: "tanger-med" as PortId,
    arrivalPortId: "algeciras" as PortId,
    durationMinutes: 95,
    shipType: "Ferry mixte",
    seasonal: false,
  },
  {
    id: "trasmed-tng-alg",
    operatorId: "trasmediterranea" as OperatorId,
    departurePortId: "tanger-med" as PortId,
    arrivalPortId: "algeciras" as PortId,
    durationMinutes: 100,
    shipType: "Ferry grande capacité",
    seasonal: false,
  },
  {
    id: "intershipping-tng-alg",
    operatorId: "intershipping" as OperatorId,
    departurePortId: "tanger-med" as PortId,
    arrivalPortId: "algeciras" as PortId,
    durationMinutes: 90,
    shipType: "Ferry rapide",
    seasonal: false,
  },
  // ── Algésiras ↔ Tanger Med (return routes) ──────────────────────────────
  {
    id: "balearia-alg-tng",
    operatorId: "balearia" as OperatorId,
    departurePortId: "algeciras" as PortId,
    arrivalPortId: "tanger-med" as PortId,
    durationMinutes: 90,
    shipType: "Ferry rapide",
    seasonal: false,
  },
  {
    id: "aml-alg-tng",
    operatorId: "aml" as OperatorId,
    departurePortId: "algeciras" as PortId,
    arrivalPortId: "tanger-med" as PortId,
    durationMinutes: 95,
    shipType: "Ferry mixte",
    seasonal: false,
  },
  {
    id: "trasmed-alg-tng",
    operatorId: "trasmediterranea" as OperatorId,
    departurePortId: "algeciras" as PortId,
    arrivalPortId: "tanger-med" as PortId,
    durationMinutes: 100,
    shipType: "Ferry grande capacité",
    seasonal: false,
  },
  {
    id: "intershipping-alg-tng",
    operatorId: "intershipping" as OperatorId,
    departurePortId: "algeciras" as PortId,
    arrivalPortId: "tanger-med" as PortId,
    durationMinutes: 90,
    shipType: "Ferry rapide",
    seasonal: false,
  },
  // ── Tanger Ville ↔ Tarifa ───────────────────────────────────────────────
  {
    id: "frs-tav-tar",
    operatorId: "frs" as OperatorId,
    departurePortId: "tanger-ville" as PortId,
    arrivalPortId: "tarifa" as PortId,
    durationMinutes: 35,
    shipType: "Catamaran rapide",
    seasonal: false,
  },
  {
    id: "frs-tar-tav",
    operatorId: "frs" as OperatorId,
    departurePortId: "tarifa" as PortId,
    arrivalPortId: "tanger-ville" as PortId,
    durationMinutes: 35,
    shipType: "Catamaran rapide",
    seasonal: false,
  },
  // ── Nador ↔ Almería ─────────────────────────────────────────────────────
  {
    id: "balearia-nad-aml",
    operatorId: "balearia" as OperatorId,
    departurePortId: "nador" as PortId,
    arrivalPortId: "almeria" as PortId,
    durationMinutes: 420,
    shipType: "Ferry nuit",
    seasonal: false,
  },
  {
    id: "balearia-aml-nad",
    operatorId: "balearia" as OperatorId,
    departurePortId: "almeria" as PortId,
    arrivalPortId: "nador" as PortId,
    durationMinutes: 420,
    shipType: "Ferry nuit",
    seasonal: false,
  },
  // ── Tanger Med ↔ Sète (saisonnier) ─────────────────────────────────────
  {
    id: "gnv-tng-ste",
    operatorId: "gnv" as OperatorId,
    departurePortId: "tanger-med" as PortId,
    arrivalPortId: "sete" as PortId,
    durationMinutes: 1680, // 28h
    shipType: "Ferry grande croisière",
    seasonal: true,
  },
  {
    id: "gnv-ste-tng",
    operatorId: "gnv" as OperatorId,
    departurePortId: "sete" as PortId,
    arrivalPortId: "tanger-med" as PortId,
    durationMinutes: 1680,
    shipType: "Ferry grande croisière",
    seasonal: true,
  },
  // ── Tanger Med ↔ Gênes (saisonnier) ────────────────────────────────────
  {
    id: "gnv-tng-gen",
    operatorId: "gnv" as OperatorId,
    departurePortId: "tanger-med" as PortId,
    arrivalPortId: "genova" as PortId,
    durationMinutes: 2220, // ~37h
    shipType: "Ferry grande croisière",
    seasonal: true,
  },
  {
    id: "gnv-gen-tng",
    operatorId: "gnv" as OperatorId,
    departurePortId: "genova" as PortId,
    arrivalPortId: "tanger-med" as PortId,
    durationMinutes: 2220,
    shipType: "Ferry grande croisière",
    seasonal: true,
  },
] as const;

export type RouteId = (typeof ROUTES)[number]["id"];

/**
 * Base fares per route (adult passenger, no vehicle).
 * Vehicles add ~30-60 EUR depending on route/season.
 */
export const BASE_FARES: Record<RouteId, { adult: number; child: number; infant: number; vehicle: number }> = {
  "balearia-tng-alg": { adult: 42, child: 25, infant: 5, vehicle: 55 },
  "aml-tng-alg": { adult: 38, child: 22, infant: 5, vehicle: 50 },
  "trasmed-tng-alg": { adult: 36, child: 20, infant: 0, vehicle: 48 },
  "intershipping-tng-alg": { adult: 40, child: 24, infant: 5, vehicle: 52 },
  "balearia-alg-tng": { adult: 42, child: 25, infant: 5, vehicle: 55 },
  "aml-alg-tng": { adult: 38, child: 22, infant: 5, vehicle: 50 },
  "trasmed-alg-tng": { adult: 36, child: 20, infant: 0, vehicle: 48 },
  "intershipping-alg-tng": { adult: 40, child: 24, infant: 5, vehicle: 52 },
  "frs-tav-tar": { adult: 45, child: 30, infant: 0, vehicle: 0 }, // foot-only
  "frs-tar-tav": { adult: 45, child: 30, infant: 0, vehicle: 0 },
  "balearia-nad-aml": { adult: 78, child: 45, infant: 5, vehicle: 95 },
  "balearia-aml-nad": { adult: 78, child: 45, infant: 5, vehicle: 95 },
  "gnv-tng-ste": { adult: 155, child: 80, infant: 10, vehicle: 185 },
  "gnv-ste-tng": { adult: 155, child: 80, infant: 10, vehicle: 185 },
  "gnv-tng-gen": { adult: 175, child: 90, infant: 10, vehicle: 210 },
  "gnv-gen-tng": { adult: 175, child: 90, infant: 10, vehicle: 210 },
};

/** Departure schedule per route: list of HH:MM departure times */
export const SCHEDULES: Record<RouteId, string[]> = {
  "balearia-tng-alg": ["00:30", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"],
  "aml-tng-alg": ["01:00", "04:30", "07:30", "10:30", "13:30", "16:30", "19:30", "22:30"],
  "trasmed-tng-alg": ["02:00", "08:00", "14:00", "20:00"],
  "intershipping-tng-alg": ["05:00", "11:00", "17:00", "23:00"],
  "balearia-alg-tng": ["00:30", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"],
  "aml-alg-tng": ["01:00", "04:30", "07:30", "10:30", "13:30", "16:30", "19:30", "22:30"],
  "trasmed-alg-tng": ["02:00", "08:00", "14:00", "20:00"],
  "intershipping-alg-tng": ["05:00", "11:00", "17:00", "23:00"],
  "frs-tav-tar": ["07:00", "09:00", "11:00", "13:00", "15:00", "17:00", "19:00"],
  "frs-tar-tav": ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
  "balearia-nad-aml": ["22:00"],
  "balearia-aml-nad": ["22:00"],
  "gnv-tng-ste": ["18:00"],
  "gnv-ste-tng": ["18:00"],
  "gnv-tng-gen": ["16:00"],
  "gnv-gen-tng": ["16:00"],
};

export const VEHICLE_TYPES = [
  { id: "car-standard", category: "car", label: "Voiture (< 4m)", maxLengthCm: 400, maxHeightCm: 200, surchargeMultiplier: 1.0 },
  { id: "car-large", category: "car", label: "Voiture (4-5m)", maxLengthCm: 500, maxHeightCm: 220, surchargeMultiplier: 1.2 },
  { id: "motorcycle", category: "motorcycle", label: "Moto / scooter", maxLengthCm: 250, maxHeightCm: 180, surchargeMultiplier: 0.6 },
  { id: "van", category: "van", label: "Van / utilitaire (< 6m)", maxLengthCm: 600, maxHeightCm: 250, surchargeMultiplier: 1.8 },
  { id: "camper", category: "camper", label: "Camping-car (< 7.5m)", maxLengthCm: 750, maxHeightCm: 300, surchargeMultiplier: 2.5 },
] as const;

export const AMENITIES_BY_SHIP_TYPE: Record<string, string[]> = {
  "Ferry rapide": ["Cafétéria", "Bar", "WiFi", "Prises USB"],
  "Catamaran rapide": ["Bar", "WiFi"],
  "Ferry mixte": ["Restaurant", "Bar", "WiFi", "Cabines disponibles", "Salon VIP"],
  "Ferry grande capacité": ["Restaurant", "Bar", "WiFi", "Boutique hors-taxe", "Cabines", "Salon VIP", "Parking camions"],
  "Ferry nuit": ["Restaurant", "Bar", "WiFi", "Boutique hors-taxe", "Cabines intérieures/extérieures", "Salon VIP"],
  "Ferry grande croisière": ["Restaurant gastronomique", "Bar", "WiFi", "Boutique hors-taxe", "Cabines 4 cat.", "Salon VIP", "Piscine", "Animations"],
};
