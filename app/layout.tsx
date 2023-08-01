import localFont from "next/font/local";
import type { Metadata } from "next";
import Link from "next/link";

import "/node_modules/flag-icons/css/flag-icons.min.css";

import "./globals.scss";
import "the-new-css-reset/css/reset.css";

import Analytic from "../components/analytic";

const nexa = localFont({
  src: [
    {
      path: "./fonts/nexa_light.woff2",
      weight: "200",
    },
    {
      path: "./fonts/nexa_regular.woff2",
      weight: "400",
    },
    {
      path: "./fonts/nexa_bold.woff2",
      weight: "800",
    },
  ],

  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pogoda / klalo.pl",
  description: "Weather App built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={nexa.className}>
      <body>
        {children}

        {/* show analytics only in production */}
        {process.env.NODE_ENV !== "development" && <Analytic />}

        <footer>
          <div className="responsiveHolder">
            <p>
              Stworzone z <span>💙</span> przez{" "}
              <Link href="https://github.com/Quanosek">Jakuba Kłało</Link>
            </p>

            <p>Wszelkie prawa zastrzeżone &#169; 2023</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
