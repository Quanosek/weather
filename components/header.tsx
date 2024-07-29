"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

import styles from "./header.module.scss";

const appid = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

export default function HeaderComponent() {
  const router = useRouter();
  const [mobileMenu, showMobileMenu] = useState<boolean>(false);

  const SearchBar = () => {
    const [input, setInput] = useState<string>("");
    const [results, setResults] = useState<object[]>();

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

    const redirect = async (result: any) => {
      const { lat, lon } = result;

      await getAPI(lat, lon).then((data) => {
        router.push("/city/" + data.id);
        setResults(undefined);
      });
    };

    const firstResult = () => {
      if (!results) return;
      localStorage.removeItem("location");
      redirect(results[0]);
    };

    return (
      <div className={styles.searchContainer}>
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
                firstResult();
                (e.target as HTMLInputElement).blur();
              }
            }}
          />

          <button onClick={firstResult}>Szukaj</button>

          {results && (
            <div className={styles.results}>
              {results.map((result: any, i) => (
                <div
                  key={i}
                  onClick={() => {
                    redirect(result);
                    setTimeout(() => showMobileMenu(false), 300);
                  }}
                >
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

        <button
          title="Obecna lokalizacja urządzenia"
          onClick={() => {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                const { latitude, longitude } = position.coords;

                await getAPI(latitude, longitude).then((data) => {
                  router.replace("/city/" + data.id);
                  setInput("");
                  setResults(undefined);
                  setTimeout(() => showMobileMenu(false), 300);
                });
              },
              (err) => console.error(err.message)
            );
          }}
        >
          <Image
            src="/icons/location.svg"
            alt="location"
            width={25}
            height={25}
            draggable={false}
          />
        </button>
      </div>
    );
  };

  return (
    <section>
      <button className={styles.title} onClick={() => router.replace("/")}>
        <h1>Pogoda</h1>
      </button>

      <div className={styles.desktop}>
        <SearchBar />

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

      <label tabIndex={1} htmlFor="check" className={styles.hamburger}>
        <input
          id="check"
          type="checkbox"
          onClick={() => showMobileMenu(!mobileMenu)}
          checked={mobileMenu}
        />
        <span />
        <span />
        <span />
      </label>

      <div
        className={styles.mobileMenu}
        style={{
          opacity: mobileMenu ? 1 : 0,
          visibility: mobileMenu ? "visible" : "hidden",
          height: mobileMenu ? "100vh" : 0,
        }}
      >
        <SearchBar />
      </div>
    </section>
  );
}
