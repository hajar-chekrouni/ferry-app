import { PORTS } from "./seed/data";

export type PortOption = {
  code: string;
  name: string;
  city: string;
  countryCode: string;
  country: string;
  label: string; // "Tanger Med (TNG) — Maroc"
};

export const PORT_OPTIONS: PortOption[] = PORTS.map((p) => ({
  code: p.code,
  name: p.name,
  city: p.city,
  countryCode: p.countryCode,
  country: p.country,
  label: `${p.name} — ${p.country}`,
}));

export function findPort(code: string): PortOption | undefined {
  return PORT_OPTIONS.find((p) => p.code === code);
}
