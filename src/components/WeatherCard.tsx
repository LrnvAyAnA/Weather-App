import React, { useEffect, useState } from "react";
import "../styles/WeatherCard.css";
import SearchBar from "./SearchBar";

import { ReactComponent as Humidity } from "../assests/Humidity.svg";
import { ReactComponent as Wind } from "../assests/Wind.svg";
import {
  fetchCurrentWeather,
  fetchWeatherForecast,
  getCityByCoords,
} from "../weatherApi";
import {
  transformForecastData,
  DailyForecast,
} from "../utils/transformForecastData";
import { GooeySwitch } from "./GooeySwitch";
import ForecastCardList from "./ForecastCardList";
import { convertTemp } from "../utils/convertTemp";
import { getUserLocation } from "../utils/getUserLocation";
import { WeatherSkeleton } from "./WeatherSkeleton";
import { ForecastChart } from "./ForecastChart";

import { WeatherIcon } from "./WeatherIcon";
import { formatMainWeatherDate } from "../features/weather/weatherFormat";
import { TestIcon } from "./TestIcon";

interface CityOption {
  name: string;
  displayName: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

const WeatherCard: React.FC = () => {
  const [selectedCityName, setSelectedCityName] = useState<string>("");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCelsius, setIsCelsius] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 580);
  const [selectedDay, setSelectedDay] = useState<string | null>(
    new Date().toISOString().slice(0, 10),
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 580);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [dailyForecasts, setDailyForecasts] = useState<DailyForecast[]>([]);
  const [forecastData, setForecastData] = useState<any>(null);
  useEffect(() => {
    if (!forecastData) return;
    setDailyForecasts(transformForecastData(forecastData));
  }, [forecastData]);

  const handleForecast = async (lat: number, lon: number) => {
    try {
      const data = await fetchWeatherForecast(lat, lon);
      setForecastData(data);
      console.log("это дата", data);
    } catch (err) {
      console.error("Не удалось получить прогноз", err);
    }
  };

  const handleSearch = async (selectedCity: CityOption) => {
    setError(null);
    setWeatherData(null);
    setForecastData(null);
    setIsLoading(true);

    try {
      setSelectedCityName(
        `${selectedCity.displayName || selectedCity.name} • ${selectedCity.country}`,
      );
      const data = await fetchCurrentWeather(
        selectedCity.lat,
        selectedCity.lon,
      );
      setWeatherData(data);

      await handleForecast(selectedCity.lat, selectedCity.lon);
    } catch (err) {
      setError("Не удалось получить данные о погоде");
    } finally {
      setIsLoading(false);
    }
  };
  const handleDetectLocation = async () => {
    setError(null);
    setWeatherData(null);
    setForecastData([]);
    setIsLoading(true);

    try {
      const { lat, lon } = await getUserLocation();
      const data = await fetchCurrentWeather(lat, lon);
      setWeatherData(data);

      await handleForecast(lat, lon);
      const city = await getCityByCoords(lat, lon);
      if (city) {
        setSelectedCityName(`${city.displayName}, ${city.country}`);
      }
    } catch (err) {
      setError("Не удалось определить местоположение");
    } finally {
      setIsLoading(false);
    }
  };

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const update = () => setNow(Date.now());
    console.log("now updated:", new Date(now).toLocaleTimeString());
    const delay = 60000 - (Date.now() % 60000);

    let interval: NodeJS.Timeout;

    const timeout = setTimeout(() => {
      update();
      interval = setInterval(update, 60000);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, []);

  const isTodaySelected =
    selectedDay === new Date().toISOString().split("T")[0];

  return (
    <div className="wrapper">
      <div className="header-bar">
        <SearchBar
          onSearch={handleSearch}
          onLocationSearch={handleDetectLocation}
          setIsLoading={setIsLoading}
        />
        {!isMobile && (
          <GooeySwitch
            isCelsius={isCelsius}
            onToggle={() => setIsCelsius(!isCelsius)}
          />
        )}
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {isLoading ? (
        <WeatherSkeleton />
      ) : (
        weatherData && (
          <div className="grid">
            <div className="weather-main-info">
              <div className="weather-temp-info">
                <div className="city-date-info">
                  <div>
                    <div className="cityName">
                      <div>{selectedCityName}</div>
                    </div>
                    <div>
                      {formatMainWeatherDate(
                        weatherData.dt,
                        weatherData.timezone,
                      )}
                    </div>
                  </div>
                  {isMobile && (
                    <GooeySwitch
                      isCelsius={isCelsius}
                      onToggle={() => setIsCelsius(!isCelsius)}
                    />
                  )}
                </div>
                <div className="weather-temp">
                  {Math.round(convertTemp(weatherData.main.temp, isCelsius))}
                  {isCelsius ? "°C" : "°F"}
                </div>
                <div className="weather-description">
                  {weatherData?.weather?.[0]?.description || ""}
                </div>
                <div className="right-side">
                  <div className="humidity">
                    <Humidity />
                    <div>
                      Humidity <br /> {weatherData.main.humidity}%
                    </div>
                  </div>
                  <div className="wind">
                    <Wind />
                    <div>
                      Wind speed
                      <br /> {weatherData.wind.speed}m/s
                    </div>
                  </div>
                </div>
              </div>
              {/* <TestIcon /> */}
              <WeatherIcon type={weatherData.weather[0].main} size={300} />

              {dailyForecasts.length > 0 && (
                <ForecastCardList
                  forecasts={dailyForecasts.slice(0)}
                  isCelsius={isCelsius}
                  onSelect={setSelectedDay}
                  selectedDay={selectedDay}
                />
              )}
            </div>
          </div>
        )
      )}
      <ForecastChart
        data={forecastData?.list ?? []}
        isCelsius={isCelsius}
        timezone={forecastData?.city?.timezone ?? 0}
        showCurrentPoint={isTodaySelected}
        selectedDay={selectedDay}
        onSelectedDayChange={setSelectedDay}
      />
    </div>
  );
};

export default WeatherCard;
