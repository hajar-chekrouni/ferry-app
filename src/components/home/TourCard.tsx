import { Clock, Users, Info } from "lucide-react";

interface TourCardProps {
  image: string;
  badge: string;
  title: string;
  duration: string;
  price: string;
}

export function TourCard({ image, badge, title, duration, price }: TourCardProps) {
  return (
    <div className="shrink-0 w-72 overflow-hidden rounded-xl border border-[#E6EAF0] bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image 4:3 */}
      <div className="relative" style={{ paddingTop: "75%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ borderRadius: "12px 12px 0 0" }}
        />
        {/* Badge */}
        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold shadow">
          <Clock className="h-3 w-3" style={{ color: "#E8554D" }} />
          <span style={{ color: "#0F2549" }}>{badge}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="font-bold text-gray-900" style={{ fontSize: "16px" }}>
          {title}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs" style={{ color: "#8A93A1" }}>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {duration}
          </span>
          <span className="font-semibold text-blue-600">{price}</span>
          <span className="flex items-center gap-1">
            <Info className="h-3 w-3" /> Guide inclus
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" /> Tous âges
          </span>
        </div>
      </div>
    </div>
  );
}
