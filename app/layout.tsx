import localFont from "next/font/local";
import type { Metadata, Viewport } from "next";

import AnalyticsComponent from "@/components/analytics";
import { Header, Footer } from "@/components/assets";

import "/node_modules/flag-icons/css/flag-icons.min.css";

import "the-new-css-reset/css/reset.css";
import "./globals.scss";

// global font-face
const Nexa = localFont({
  src: [
    {
      path: "../fonts/nexa_light.woff2",
      weight: "200",
    },
    {
      path: "../fonts/nexa_regular.woff2",
      weight: "400",
    },
    {
      path: "../fonts/nexa_bold.woff2",
      weight: "800",
    },
  ],

  style: "normal",
  display: "swap",
});

// global metadata (default values)
export const metadata: Metadata = {
  title: "Pogoda / klalo.pl",
  description: "Prosta aplikacja pogodowa z wykorzystaniem OpenWeatherMap API,",
  icons: {
    icon: "/favicon.ico",
  },
};

// global viewport
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "black",
};

// app project layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={Nexa.className}>
      <body>
        <AnalyticsComponent />

        <header>
          <section>
            <Header />
          </section>
        </header>

        <main>
          <section>{children}</section>
        </main>

        <footer>
          <section>
            <Footer />
          </section>
        </footer>
      </body>
    </html>
  );
}
