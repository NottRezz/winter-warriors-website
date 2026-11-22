import type { MetadataRoute } from "next";
import { tournament } from "@/data/tournament";
import { asset } from "@/lib/asset";

// Needed for a static export.
export const dynamic = "force-static";

/** Lets visitors add the site to their home screen and open it like an app. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: tournament.name,
    short_name: tournament.shortName,
    start_url: asset("/"),
    scope: asset("/"),
    display: "standalone",
    background_color: "#1c1226",
    theme_color: "#1c1226",
    icons: [192, 512].map((size) => ({
      src: asset(`/logos/app-${size}.png`),
      sizes: `${size}x${size}`,
      type: "image/png",
    })),
  };
}
