"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

import styles from "./header.module.scss";

const appid = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

export default function HeaderComponent() {
  const router = useRouter();

  const [input, setInput] = useState<string>("");
  const [results, setResults] = useState<object[]>();

  // Search for cities by name
  const searching = (e: any) => {
    const { value } = e.target;

    setInput(value);
    if (!value) return setResults(undefined);

    // https://openweathermap.org/api/geocoding-api
    axios
      .get("https://api.openweathermap.org/geo/1.0/direct", {
        params: { q: value, limit: 5, appid },
      })
      .then(({ data }) => setResults(data))
      .catch((err) => console.error(err.message));
  };

  // Get weather data from API
  const getAPI = async (lat: number, lon: number) => {
    try {
      // https://openweathermap.org/current
      const { data } = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        { params: { lat, lon, appid, units: "metric", lang: "pl" } }
      );
      return data;
    } catch (err) {
      return console.error((err as Error).message);
    }
  };

  // Redirect to city weather page
  const Redirect = async (result: any) => {
    const { lat, lon } = result;

    await getAPI(lat, lon).then((data) => {
      router.push("/city/" + data.id);
      setResults(undefined);
    });
  };

  // Redirect to first result of list
  const getFirstResult = () => {
    if (!results) return;

    localStorage.removeItem("location");
    Redirect(results[0]);
  };

  // Redirect to current location weather page city id
  const CurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        await getAPI(latitude, longitude).then((data) => {
          router.replace("/city/" + data.id);
          setInput("");
          setResults(undefined);
        });
      },
      (err) => console.error(err.message)
    );
  };

  return (
    <section>
      <div>
        <div className={styles.title} onClick={() => router.replace("/")}>
          <h1>Pogoda</h1>
        </div>

        <div className={styles.search}>
          <input
            type="text"
            placeholder="Wpisz miasto"
            title="Rozpocznij wyszukiwanie przez wpisanie nazwy miasta"
            value={input}
            onInput={searching}
            onFocus={(e) => {
              if (input) searching(e);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                getFirstResult();
                (e.target as HTMLInputElement).blur();
              }
            }}
          />

          <button onClick={getFirstResult}>Szukaj</button>

          {results && (
            <div className={styles.results}>
              {results.map((result: any, i) => (
                <div key={i} onClick={() => Redirect(result)}>
                  <p>
                    {result.local_names
                      ? result.local_names.pl
                        ? result.local_names.pl
                        : result.name
                      : result.name}
                    {", "}
                    {result.state || ""} {result.country}
                  </p>

                  <span className={`fi fi-${result.country.toLowerCase()}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <button title="Obecna lokalizacja urządzenia" onClick={CurrentLocation}>
          <Image
            src="/icons/location.svg"
            alt="location"
            width={25}
            height={25}
            draggable={false}
          />
        </button>
      </div>

      <div>
        <button
          title="Widok pełnego ekranu"
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen();
            } else {
              document.exitFullscreen();
            }
          }}
        >
          <Image
            src="/icons/fullscreen.svg"
            alt="fullscreen"
            width={25}
            height={25}
            draggable={false}
          />
        </button>
      </div>
    </section>
  );
}
