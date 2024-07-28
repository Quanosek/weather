import Link from "next/link";
import type { Metadata, Viewport } from "next";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import Analytics from "@/components/analytics";
import Header from "@/components/header";

import "the-new-css-reset/css/reset.css";
import "./globals.scss";

// global font-face
import localFont from "next/font/local";
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
  description:
    "Prosta aplikacja pogodowa stworzona z wykorzystaniem publicznego API map OpenWeather.",
  icons: {
    icon: ["/favicons/favicon.ico", "/favicons/icon.svg"],
    apple: "/favicons/apple-icon.png",
  },
};

// global viewport
export const viewport: Viewport = {
  themeColor: "#000000",
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
        {process.env.NODE_ENV !== "development" && <Analytics />}

        <header>
          <Header />
        </header>

        <main>
          <section>{children}</section>
        </main>

        <footer>
          <section>
            <p>
              Stworzone z <span>💙</span> przez{" "}
              <Link href="https://github.com/Quanosek">Jakuba Kłało</Link>
            </p>

            <p>
              Wszelkie prawa zastrzeżone &#169; 2023-{new Date().getFullYear()}{" "}
              | <Link href="https://www.klalo.pl">domena klalo.pl</Link>
            </p>
          </section>
        </footer>
      </body>
    </html>
  );
}
