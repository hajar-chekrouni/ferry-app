import { ReactNode } from "react";
import Link from "next/link";

interface FeatureRowProps {
  icon: ReactNode;
  title: string;
  text: string;
  buttonLabel: string;
  href: string;
  image: string;
  reverse?: boolean;
}

export function FeatureRow({ icon, title, text, buttonLabel, href, image, reverse }: FeatureRowProps) {
  const content = (
    <div className="flex flex-col justify-center gap-6 py-8">
      {/* Icon square */}
      <div
        className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#E6EAF0] bg-white shadow-sm"
      >
        <span style={{ color: "#0F2549" }}>{icon}</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      <p className="leading-relaxed" style={{ color: "#5B6573" }}>
        {text}
      </p>
      <Link
        href={href}
        className="inline-flex w-fit items-center rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-colors"
        style={{ backgroundColor: "#0F2549" }}
      >
        {buttonLabel}
      </Link>
    </div>
  );

  const imageEl = (
    <div className="overflow-hidden rounded-2xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt={title} className="h-full w-full object-cover" style={{ maxHeight: "400px" }} />
    </div>
  );

  return (
    <div className={`grid gap-12 md:grid-cols-2 md:items-center`}>
      {reverse ? (
        <>
          {imageEl}
          {content}
        </>
      ) : (
        <>
          {content}
          {imageEl}
        </>
      )}
    </div>
  );
}
