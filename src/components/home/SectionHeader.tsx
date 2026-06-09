import { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  icon: ReactNode;
  iconColor: "blue" | "red" | "navy";
  title: string;
  subtitle: string;
  showArrows?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
}

const iconColorMap = {
  blue: "#2563EB",
  red: "#E8554D",
  navy: "#0F2549",
};

export function SectionHeader({ icon, iconColor, title, subtitle, showArrows, onPrev, onNext }: SectionHeaderProps) {
  return (
    <div className="mb-10 flex items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        {/* Icon square */}
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#E6EAF0] bg-white shadow-sm"
        >
          <span style={{ color: iconColorMap[iconColor] }}>{icon}</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900" style={{ fontSize: "32px" }}>
            {title}
          </h2>
          <p className="mt-1 text-sm" style={{ color: "#8A93A1" }}>
            {subtitle}
          </p>
        </div>
      </div>

      {/* Arrows */}
      {showArrows && (
        <div className="flex shrink-0 items-center gap-2 pt-1">
          <button
            onClick={onPrev}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E6EAF0] bg-white shadow-sm transition-shadow hover:shadow-md"
            aria-label="Précédent"
          >
            <ChevronLeft className="h-4 w-4" style={{ color: "#0F2549" }} />
          </button>
          <button
            onClick={onNext}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E6EAF0] bg-white shadow-sm transition-shadow hover:shadow-md"
            aria-label="Suivant"
          >
            <ChevronRight className="h-4 w-4" style={{ color: "#0F2549" }} />
          </button>
        </div>
      )}
    </div>
  );
}
