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
  const [error, setError] = useState<string | null>(null);
  const [isCelsius, setIsCelsius] = useState(true);


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

  try {
    setSelectedCityName(selectedCity.displayName || selectedCity.name);
    const data = await fetchCurrentWeather(selectedCity.lat, selectedCity.lon);
    setWeatherData(data);

    await handleForecast(selectedCity.lat, selectedCity.lon);
  } catch (err) {
    setError("Не удалось получить данные о погоде");
  }
};
const handleDetectLocation = async () => {
  try {
    const { lat, lon } = await getUserLocation();
    const data = await fetchCurrentWeather(lat, lon);
    setWeatherData(data);

    await handleForecast(lat, lon);
    const city = await getCityByCoords(lat, lon);
    console.log("city:", city);
    if (city) {
      setSelectedCityName(city.displayName);
    }
  } catch (err) {
    setError("Не удалось определить местоположение");
  }
};

  return (
    <div className='wrapper'>
        <div className='header-bar'>
          <SearchBar onSearch={handleSearch} onLocationSearch={handleDetectLocation}/>
          <GooeySwitch isCelsius={isCelsius} onToggle={() => setIsCelsius(!isCelsius)} /> 
        </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {weatherData && (
        <div className="grid">
          <div className='city-date-info'>
            <div className="cityName">
            <div>{selectedCityName}</div>
          </div>
          <div>{formatDateShort(weatherData.dt)}</div>
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

      )}
      {dailyForecasts.length > 0 && <ForecastCardList forecasts={dailyForecasts.slice(1)} isCelsius={isCelsius}/>}
    </div>
  );
};

export default WeatherCard;