"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";

import moment from "moment";
import "moment/locale/pl";
moment().locale("pl");

import styles from "./page.module.scss";

const appid = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

export default function Page({ params }: { params: { id: number } }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>();
  const [error, setError] = useState<string>();

  const getData = async (id: number) => {
    setLoading(true);

    // https://openweathermap.org/current
    const data = await axios
      .get("https://api.openweathermap.org/data/2.5/weather", {
        params: { id, appid, units: "metric", lang: "pl" },
      })
      .then(({ data }) => data)
      .catch((err) => console.error(err.message));

    if (!data) return setError("Nie znaleziono miasta o podanym ID");
    const { lat, lon } = data.coord;

    // https://openweathermap.org/api/geocoding-api
    const name = await axios
      .get("https://api.openweathermap.org/geo/1.0/reverse", {
        params: { lat, lon, limit: 1, appid },
      })
      .then(({ data }) => {
        const local = data[0].local_names.pl;
        if (local) return local;
        else return data[0].name;
      })
      .catch((err) => console.error(err.message));

    // https://openweathermap.org/api/air-pollution
    const air = await axios
      .get("https://api.openweathermap.org/data/2.5/air_pollution", {
        params: { lat, lon, appid },
      })
      .then(({ data }) => data.list[0])
      .catch((err) => console.error(err.message));

    // https://openweathermap.org/forecast5
    const forecast = await axios
      .get("https://api.openweathermap.org/data/2.5/forecast/", {
        params: { lat, lon, appid, units: "metric", lang: "pl" },
      })
      .then(({ data }) => data.list)
      .catch((err) => console.error(err.message));

    setData({ ...data, name, air, forecast });
    setLoading(false);
  };

  // on page load
  useEffect(() => {
    setLoading(true);
    getData(params.id);
  }, [params]);

  // wind description translate
  const windDirection = (deg: number) => {
    const compassSector = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
      "N",
    ];

    const index = (deg / 22.5).toFixed(0) as any;
    return compassSector[index];
  };

  // air condition index descriptions
  const airCondition = (index: number) => {
    switch (index) {
      case 1:
        return "Bardzo dobry";
      case 2:
        return "Dobry";
      case 3:
        return "Umiarkowany";
      case 4:
        return "Zły";
      case 5:
        return "Bardzo zły";
      default:
        return "Brak danych";
    }
  };

  if (error) return <p className="error">{error}</p>;

  return (
    <section>
      {/* loading screen component */}
      {loading && (
        <div className={styles.loader}>
          <div className={styles.spinner} />
          <h2>Ładowanie...</h2>
        </div>
      )}

      {/* weather data component */}
      <div
        style={{
          position: "relative",
          top: !loading ? 0 : "10vh",
          opacity: !loading ? 1 : 0,
          transition: "all 0.4s ease-out",
        }}
      >
        {!loading && (
          <>
            <div className={styles.container}>
              <div className={styles.current}>
                <p>
                  {moment
                    .utc(data.dt, "X")
                    .add(data.timezone, "seconds")
                    .format("dddd, DD MMMM YYYY • HH:mm:ss")}
                </p>

                <h2>
                  {data.name}, {data.sys.country}
                  <span className={`fi fi-${data.sys.country.toLowerCase()}`} />
                </h2>

                <div className={styles.tempHolder}>
                  <p className={styles.temperature}>
                    {data.main.temp.toFixed(0)}
                    <span className={styles.tempUnit}>°C</span>
                  </p>

                  <Image
                    src={`/weather/${data.weather[0].icon}.svg`}
                    alt="icon"
                    width={80}
                    height={80}
                    draggable={false}
                  />
                </div>

                <div>
                  <b>
                    {data.weather[0].description.charAt(0).toUpperCase() +
                      data.weather[0].description.slice(1)}
                  </b>

                  <p>
                    Odczuwalna: {data.main.feels_like.toFixed(0)}
                    <span className={styles.tempUnit}>°C</span>
                  </p>
                </div>

                <div>
                  <p>
                    <Image
                      className={styles.windDirection}
                      style={{ rotate: `${data.wind.deg}deg` }}
                      src="/icons/direction.svg"
                      alt="direction"
                      width={20}
                      height={20}
                      draggable={false}
                    />
                    {data.wind.speed.toFixed(1)}m/s{" "}
                    {windDirection(data.wind.deg)}
                  </p>
                  <p>Ciśnienie: {data.main.pressure}hPa</p>
                  <p>Wilgotność: {data.main.humidity}%</p>
                </div>

                <div>
                  <p>
                    Wschód słońca:{" "}
                    {moment
                      .utc(data.sys.sunrise, "X")
                      .add(data.timezone, "seconds")
                      .format("HH:mm")}
                  </p>
                  <p>
                    Zachód słońca:{" "}
                    {moment
                      .utc(data.sys.sunset, "X")
                      .add(data.timezone, "seconds")
                      .format("HH:mm")}
                  </p>
                </div>

                <div>
                  <p>Poziom zachmurzenia: {data.clouds.all}%</p>
                  <p>Widoczność: {(data.visibility / 1000).toFixed(1)}km</p>
                </div>

                <div>
                  <p>
                    Indeks jakości powietrza: {airCondition(data.air.main.aqi)}
                  </p>
                </div>
              </div>

              <div>
                <iframe
                  className={styles.map}
                  title="windy-map"
                  loading="eager"
                  src={`https://embed.windy.com/embed2.html?lat=${data.coord.lat}&lon=${data.coord.lon}&detailLat=${data.coord.lat}&detailLon=${data.coord.lon}&zoom=8&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=m%2Fs&metricTemp=%C2%B0C&radarRange=-1`}
                  onLoad={(e: any) => {
                    const style = e.target.style;
                    // show iframe only if fully loaded
                    style.opacity = 1;
                    style.filter = "contrast(125%) brightness(80%) blur(0)";
                    style.transition =
                      "0.15s filter ease-out, 0.4s opacity ease-in-out";
                  }}
                />
              </div>
            </div>

            <div className={styles.forecastHandler}>
              <button
                style={{ left: "-3rem" }}
                onClick={() => {
                  const scroll = document.getElementById(
                    "horizontal-scroll"
                  ) as HTMLElement;
                  scroll.scrollLeft -= 600;
                }}
              >
                {"<"}
              </button>

              <div id="horizontal-scroll" className={styles.forecast}>
                {data.forecast.map((item: any, i: number) => (
                  <div key={i} className={styles.item}>
                    <div className={styles.data}>
                      <h3>
                        {moment
                          .utc(item.dt, "X")
                          .add(data.timezone, "seconds")
                          .format("HH:mm")}
                      </h3>

                      <p>
                        {moment
                          .utc(item.dt, "X")
                          .add(data.timezone, "seconds")
                          .format("DD.MM")}
                      </p>
                    </div>

                    <Image
                      src={`/weather/${item.weather[0].icon}.svg`}
                      alt="icon"
                      width={60}
                      height={60}
                      draggable={false}
                    />
                    <h4>{item.main.temp.toFixed(0)}°C</h4>
                  </div>
                ))}
              </div>

              <button
                style={{ right: "-3rem" }}
                onClick={() => {
                  const scroll = document.getElementById(
                    "horizontal-scroll"
                  ) as HTMLElement;
                  scroll.scrollLeft += 600;
                }}
              >
                {">"}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
