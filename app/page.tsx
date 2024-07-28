"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

const appid = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

export default function HomePage() {
  const router = useRouter();

  const [error, setError] = useState<string>();

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude: lat, longitude: lon } = position.coords;

      try {
        // https://openweathermap.org/current
        const { data } = await axios.get(
          "https://api.openweathermap.org/data/2.5/weather",
          { params: { lat, lon, appid, units: "metric", lang: "pl" } }
        );
        return router.replace("/city/" + data.id);
      } catch (err) {
        return console.error((err as Error).message);
      }
    },
    (err) => {
      setError("Nie przyznano uprawnień do lokalizacji.");
      console.error(err.message);
    }
  );

  if (error) return <p className="error">{error}</p>;
}
