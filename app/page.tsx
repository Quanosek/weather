"use client"; // for client-side only

import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import axios, { AxiosError } from "axios";

import moment from "moment";
import "moment/locale/pl";
moment().locale("pl");

import styles from "./page.module.scss";
import Weather from "../components/weather";

const KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY; // api key from .env.local

export default function Home() {
  // hook params
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<number | undefined>();

  const [data, setData] = useState<any>();
  const [results, setResults] = useState<object[]>();

  // get location data
  const locationData = useCallback(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      getData(latitude, longitude);

      localStorage.setItem("location", "true");
    });
  }, []);

  // show location weather on load
  useEffect(() => {
    locationData();
  }, [locationData]);

  const getData = async (lat: number, lon: number) => {
    setLoading(true);
    localStorage.removeItem("location");

    // all mayor data
    const current = await axios({
      method: "get",
      url: "https://api.openweathermap.org/data/2.5/weather",
      params: {
        lat,
        lon,
        units: "metric",
        lang: "pl",
        appid: KEY,
      },
    }).then(async ({ data }) => {
      // outdated city names correction
      return await axios({
        method: "get",
        url: "https://api.openweathermap.org/geo/1.0/reverse",
        params: {
          lat,
          lon,
          appid: KEY,
        },
      })
        .then((geo) => {
          data.name = geo.data[0].local_names
            ? geo.data[0].local_names.pl
              ? geo.data[0].local_names.pl
              : geo.data[0].name
            : geo.data[0].name;

          return data;
        })
        .catch((reason: AxiosError) => setError(reason.response!.status));
    });

    // air pollution data
    const air = await axios({
      method: "get",
      url: "https://api.openweathermap.org/data/2.5/air_pollution",
      params: {
        lat,
        lon,
        appid: KEY,
      },
    })
      .then(({ data }) => data.list[0])
      .catch((reason: AxiosError) => setError(reason.response!.status));

    // 5day / 3h forecast data
    const forecast = await axios({
      method: "get",
      url: "https://api.openweathermap.org/data/2.5/forecast",
      params: {
        lat,
        lon,
        units: "metric",
        lang: "pl",
        appid: KEY,
      },
    })
      .then(({ data }) => data.list)
      .catch((reason: AxiosError) => setError(reason.response!.status));

    // return all data
    setData({ ...current, air, forecast });

    setLoading(false);
  };

  const getResults = (e: any) => {
    if (!e.target.value) return setResults(undefined);

    axios({
      method: "get",
      url: "https://api.openweathermap.org/geo/1.0/direct",
      params: {
        q: e.target.value,
        limit: 5,
        appid: KEY,
      },
    })
      .then(({ data }) => setResults(data))
      .catch((reason: AxiosError) => setError(reason.response!.status));
  };

  const firstResult = () => {
    if (!results) return;
    if (!results[0]) return;

    const { lat, lon } = results[0] as any;
    getData(lat, lon);
    setResults(undefined);
  };

  // handle errors
  useEffect(() => {
    if (error) {
      alert(
        `Wystąpił błąd ${error}. ${
          error == 429
            ? "Osiągnięto limit zapytań, spróbuj ponownie później"
            : "Spróbuj ponownie później"
        }.`
      );
    }
  }, [error]);

  return (
    <>
      <header>
        <div className="responsiveHolder">
          <div>
            <h1>Pogoda</h1>

            <div className={styles.search}>
              <div className={styles.searchBox}>
                <input
                  type="text"
                  placeholder="Wpisz miasto"
                  id="search"
                  onFocus={(e) => {
                    e.target.select();
                  }}
                  onInput={getResults}
                  onKeyDown={(e: any) => {
                    if (e.key == "Enter") {
                      firstResult();
                      e.target.blur();
                    }
                  }}
                />
                <button onClick={firstResult}>Szukaj</button>
              </div>

              {results && (
                <div className={styles.results}>
                  {results.map((result: any, index: number) => (
                    <div
                      key={index}
                      className={styles.result}
                      onClick={() => {
                        getData(result.lat, result.lon);
                        setResults(undefined);
                      }}
                    >
                      <p>
                        {`${
                          result.local_names
                            ? result.local_names.pl
                              ? result.local_names.pl
                              : result.name
                            : result.name
                        }, `}
                        {result.state ? `${result.state}, ` : ""}
                        {result.country}
                      </p>

                      <span
                        className={`fi fi-${result.country.toLowerCase()}`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              title="Moja lokalizacja"
              onClick={() => {
                locationData();
                setResults(undefined);
                const serach = document.getElementById(
                  "search"
                ) as HTMLInputElement;
                serach.value = "";
              }}
            >
              <Image
                src="/icons/location.svg"
                alt="location"
                width={30}
                height={30}
                draggable={false}
              />
            </button>
          </div>

          <button
            title="Pełny ekran"
            onClick={() => {
              if (!document.fullscreenElement)
                document.documentElement.requestFullscreen();
              else document.exitFullscreen();
            }}
          >
            <Image
              src={`/icons/fullscreen.svg`}
              alt="fullscreen"
              width={30}
              height={30}
              draggable={false}
            />
          </button>
        </div>
      </header>

      {/* page */}
      <main style={{ backgroundImage: "url(/wallpaper.webp)" }}>
        <div className="responsiveHolder">
          {loading && (
            <div className={styles.loading}>
              <div className={styles.loader} />
              <h2>Ładowanie...</h2>
            </div>
          )}

          {!loading && (
            // weather data component
            <Weather data={data} />
          )}
        </div>
      </main>
    </>
  );
}
