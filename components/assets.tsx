"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useState } from "react";
import axios, { AxiosError } from "axios";

import styles from "./assets.module.scss";

const appid = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

export function Header() {
  const router = useRouter();

  const [input, setInput] = useState<string>("");
  const [results, setResults] = useState<object[]>();

  // Search for cities by name
  const searching = (e: any) => {
    const { value } = e.target;

    setInput(value);
    if (!value) return setResults(undefined);

    // https://openweathermap.org/api/geocoding-api
    axios({
      method: "get",
      url: "https://api.openweathermap.org/geo/1.0/direct",
      params: {
        q: value,
        appid,
        limit: 5,
      },
    })
      .then(({ data }) => setResults(data))
      .catch((err: AxiosError) => console.error(err.message));
  };

  // Get weather data from API
  const getAPI = (lat: number, lon: number) => {
    // https://openweathermap.org/current
    return axios({
      method: "get",
      url: "https://api.openweathermap.org/data/2.5/weather",
      params: {
        lat,
        lon,
        appid,
        units: "metric",
        lang: "pl",
      },
    });
  };

  // Redirect to city weather page
  const Redirect = (result: any) => {
    const { lat, lon } = result;

    getAPI(lat, lon)
      .then(({ data }) => {
        router.push("/city/" + data.id);
        setResults(undefined);
      })
      .catch((err: AxiosError) => console.error(err.message));
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
      (position) => {
        const { latitude, longitude } = position.coords;

        getAPI(latitude, longitude)
          .then(({ data }) => {
            router.push("/city/" + data.id);
            setInput("");
            setResults(undefined);
          })
          .catch((err: AxiosError) => console.error(err.message));
      },
      (err) => console.error(err.message)
    );
  };

  return (
    <>
      <div>
        <Link className={styles.title} href="/">
          <h1>Pogoda</h1>
        </Link>

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
            onKeyDown={(e: any) => {
              if (e.key === "Enter") {
                getFirstResult();
                e.target.blur();
              }
            }}
          />

          <button onClick={getFirstResult}>Szukaj</button>

          {results && (
            <div className={styles.results}>
              {results.map((result: any, index: number) => (
                <div key={index} onClick={() => Redirect(result)}>
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

        <button onClick={CurrentLocation} title="Obecna lokalizacja urządzenia">
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
    </>
  );
}

export function Footer() {
  return (
    <>
      <p>
        Stworzone z <span>💙</span> przez{" "}
        <Link href="https://github.com/Quanosek">Jakuba Kłało</Link>
      </p>

      <p>Wszelkie prawa zastrzeżone &#169; 2023</p>
    </>
  );
}
