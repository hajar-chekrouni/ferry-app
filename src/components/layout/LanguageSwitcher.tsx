"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(next: string) {
    // Replace locale prefix in current path
    const withoutLocale = pathname.replace(/^\/(fr|en)/, "") || "/";
    const newPath = next === "fr" ? withoutLocale : `/${next}${withoutLocale}`;
    router.push(newPath);
  }

  return (
    <div className="flex items-center gap-1">
      {(["fr", "en"] as const).map((l) => (
        <Button
          key={l}
          variant={locale === l ? "default" : "ghost"}
          size="sm"
          onClick={() => switchLocale(l)}
          className="h-7 px-2 text-xs uppercase"
        >
          {l}
        </Button>
      ))}
    </div>
  );
}
