import Link from "next/link";
import { Anchor } from "lucide-react";

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#0F2549" }} className="text-gray-300">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white">
              <Anchor className="h-5 w-5 text-blue-400" />
              <span>FerryCompare</span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: "#8A93A1" }}>
              La plateforme de référence pour comparer et réserver vos traversées Maroc–Europe.
            </p>
          </div>

          {/* Liaisons populaires */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Liaisons populaires</h3>
            <ul className="space-y-2 text-sm">
              {[
                ["Tanger Med → Algésiras", "/search?from=TNG&to=ALG&adults=1"],
                ["Tanger → Tarifa", "/search?from=TAV&to=TAR&adults=1"],
                ["Nador → Almería", "/search?from=NAD&to=AML&adults=1"],
                ["Beni Ansar → Melilla", "/search?from=BNI&to=MOT&adults=1"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="transition-colors hover:text-white" style={{ color: "#8A93A1" }}>
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
                  <Link href={href} className="transition-colors hover:text-white" style={{ color: "#8A93A1" }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mon espace */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Mon espace</h3>
            <ul className="space-y-2 text-sm">
              {[
                ["Mes réservations", "/account"],
                ["Se connecter", "/auth/login"],
                ["Créer un compte", "/auth/signup"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="transition-colors hover:text-white" style={{ color: "#8A93A1" }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row" style={{ borderColor: "#1A3563" }}>
          <p className="text-xs" style={{ color: "#8A93A1" }}>
            © {new Date().getFullYear()} FerryCompare — Données de traversées simulées (MVP)
          </p>
          <div className="flex gap-4 text-xs" style={{ color: "#8A93A1" }}>
            <span>🇫🇷 Français</span>
            <span>|</span>
            <span>🇬🇧 English</span>
            <span>|</span>
            <span>🇲🇦 العربية</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
