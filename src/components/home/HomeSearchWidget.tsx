"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, ArrowLeftRight, Calendar, Users, Search } from "lucide-react";

const PORTS = [
  { code: "TNG", name: "Tanger Med" },
  { code: "TAV", name: "Tanger Ville" },
  { code: "NAD", name: "Nador" },
  { code: "BNI", name: "Beni Ansar" },
  { code: "ALG", name: "Algésiras" },
  { code: "TAR", name: "Tarifa" },
  { code: "AML", name: "Almería" },
  { code: "MOT", name: "Melilla" },
];

function today() {
  return new Date().toISOString().substring(0, 10);
}

export function HomeSearchWidget() {
  const router = useRouter();
  const [tripType, setTripType] = useState<"aller-retour" | "aller-simple">("aller-retour");
  const [from, setFrom] = useState("TNG");
  const [to, setTo] = useState("ALG");
  const [dateAller, setDateAller] = useState(today());
  const [dateRetour, setDateRetour] = useState("");
  const [adults, setAdults] = useState(1);

  function swap() {
    setFrom(to);
    setTo(from);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({ from, to, date: dateAller, adults: String(adults) });
    if (tripType === "aller-retour" && dateRetour) params.set("return", dateRetour);
    router.push(`/search?${params.toString()}`);
  }

  const selectClass =
    "w-full appearance-none rounded-lg border border-[#E6EAF0] bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400";

  return (
    <div className="rounded-2xl bg-white p-6 shadow-2xl" style={{ borderRadius: "16px" }}>
      {/* Top: trip type toggle */}
      <div className="mb-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTripType("aller-retour")}
          className="rounded-full px-4 py-1.5 text-sm font-semibold transition-colors"
          style={
            tripType === "aller-retour"
              ? { backgroundColor: "#0F2549", color: "#fff" }
              : { backgroundColor: "transparent", color: "#5B6573", border: "1px solid #E6EAF0" }
          }
        >
          Aller-retour
        </button>
        <button
          type="button"
          onClick={() => setTripType("aller-simple")}
          className="rounded-full px-4 py-1.5 text-sm font-semibold transition-colors"
          style={
            tripType === "aller-simple"
              ? { backgroundColor: "#0F2549", color: "#fff" }
              : { backgroundColor: "transparent", color: "#5B6573", border: "1px solid #E6EAF0" }
          }
        >
          Aller simple
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          {/* Départ */}
          <div className="flex-1">
            <label className="mb-1 flex items-center gap-1 text-xs font-medium" style={{ color: "#8A93A1" }}>
              <MapPin className="h-3.5 w-3.5" /> Départ
            </label>
            <select value={from} onChange={(e) => setFrom(e.target.value)} className={selectClass}>
              {PORTS.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap button */}
          <div className="flex justify-center md:pb-1">
            <button
              type="button"
              onClick={swap}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E6EAF0] bg-white shadow-sm transition-shadow hover:shadow-md"
              aria-label="Échanger départ et arrivée"
            >
              <ArrowLeftRight className="h-4 w-4" style={{ color: "#0F2549" }} />
            </button>
          </div>

          {/* Arrivée */}
          <div className="flex-1">
            <label className="mb-1 flex items-center gap-1 text-xs font-medium" style={{ color: "#8A93A1" }}>
              <MapPin className="h-3.5 w-3.5" /> Arrivée
            </label>
            <select value={to} onChange={(e) => setTo(e.target.value)} className={selectClass}>
              {PORTS.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date aller */}
          <div className="flex-1">
            <label className="mb-1 flex items-center gap-1 text-xs font-medium" style={{ color: "#8A93A1" }}>
              <Calendar className="h-3.5 w-3.5" /> Date aller
            </label>
            <input
              type="date"
              value={dateAller}
              onChange={(e) => setDateAller(e.target.value)}
              className={selectClass}
              min={today()}
            />
          </div>

          {/* Date retour */}
          {tripType === "aller-retour" && (
            <div className="flex-1">
              <label className="mb-1 flex items-center gap-1 text-xs font-medium" style={{ color: "#8A93A1" }}>
                <Calendar className="h-3.5 w-3.5" /> Date retour
              </label>
              <input
                type="date"
                value={dateRetour}
                onChange={(e) => setDateRetour(e.target.value)}
                className={selectClass}
                min={dateAller || today()}
              />
            </div>
          )}

          {/* Passagers */}
          <div className="w-full md:w-32">
            <label className="mb-1 flex items-center gap-1 text-xs font-medium" style={{ color: "#8A93A1" }}>
              <Users className="h-3.5 w-3.5" /> Passagers
            </label>
            <input
              type="number"
              value={adults}
              onChange={(e) => setAdults(Math.max(1, Number(e.target.value)))}
              min={1}
              max={20}
              className={selectClass}
            />
          </div>

          {/* Search button */}
          <div className="md:pb-0">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-colors md:w-auto"
              style={{ backgroundColor: "#0F2549" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#1A3563")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#0F2549")}
            >
              <Search className="h-4 w-4" />
              Rechercher
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
