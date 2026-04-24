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

import { ForecastData } from "../types/weather";
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
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 580);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [dailyForecasts, setDailyForecasts] = useState<DailyForecast[]>([]);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);

  useEffect(() => {
    if (!forecastData) return;

    const transformed = transformForecastData(forecastData);
    setDailyForecasts(transformed);

    if (transformed.length > 0) {
      setSelectedDay(transformed[0].date);
    }
  }, [forecastData]);


  if (!forecastData) return null;


  const filteredList =
    forecastData.list.filter((item) =>
      item.dt_txt.startsWith(selectedDay ?? ""),
    ) || [];

  const isTodaySelected = selectedDay === new Date().toISOString().split("T")[0];

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
      setSelectedCityName(`${selectedCity.displayName || selectedCity.name}`);
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
    setForecastData(null);
    setIsLoading(true);

    try {
      const { lat, lon } = await getUserLocation();
      const data = await fetchCurrentWeather(lat, lon);
      setWeatherData(data);

      await handleForecast(lat, lon);
      const city = await getCityByCoords(lat, lon);
      if (city) {
        setSelectedCityName(`${city.displayName}`);
      }
    } catch (err) {
      setError("Не удалось определить местоположение");
    } finally {
      setIsLoading(false);
    }
  };

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
                    <div>{formatMainWeatherDate(weatherData.dt)}</div>
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
        data={filteredList}
        isCelsius={isCelsius}
        timezone={forecastData.city.timezone}
        showCurrentPoint={isTodaySelected}
      />
    </div>
  );
};

export default WeatherCard;
