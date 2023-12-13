"use client";

import { GoogleAnalytics } from "nextjs-google-analytics";
import { GoogleAdSense } from "next-google-adsense";

export default function AnalyticsComponent() {
  return (
    <>
      {process.env.NODE_ENV !== "development" && (
        <>
          {/* https://analytics.google.com/ */}
          <GoogleAnalytics trackPageViews />

          {/* https://www.google.com/adsense/ */}
          <GoogleAdSense />
        </>
      )}
    </>
  );
}
