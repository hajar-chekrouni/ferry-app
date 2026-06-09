"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, MapPin, X } from "lucide-react";
import { PORT_OPTIONS, PortOption } from "@/lib/ports";
import { cn } from "@/lib/utils";

interface PortComboboxProps {
  value: string; // port code
  onChange: (code: string) => void;
  placeholder: string;
  exclude?: string; // code to hide (avoids picking same port twice)
  className?: string;
}

const FLAG: Record<string, string> = { MA: "🇲🇦", ES: "🇪🇸", FR: "🇫🇷", IT: "🇮🇹" };

export function PortCombobox({
  value,
  onChange,
  placeholder,
  exclude,
  className,
}: PortComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = PORT_OPTIONS.find((p) => p.code === value);

  const filtered = PORT_OPTIONS.filter((p) => {
    if (exclude && p.code === exclude) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.country.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  function select(port: PortOption) {
    onChange(port.code);
    setOpen(false);
    setQuery("");
  }

  function handleTriggerClick() {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 30);
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={handleTriggerClick}
        className={cn(
          "flex h-12 w-full items-center gap-2 rounded-md border border-input bg-background px-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          open && "ring-2 ring-ring"
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
        {selected ? (
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate font-medium">
              {FLAG[selected.countryCode] ?? ""} {selected.name}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {selected.city}, {selected.country}
            </span>
          </span>
        ) : (
          <span className="flex-1 text-muted-foreground">{placeholder}</span>
        )}
        {selected ? (
          <X
            className="h-4 w-4 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
          />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-md border bg-popover shadow-lg">
          <div className="p-2">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un port…"
              className="w-full rounded-sm border-0 bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <ul
            role="listbox"
            className="max-h-60 overflow-y-auto pb-1"
          >
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-muted-foreground">
                Aucun port trouvé
              </li>
            )}
            {filtered.map((port) => (
              <li
                key={port.code}
                role="option"
                aria-selected={port.code === value}
                onClick={() => select(port)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 px-3 py-2 text-sm hover:bg-accent",
                  port.code === value && "bg-accent/50"
                )}
              >
                <span className="text-base">{FLAG[port.countryCode] ?? "🏴"}</span>
                <span className="flex flex-col">
                  <span className="font-medium">{port.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {port.city} · {port.code}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
