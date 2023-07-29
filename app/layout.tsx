import localFont from "next/font/local";
import type { Metadata } from "next";
import Link from "next/link";

import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { GoogleAdSense } from "nextjs-google-adsense";

import "/node_modules/flag-icons/css/flag-icons.min.css";

// styles
import "./globals.scss";
import "the-new-css-reset/css/reset.css";

// font
const nexa = localFont({
  src: [
    {
      path: "./fonts/Nexa_ExtraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/Nexa_Heavy.woff2",
      weight: "600",
      style: "bold",
    },
  ],

  display: "swap",
});

// metadata
export const metadata: Metadata = {
  title: "Pogoda / klalo.pl",
  description: "Weather App built with Next.js",
};

// layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={nexa.className}>
      <body>
        {children}

        <Analytics />
        <GoogleAnalytics
          gaMeasurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""}
          trackPageViews
        />
        <GoogleAdSense
          publisherId={process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || ""}
        />

        <footer>
          <div className="responsiveHolder">
            <p>
              Stworzone z 💙 przez{" "}
              <Link href="https://github.com/Quanosek">Jakuba Kłało</Link>
            </p>

            <p>Wszelkie prawa zastrzeżone &#169; 2023</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
