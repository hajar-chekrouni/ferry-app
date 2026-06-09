import Link from "next/link";
import { Anchor } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-blue-700 text-lg">
          <Anchor className="h-5 w-5" />
          <span>FerryCompare</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 text-sm font-medium sm:flex">
          <Link href="/" className="text-gray-600 hover:text-blue-700 transition-colors">
            Accueil
          </Link>
          <Link href="/search?from=TNG&to=ALG&adults=1" className="text-gray-600 hover:text-blue-700 transition-colors">
            Traversées
          </Link>
          <Link href="/account" className="text-gray-600 hover:text-blue-700 transition-colors">
            Mes réservations
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="hidden text-sm font-medium text-gray-600 hover:text-blue-700 sm:block transition-colors"
          >
            Connexion
          </Link>
          <Link
            href="/"
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 transition-colors"
          >
            Réserver
          </Link>
        </div>
      </div>
    </header>
  );
}
