"use client";

import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { GoogleAdSense } from "nextjs-google-adsense";

export default function AnalyticScripts() {
  return (
    <>
      {/* Vercel */}
      <Analytics />

      {/* Google */}
      <GoogleAnalytics
        gaMeasurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""}
        trackPageViews
      />
      <GoogleAdSense
        publisherId={process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || ""}
      />
    </>
  );
}
