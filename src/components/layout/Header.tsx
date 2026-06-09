import Link from "next/link";
import { Anchor } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E6EAF0] bg-white shadow-sm" style={{ height: "64px" }}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg" style={{ color: "#0F2549" }}>
          <Anchor className="h-5 w-5" />
          <span>FerryCompare</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link href="/search?adults=1" className="transition-colors hover:text-blue-600" style={{ color: "#5B6573" }}>
            Traversées
          </Link>
          <Link href="/search?adults=1" className="transition-colors hover:text-blue-600" style={{ color: "#5B6573" }}>
            Liaisons
          </Link>
          <Link href="#compagnies" className="transition-colors hover:text-blue-600" style={{ color: "#5B6573" }}>
            Compagnies
          </Link>
          <Link href="/search?adults=1" className="transition-colors hover:text-blue-600" style={{ color: "#5B6573" }}>
            Tarifs
          </Link>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="hidden text-sm font-medium transition-colors hover:text-blue-600 md:block"
            style={{ color: "#5B6573" }}
          >
            Connexion
          </Link>
          <Link
            href="/search?adults=1"
            className="rounded-full px-5 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: "#0F2549" }}
          >
            Réserver
          </Link>
        </div>
      </div>
    </header>
  );
}
