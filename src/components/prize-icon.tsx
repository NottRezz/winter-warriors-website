import {
  Candy,
  ChefHat,
  Clover,
  Coins,
  FerrisWheel,
  Flower2,
  Gift,
  LandPlot,
  Martini,
  Shirt,
  Trophy,
  Utensils,
} from "lucide-react";
import type { Prize } from "@/data/tournament";

/** Lucide has no hockey sticks, so these are drawn in the same style. */
function Sticks({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m6 2 9.2 15.3a2 2 0 0 0 1.7 1H22" />
      <path d="M18 2 8.8 17.3a2 2 0 0 1-1.7 1H2" />
      <path d="M10 22h4" />
    </svg>
  );
}

const ICONS = {
  candy: Candy,
  chef: ChefHat,
  clover: Clover,
  coins: Coins,
  dining: Utensils,
  drink: Martini,
  family: FerrisWheel,
  flower: Flower2,
  gift: Gift,
  golf: LandPlot,
  jersey: Shirt,
  sticks: Sticks,
  trophy: Trophy,
};

export function PrizeIcon({
  icon = "gift",
  className,
}: {
  icon?: Prize["icon"];
  className?: string;
}) {
  const Icon = ICONS[icon];
  return <Icon aria-hidden className={className} />;
}
