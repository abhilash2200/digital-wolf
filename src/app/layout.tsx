import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EnquiryProvider } from "@/components/forms/EnquiryProvider";
import { LiquidEffects } from "@/components/liquid/LiquidEffects";
import { SITE } from "@/constants/site";
import "./globals.css";

// General Sans by Indian Type Foundry — ITF Free Font License (see src/fonts/FFL.txt).
const generalSans = localFont({
  src: "../fonts/GeneralSans-Variable.woff2",
  variable: "--font-general-sans",
  weight: "200 700",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.positioning}`,
  description: SITE.description,
  // TODO: add metadataBase + canonical once the production domain is confirmed.
  openGraph: {
    title: `${SITE.name} — ${SITE.positioning}`,
    description: SITE.description,
    siteName: SITE.name,
    type: "website",
    locale: "en_GB",
  },
};

export const viewport: Viewport = {
  themeColor: "#F8F8F6",
  colorScheme: "light",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${generalSans.variable} antialiased light`}
      style={{ colorScheme: "light", backgroundColor: "#F8F8F6", color: "#111111" }}
    >
      <body className="min-h-svh text-ink">
        <div aria-hidden="true" className="liquid-ambient" />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-60 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <EnquiryProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <LiquidEffects />
        </EnquiryProvider>
      </body>
    </html>
  );
}
