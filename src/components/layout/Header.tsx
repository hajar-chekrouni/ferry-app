import Link from "next/link";
import { Anchor, Menu } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-blue-700">
          <Anchor className="h-5 w-5" />
          <span>FerryCompare</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm font-medium sm:flex">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Rechercher
          </Link>
          <Link
            href="/account"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Mes réservations
          </Link>
          <LanguageSwitcher />
        </nav>

        {/* Mobile: language switcher + hamburger placeholder */}
        <div className="flex items-center gap-2 sm:hidden">
          <LanguageSwitcher />
          <button
            aria-label="Menu"
            className="rounded-md p-2 text-muted-foreground hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
