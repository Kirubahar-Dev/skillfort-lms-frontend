import { Link } from "react-router-dom";

interface BrandLogoProps {
  compact?: boolean;
}

export function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <Link to="/" className="inline-flex items-center gap-2">
      <img
        src={compact ? "/skillfort-logo-mark.png" : "/skillfort-logo-full.jpg"}
        alt="Skillfort"
        className={compact ? "h-9 w-9 rounded-md object-cover" : "h-10 w-auto rounded-md object-contain"}
      />
      <span className="hidden text-xs font-medium text-sf-muted sm:block">LMS + Placement Platform</span>
    </Link>
  );
}