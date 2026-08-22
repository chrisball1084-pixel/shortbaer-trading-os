import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return {
    name: "ShortBär Trading OS",
    short_name: "ShortBär",
    description: "System statt Intuition – persönlicher Trading-Workflow.",
    start_url: `${basePath}/`,
    scope: `${basePath}/`,
    display: "standalone",
    background_color: "#050b13",
    theme_color: "#07111f",
    orientation: "portrait",
    icons: [
      { src: `${basePath}/icon.svg`, sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: `${basePath}/icon-maskable.svg`, sizes: "any", type: "image/svg+xml", purpose: "maskable" }
    ]
  };
}
