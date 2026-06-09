import Link from "next/link";
import { Anchor } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg">
              <Anchor className="h-5 w-5 text-blue-400" />
              <span>FerryCompare</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              La plateforme de référence pour comparer et réserver vos traversées Maroc–Europe.
            </p>
          </div>

          {/* Liaisons */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Liaisons populaires</h3>
            <ul className="space-y-2 text-sm">
              {[
                ["Tanger Med → Algésiras", "/search?from=TNG&to=ALG"],
                ["Tanger → Tarifa", "/search?from=TAV&to=TAR"],
                ["Nador → Almería", "/search?from=NAD&to=AML"],
                ["Beni Ansar → Melilla", "/search?from=BNI&to=MOT"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Aide */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Aide</h3>
            <ul className="space-y-2 text-sm">
              {[
                ["FAQ", "#"],
                ["Conditions générales", "#"],
                ["Politique de confidentialité", "#"],
                ["Nous contacter", "#"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mon compte */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Mon espace</h3>
            <ul className="space-y-2 text-sm">
              {[
                ["Mes réservations", "/account"],
                ["Se connecter", "/auth/login"],
                ["Créer un compte", "/auth/signup"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-6 sm:flex-row">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} FerryCompare — Données de traversées simulées (MVP)
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <span>🇫🇷 Français</span>
            <span>|</span>
            <span>🇬🇧 English</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
