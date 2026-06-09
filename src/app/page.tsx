import { SearchWidget } from "@/components/search/SearchWidget";
import { Header } from "@/components/layout/Header";
import { Anchor } from "lucide-react";

const FEATURED_ROUTES = [
  { from: "TNG", to: "ALG", label: "Tanger Med → Algésiras", emoji: "⚓" },
  { from: "TAV", to: "TAR", label: "Tanger → Tarifa", emoji: "🚢" },
  { from: "NAD", to: "AML", label: "Nador → Almería", emoji: "🌊" },
];

function today() {
  return new Date().toISOString().substring(0, 10);
}

export default function HomePage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 py-16 md:py-24">
        {/* Decorative waves */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 opacity-20">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 40 C360 80 720 0 1080 40 C1260 60 1380 20 1440 40 L1440 80 L0 80 Z"
              fill="white"
            />
          </svg>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Anchor className="h-8 w-8 text-white/80" />
            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
              FerryCompare
            </h1>
          </div>
          <p className="mb-10 text-lg text-white/80 md:text-xl">
            Comparez toutes les compagnies. Réservez en quelques clics.
          </p>

          <SearchWidget />
        </div>
      </section>

      {/* Featured routes */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        <h2 className="mb-6 text-center text-xl font-semibold">
          Liaisons populaires
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {FEATURED_ROUTES.map((r) => (
            <a
              key={`${r.from}-${r.to}`}
              href={`/search?from=${r.from}&to=${r.to}&date=${today()}&adults=1`}
              className="group flex flex-col items-center gap-3 rounded-xl border bg-white p-5 text-center shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
            >
              <span className="text-4xl">{r.emoji}</span>
              <span className="font-medium group-hover:text-primary">{r.label}</span>
              <span className="text-sm text-muted-foreground">Voir les traversées →</span>
            </a>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="bg-blue-50 py-12">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid gap-6 sm:grid-cols-3 text-center">
            {[
              { icon: "🔍", title: "Comparaison instantanée", desc: "Toutes les compagnies, tous les horaires sur une seule page." },
              { icon: "💶", title: "Meilleur prix garanti", desc: "Aucun frais cachés — prix final affiché dès la recherche." },
              { icon: "📱", title: "Billet électronique", desc: "QR code reçu par e-mail, prêt à l'embarquement." },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center gap-2">
                <span className="text-3xl">{item.icon}</span>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} FerryCompare — Données de traversées simulées (MVP)
      </footer>
    </>
  );
}
