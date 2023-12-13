import Image from "next/image";

import moment from "moment";
import "moment/locale/pl";
moment().locale("pl");

import styles from "./weather.module.scss";

export default function Weather(params: { data: any }) {
  const data = params.data;

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

  const windDirection = (deg: number) => {
    let compassSector = [
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

  return (
    <>
      <div className={styles.currentHandler}>
        <div className={styles.current}>
          <p>
            {moment
              .utc(data.dt, "X")
              .add(data.timezone, "seconds")
              .format("dddd, DD MMMM YYYY • HH:mm:ss")}
          </p>

          <h2>
            {(localStorage.getItem("location") && (
              // default user location
              <>
                <Image
                  title="Miejscowość lokalizacji twojego urządzenia"
                  src="/icons/map_pin.svg"
                  alt="pin"
                  width={28}
                  height={28}
                  draggable={false}
                />
                {data.name}
              </>
            )) || (
              // location from search
              <>
                {data.name}, {data.sys.country}
                <span className={`fi fi-${data.sys.country.toLowerCase()}`} />
              </>
            )}
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
              {data.wind.speed.toFixed(1)}m/s {windDirection(data.wind.deg)}
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
            <p>Indeks jakości powietrza: {airCondition(data.air.main.aqi)}</p>
          </div>
        </div>

        <div>
          <iframe
            className={styles.map}
            name="windy-map"
            loading="eager"
            src={`https://embed.windy.com/embed2.html?lat=${data.coord.lat}&lon=${data.coord.lon}&detailLat=${data.coord.lat}&detailLon=${data.coord.lon}&zoom=7&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=m%2Fs&metricTemp=%C2%B0C&radarRange=-1`}
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
          style={{
            left: "-3rem",
          }}
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
          {data.forecast.map((item: any, index: number) => (
            <div key={index} className={styles.item}>
              <div className={styles.data}>
                <h4>
                  {moment
                    .utc(item.dt, "X")
                    .add(data.timezone, "seconds")
                    .format("HH:mm")}
                </h4>

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
              <h5>{item.main.temp.toFixed(0)}°C</h5>
            </div>
          ))}
        </div>

        <button
          style={{
            right: "-3rem",
          }}
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
  );
}
