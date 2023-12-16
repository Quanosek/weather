"use client";

import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";

const appid = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

export default function Home() {
  const router = useRouter();

  const [error, setError] = useState<string>();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // https://openweathermap.org/current
        return axios({
          method: "get",
          url: "https://api.openweathermap.org/data/2.5/weather",
          params: {
            lat: latitude,
            lon: longitude,
            appid,
            units: "metric",
            lang: "pl",
          },
        })
          .then(({ data }) => router.push("/city/" + data.id))
          .catch((err: AxiosError) => console.error(err.message));
      },
      (err) => {
        setError("Nie przyznano uprawnień do lokalizacji.");
        console.error(err.message);
      }
    );
  }, [router]);

  if (error) return <p className="error">{error}</p>;
}
