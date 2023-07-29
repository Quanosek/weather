import localFont from "next/font/local";
import type { Metadata } from "next";
import Link from "next/link";

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
