import React, { useEffect, useState } from 'react';
import '../styles/WeatherCard.css'
import SearchBar from './SearchBar';

import { ReactComponent as Humidity } from '../assests/Humidity.svg';
import { ReactComponent as Wind } from '../assests/Wind.svg';
import {fetchCurrentWeather, fetchWeatherForecast, getCityByCoords} from '../weatherApi';
import { transformForecastData, DailyForecast } from "../utils/transformForecastData";
import { GooeySwitch } from './GooeySwitch';
import ForecastCardList from './ForecastCardList';
import { formatDateShort } from '../utils/formatDate';
import { convertTemp } from "../utils/convertTemp";
import { getUserLocation } from '../utils/getUserLocation';
import WeatherSkeleton from './WeatherSkeleton';

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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 580);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
// useEffect(() => {
//   // Через 3 секунды выключим загрузку, чтобы увидеть переход
//   const timer = setTimeout(() => setIsLoading(false), 20000);
//   return () => clearTimeout(timer);
// }, []);

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
  } catch (err) {
    console.error("Не удалось получить прогноз", err);
  }
};

const handleSearch = async (selectedCity: CityOption) => {
  setError(null);
  setWeatherData(null);
  setForecastData([]);
  setIsLoading(true);

  try {
    setSelectedCityName(selectedCity.displayName || selectedCity.name);
    const data = await fetchCurrentWeather(selectedCity.lat, selectedCity.lon);
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
      setSelectedCityName(city.displayName);
    }
  } catch (err) {
    setError("Не удалось определить местоположение");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className='wrapper'>
        <div className='header-bar'>
          <SearchBar onSearch={handleSearch} onLocationSearch={handleDetectLocation}/>
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
          <div className='city-date-info'>
            <div>
              <div className="cityName">
            <div>{selectedCityName}</div>
          </div>
          <div>{formatDateShort(weatherData.dt)}</div>
              </div>
          {isMobile && (
              <GooeySwitch
                isCelsius={isCelsius}
                onToggle={() => setIsCelsius(!isCelsius)}
              />
            )}
          </div>
            <div className="weather-top">
              <div className="weather-main-info">
                <div className="weather-icon">
                  <img
                    src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                    alt={weatherData.weather[0].description}
                  />
                </div>
                <div className="weather-temp-info">
                  <div className="weather-temp">
                    {convertTemp(weatherData.main.temp, isCelsius)}
                    {isCelsius ? "°C" : "°F"}
                  </div>
                  <div className="weather-description">
                    {weatherData?.weather?.[0]?.description || ""}
                  </div>
                </div>
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
                    Wind speed<br /> {weatherData.wind.speed}m/s
                  </div>
                </div>
              </div>
            </div>
        </div>
      )
      )}
      {dailyForecasts.length > 0 && <ForecastCardList forecasts={dailyForecasts.slice(1)} isCelsius={isCelsius}/>}
      {/* <WeatherSkeleton /> */}
    </div>
  );
};

export default WeatherCard;