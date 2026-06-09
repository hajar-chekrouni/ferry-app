# FerryCompare — Plan de construction

> Dernière mise à jour : 2026-06-08

## Vision

Agrégateur de traversées en ferry inspiré de Direct Ferries.  
Périmètre MVP : Maroc ↔ Espagne / France / Italie.

---

## Architecture clé

- **Adaptateurs** : interface `FerryOperatorAdapter` → registre → `MockOperatorAdapter` (tous les opérateurs en seed)
- **Agrégation** : parallélisation + cache TTL court dans `aggregateSearch()`
- **Stack** : Next.js 16 (App Router) · TypeScript strict · Tailwind + shadcn/ui · Drizzle/Supabase · Stripe · Resend

---

## Phases

### ✅ Phase 0 — Mise en place
- [x] Projet Next.js 16 + TypeScript strict + Tailwind
- [x] shadcn/ui (composants manuels : Button, Input, Card, Label, Badge, Select, Separator)
- [x] Drizzle ORM + schéma DB complet
- [x] `drizzle.config.ts`
- [x] `.env.example` documenté
- [x] ESLint + Prettier configurés
- [x] `PLAN.md` créé

### ✅ Phase 1 — Données & adaptateurs
- [x] Schéma Drizzle : Port, Operator, Route, Sailing, Fare, VehicleType, Booking, BookingLeg, Passenger, Payment
- [x] Seed réaliste : 8 ports, 6 compagnies, 16 routes (TNG↔ALG, TAV↔TAR, NAD↔AML, TNG↔STE, TNG↔GEN)
- [x] Interface `FerryOperatorAdapter` + schémas Zod
- [x] `MockOperatorAdapter` : tarifs déterministes, disponibilité pseudo-aléatoire, horaires réels
- [x] Registre d'adaptateurs (`registry.ts`)
- [x] Service d'agrégation (`aggregateSearch`) avec cache TTL 60 s
- [x] Endpoint `GET /api/search` avec validation Zod

### 🔲 Phase 2 — Recherche & comparaison
- [ ] Widget de recherche (accueil) : ports, dates, passagers, véhicule
- [ ] Page `/search?...` — liste des résultats
- [ ] Filtres : prix min/max, durée, compagnie, heure de départ
- [ ] Tri : prix, heure départ, durée
- [ ] Gestion aller-retour (two-pass search)
- [ ] Skeleton loading + états vides

### 🔲 Phase 3 — Réservation
- [ ] Sélection traversée aller (+ retour si A/R)
- [ ] Sélection options : cabine, véhicule, animaux, repas, flexibilité
- [ ] Formulaire passagers + véhicule
- [ ] Récapitulatif + calcul du prix final

### ✅ Phase 4 — Paiement & billet
- [x] Stripe Checkout Session (mode test) + redirect
- [x] Webhook Stripe `checkout.session.completed` → `confirmed`
- [x] Mock payment endpoint (sans clé Stripe)
- [x] Page de paiement `/booking/pay/[bookingId]` (PaymentGate)
- [x] Page de confirmation complète + QR code intégré
- [x] Billet imprimable `/booking/ticket/[bookingId]` (HTML → print/PDF)
- [x] Génération QR code (`qrcode`, base64 PNG)
- [x] E-mail de confirmation HTML (Resend, stubbed si clé absente)
- [x] `bookingStore` global + `updateBookingStatus`

### 🔲 Phase 5 — Compte utilisateur
- [ ] Auth Supabase (email/password + OAuth)
- [ ] Page « Mes réservations »
- [ ] Détail réservation + billet
- [ ] Annulation en ligne

### 🔲 Phase 6 — Finitions
- [ ] i18n FR (défaut) / EN avec next-intl
- [ ] Responsive mobile-first
- [ ] Accessibilité (ARIA, focus, contrastes)
- [ ] Outils seed/admin minimaux
- [ ] Tests Vitest sur agrégateur + tarification

---

## Hypothèses et décisions

| # | Décision | Justification |
|---|----------|---------------|
| 1 | Seed en mémoire (pas de migrations en Phase 1) | Permet de tester le moteur sans Supabase configuré |
| 2 | Cache en `Map` en mémoire pour l'agrégateur | Suffisant pour le dev ; remplaçable par Redis en prod |
| 3 | Adaptateurs = `MockOperatorAdapter` pour tous | Déterminisme + facilité des tests |
| 4 | `proxy.ts` (Next.js 16) à la place de `middleware.ts` | Breaking change Next.js 16 |
| 5 | `params` / `searchParams` awaités | Breaking change Next.js 15+ |
