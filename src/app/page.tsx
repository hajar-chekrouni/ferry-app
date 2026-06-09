export const dynamic = "force-dynamic";

import { SearchWidget } from "@/components/search/SearchWidget";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const FEATURED_ROUTES = [
  {
    from: "TNG", to: "ALG",
    label: "Tanger Med → Algésiras",
    desc: "La liaison la plus rapide vers l'Espagne",
    duration: "35 min",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
  {
    from: "TAV", to: "TAR",
    label: "Tanger → Tarifa",
    desc: "Traversée directe vers la Costa de la Luz",
    duration: "1h",
    img: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80",
  },
  {
    from: "NAD", to: "AML",
    label: "Nador → Almería",
    desc: "Idéal pour voyager avec votre voiture",
    duration: "7h",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
  },
  {
    from: "BNI", to: "MOT",
    label: "Beni Ansar → Melilla",
    desc: "La courte traversée méditerranéenne",
    duration: "1h30",
    img: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=600&q=80",
  },
];

const OPERATORS = [
  { name: "Baleària", logo: "⚓", color: "bg-blue-50" },
  { name: "FRS Iberia", logo: "🚢", color: "bg-sky-50" },
  { name: "Baleària Eurolines", logo: "🌊", color: "bg-cyan-50" },
  { name: "Trasmediterránea", logo: "⛵", color: "bg-indigo-50" },
  { name: "Grandi Navi Veloci", logo: "🛳️", color: "bg-blue-50" },
  { name: "IMTC", logo: "🚤", color: "bg-teal-50" },
];

function today() {
  return new Date().toISOString().substring(0, 10);
}

export default function HomePage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1593001875024-02067c2f8c8e?w=1600&q=80')",
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-blue-800/60 to-blue-900/80" />

        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 py-20 text-center">
          <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-white drop-shadow md:text-6xl">
            Traversez la Méditerranée
          </h1>
          <p className="mb-10 text-lg text-white/85 md:text-xl">
            Comparez toutes les compagnies. Réservez en quelques clics.
          </p>
          <div className="rounded-2xl bg-white/95 p-6 shadow-2xl backdrop-blur">
            <SearchWidget />
          </div>
        </div>
      </section>

      {/* Featured routes */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-2 text-center text-3xl font-bold">Liaisons populaires</h2>
          <p className="mb-10 text-center text-muted-foreground">
            Les traversées les plus demandées au départ du Maroc
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_ROUTES.map((r) => (
              <a
                key={`${r.from}-${r.to}`}
                href={`/search?from=${r.from}&to=${r.to}&date=${today()}&adults=1`}
                className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-40 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.img}
                    alt={r.label}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute bottom-2 right-3 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-blue-700">
                    {r.duration}
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                    {r.label}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
                  <span className="mt-3 inline-block text-sm font-medium text-blue-600">
                    Voir les traversées →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-2 text-center text-3xl font-bold">Pourquoi choisir FerryCompare ?</h2>
          <p className="mb-12 text-center text-muted-foreground">
            La plateforme de référence pour les traversées Maroc–Europe
          </p>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "🔍",
                title: "Comparaison instantanée",
                desc: "Toutes les compagnies et horaires sur une seule page.",
              },
              {
                icon: "💶",
                title: "Prix transparents",
                desc: "Aucun frais cachés — prix final affiché dès la recherche.",
              },
              {
                icon: "📱",
                title: "Billet électronique",
                desc: "QR code reçu par e-mail, prêt à l'embarquement.",
              },
              {
                icon: "🛡️",
                title: "Réservation sécurisée",
                desc: "Paiement protégé et confirmation immédiate.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center gap-3 rounded-2xl border bg-white p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-3xl">
                  {item.icon}
                </span>
                <p className="font-semibold text-gray-900">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Operators */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="mb-2 text-3xl font-bold">Nos compagnies partenaires</h2>
          <p className="mb-10 text-muted-foreground">
            Nous comparons les offres de 6 compagnies maritimes
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {OPERATORS.map((op) => (
              <div
                key={op.name}
                className={`flex flex-col items-center gap-2 rounded-xl ${op.color} p-4 shadow-sm`}
              >
                <span className="text-3xl">{op.logo}</span>
                <span className="text-xs font-semibold text-gray-700">{op.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative overflow-hidden py-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-blue-900/75" />
        <div className="relative z-10 mx-auto max-w-2xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-extrabold text-white md:text-4xl">
            Prêt pour votre prochaine traversée ?
          </h2>
          <p className="mb-8 text-lg text-white/85">
            Recherchez, comparez et réservez en moins de 5 minutes.
          </p>
          <a
            href="/#recherche"
            className="inline-block rounded-full bg-white px-8 py-3 font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50"
          >
            Comparer maintenant
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
