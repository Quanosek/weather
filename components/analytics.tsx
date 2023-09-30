"use client";

import { GoogleAnalytics } from "nextjs-google-analytics";
import { GoogleAdSense } from "nextjs-google-adsense";

export default function AnalyticsComponent() {
  return (
    <>
      <GoogleAnalytics trackPageViews />
      <GoogleAdSense publisherId="" />
    </>
  );
}
