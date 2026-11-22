import type { Metadata, Viewport } from "next";
import { Archivo, Geist } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { TabBar } from "@/components/tab-bar";
import { tournament } from "@/data/tournament";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${tournament.name} | ${tournament.division} Hockey Tournament`,
    template: `%s | ${tournament.name}`,
  },
  appleWebApp: { title: tournament.shortName, statusBarStyle: "black-translucent" },
  description: `${tournament.name} ${tournament.division} hockey tournament, ${tournament.dateLabel} at ${tournament.venue.name} in Calgary. Schedule, scores, teams and more.`,
};

export const viewport: Viewport = {
  themeColor: "#1c1226",
  // Lets the bars reach the screen edges. The safe-area insets keep content clear of notches.
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} ${geist.variable}`}>
      <body className="flex min-h-svh flex-col">
        <a
          href="#main"
          className="btn sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
        >
          Skip to content
        </a>
        {tournament.sampleData && (
          <p className="bg-bronze-300 px-4 py-1.5 text-center text-sm font-medium text-ink">
            Preview only: some details are sample content.
          </p>
        )}
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <TabBar />
      </body>
    </html>
  );
}
