export const dynamic = "force-dynamic";

import Link from "next/link";
import { Ship, Clock, Map, Building2, Newspaper, Car } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HomeSearchWidget } from "@/components/home/HomeSearchWidget";
import { SectionHeader } from "@/components/home/SectionHeader";
import { TourCard } from "@/components/home/TourCard";
import { FeatureRow } from "@/components/home/FeatureRow";

const TOUR_CARDS = [
  {
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    badge: "Quotidien 06:00",
    title: "Tanger Med → Algésiras",
    duration: "35 min",
    price: "À partir de 45€",
  },
  {
    image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80",
    badge: "Quotidien 08:00",
    title: "Tanger → Tarifa",
    duration: "1h",
    price: "À partir de 39€",
  },
  {
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    badge: "Lun, Mer, Ven",
    title: "Nador → Almería",
    duration: "7h",
    price: "À partir de 89€",
  },
  {
    image: "https://images.unsplash.com/photo-1545486332-9e0999c535b2?w=600&q=80",
    badge: "Quotidien 09:00",
    title: "Beni Ansar → Melilla",
    duration: "1h30",
    price: "À partir de 29€",
  },
];

const COMPANIES = [
  { name: "Baleària", logo: "⚓" },
  { name: "FRS Iberia", logo: "🚢" },
  { name: "Trasmediterránea", logo: "⛵" },
  { name: "Africa Morocco Link", logo: "🌊" },
  { name: "Baleària Eurolines", logo: "🛳️" },
  { name: "Intershipping", logo: "🚤" },
];

export default function HomePage() {
  return (
    <>
      <Header />

      {/* ── 1. Hero ── */}
      <section className="relative flex min-h-[620px] flex-col items-center justify-center overflow-hidden pb-28">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1600&q=80')",
          }}
        />
        {/* Overlay navy/70 */}
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(15,37,73,0.70)" }} />

        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 py-24 text-center">
          <h1
            className="mb-4 font-extrabold tracking-tight text-white"
            style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}
          >
            Traversez la Méditerranée
          </h1>
          <p className="mb-10 text-lg text-white/80">
            Comparez toutes les compagnies. Réservez en quelques clics.
          </p>
          <Link
            href="/search?adults=1"
            className="inline-block rounded-full bg-white px-7 py-3 font-semibold text-[#0F2549] shadow-lg transition hover:bg-gray-100"
          >
            Explorer les liaisons →
          </Link>
        </div>

        {/* Search widget floating on bottom edge */}
        <div className="absolute bottom-0 left-1/2 z-20 w-full max-w-5xl -translate-x-1/2 translate-y-1/2 px-4">
          <HomeSearchWidget />
        </div>
      </section>

      {/* ── 2. Tours (margin-top to compensate widget) ── */}
      <section className="pt-32 pb-20 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader
            icon={<Ship className="h-5 w-5" />}
            iconColor="red"
            title="Traversées populaires"
            subtitle="Les liaisons les plus demandées"
            showArrows
          />
          {/* Horizontal scroll carousel */}
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth">
            {TOUR_CARDS.map((card) => (
              <div key={card.title} className="snap-start">
                <TourCard {...card} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Feature Row ── */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <FeatureRow
            icon={<Clock className="h-7 w-7" />}
            title="Service quotidien toute l'année"
            text="Jusqu'à 12 traversées par jour entre le Maroc et l'Europe. Horaires mis à jour en temps réel."
            buttonLabel="Voir les horaires →"
            href="/search?from=TNG&to=ALG&adults=1"
            image="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80"
          />
        </div>
      </section>

      {/* ── 4. Explorez nos liaisons (bento grid) ── */}
      <section className="py-20" style={{ backgroundColor: "#F4F6F9" }}>
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader
            icon={<Map className="h-5 w-5" />}
            iconColor="blue"
            title="Explorez nos liaisons"
            subtitle="Toutes les routes disponibles"
          />

          {/* Row 1 */}
          <div className="grid grid-cols-3 gap-5 mb-5">
            {/* Large image card (2/3) */}
            <div className="col-span-2 relative overflow-hidden rounded-2xl min-h-[260px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                alt="Tanger Med"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-xl font-bold text-white mb-2">Tanger Med → Algésiras</p>
                <Link
                  href="/search?from=TNG&to=ALG&adults=1"
                  className="inline-block rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#0F2549] hover:bg-gray-100 transition"
                >
                  Réserver →
                </Link>
              </div>
            </div>

            {/* Info card (1/3) */}
            <div className="col-span-1 flex flex-col justify-between rounded-2xl border border-[#E6EAF0] bg-white p-8 shadow-sm">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#E6EAF0] bg-[#F4F6F9]">
                  <Map className="h-5 w-5 text-[#2563EB]" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Toutes les destinations</h3>
                <p className="text-sm text-[#5B6573]">Découvrez l'ensemble de nos liaisons Maroc–Europe.</p>
              </div>
              <Link
                href="/search?adults=1"
                className="mt-6 inline-block rounded-full bg-[#0F2549] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1A3563] transition"
              >
                Voir toutes →
              </Link>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-3 gap-5">
            {/* Info card (1/3) */}
            <div className="col-span-1 flex flex-col justify-between rounded-2xl border border-[#E6EAF0] bg-white p-8 shadow-sm">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#E6EAF0] bg-[#F4F6F9]">
                  <Car className="h-5 w-5 text-[#0F2549]" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Voyager avec son véhicule</h3>
                <p className="text-sm text-[#5B6573]">Embarquez votre voiture ou moto. Options disponibles sur la plupart des liaisons.</p>
              </div>
              <Link
                href="/search?adults=1"
                className="mt-6 inline-block rounded-full bg-[#0F2549] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1A3563] transition"
              >
                En savoir plus →
              </Link>
            </div>

            {/* Large image card (2/3) */}
            <div className="col-span-2 relative overflow-hidden rounded-2xl min-h-[260px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
                alt="Nador"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-xl font-bold text-white mb-2">Nador → Almería</p>
                <Link
                  href="/search?from=NAD&to=AML&adults=1"
                  className="inline-block rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#0F2549] hover:bg-gray-100 transition"
                >
                  Réserver →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Compagnies partenaires ── */}
      <section id="compagnies" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader
            icon={<Building2 className="h-5 w-5" />}
            iconColor="navy"
            title="Nos compagnies partenaires"
            subtitle="6 compagnies comparées en temps réel"
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {COMPANIES.map((c) => (
              <div
                key={c.name}
                className="flex flex-col items-center gap-3 rounded-xl border border-[#E6EAF0] bg-white p-5 shadow-sm transition-shadow hover:shadow-md cursor-pointer"
              >
                <span className="text-3xl">{c.logo}</span>
                <span className="text-center text-xs font-semibold text-gray-700">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Actualités & conseils ── */}
      <section className="py-20" style={{ backgroundColor: "#F4F6F9" }}>
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader
            icon={<Newspaper className="h-5 w-5" />}
            iconColor="blue"
            title="Actualités & conseils"
            subtitle="Préparez votre traversée"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {/* Article 1 */}
            <div className="overflow-hidden rounded-2xl border border-[#E6EAF0] bg-white shadow-sm">
              <div className="h-48 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80"
                  alt="Marhaba 2026"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-5">
                <p className="mb-1 text-xs text-[#8A93A1]">15 mai 2026</p>
                <h3 className="font-bold text-gray-900">Opération Marhaba 2026 : dates et conseils</h3>
                <p className="mt-2 text-sm text-[#5B6573]">Tout ce qu'il faut savoir pour préparer votre traversée estivale.</p>
                <Link href="#" className="mt-3 inline-block text-sm font-medium text-[#2563EB] hover:underline">
                  Lire l'article →
                </Link>
              </div>
            </div>

            {/* Article 2 */}
            <div className="overflow-hidden rounded-2xl border border-[#E6EAF0] bg-white shadow-sm">
              <div className="h-48 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80"
                  alt="Véhicule"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-5">
                <p className="mb-1 text-xs text-[#8A93A1]">3 avril 2026</p>
                <h3 className="font-bold text-gray-900">Voyager avec son véhicule : guide complet</h3>
                <p className="mt-2 text-sm text-[#5B6573]">Documents, tarifs et astuces pour embarquer votre voiture ou moto.</p>
                <Link href="#" className="mt-3 inline-block text-sm font-medium text-[#2563EB] hover:underline">
                  Lire l'article →
                </Link>
              </div>
            </div>

            {/* Conseils card */}
            <div className="rounded-2xl border border-[#E6EAF0] bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="mb-4 text-lg font-bold text-gray-900">Conseils de voyage</h3>
                <ul className="space-y-3">
                  {[
                    "Réservez à l'avance en haute saison",
                    "Munissez-vous de vos documents d'identité",
                    "Arrivez au port 1h avant l'embarquement",
                  ].map((tip) => (
                    <li key={tip} className="flex items-start gap-2 text-sm text-[#5B6573]">
                      <span className="mt-0.5 text-[#2563EB]">✓</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="#"
                className="mt-6 inline-block rounded-full border border-[#E6EAF0] px-5 py-2 text-sm font-semibold text-[#0F2549] hover:bg-[#F4F6F9] transition text-center"
              >
                Voir tous les articles →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. CTA Final ── */}
      <section className="relative overflow-hidden py-24">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(15,37,73,0.75)" }} />

        <div className="relative z-10 mx-auto max-w-5xl px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-extrabold text-white md:text-4xl">
              Prêt pour votre traversée ?
            </h2>
            <p className="text-lg text-white/80">
              Recherchez, comparez et réservez en moins de 5 minutes.
            </p>
          </div>
          <HomeSearchWidget />
        </div>
      </section>

      <Footer />
    </>
  );
}
