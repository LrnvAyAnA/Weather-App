import React, { useEffect, useState } from 'react';
import '../styles/WeatherCard.css'
import SearchBar from './SearchBar';
import { ReactComponent as Point } from '../assests/Point.svg';
import { ReactComponent as Humidity } from '../assests/Humidity.svg';
import { ReactComponent as Wind } from '../assests/Wind.svg';
import {fetchCurrentWeather, fetchWeatherForecast} from '../weatherApi';
import { transformForecastData, DailyForecast } from "../utils/transformForecastData";
import { GooeySwitch } from './GooeySwitch';
import ForecastCardList from './ForecastCardList';
import { formatDateShort } from '../utils/formatDate';

interface CityOption {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

const WeatherCard: React.FC = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCelsius, setIsCelsius] = useState(true);

const displayTemp = weatherData?.main
  ? isCelsius
    ? Math.round(weatherData.main.temp)
    : Math.round(weatherData.main.temp * 9/5 + 32)
  : "--";

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
    const data = await fetchCurrentWeather(selectedCity.lat, selectedCity.lon);
    setWeatherData(data);

    await handleForecast(selectedCity.lat, selectedCity.lon);
  } catch (err) {
    setError("Не удалось получить данные о погоде");
  }
};

  return (
    <div className='wrapper'>
        <SearchBar onSearch={handleSearch}/>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {weatherData && (
      <div className="weather-grid">
        <div className="city-date-info">
          <div className="cityName">
            <Point />
            <div>{weatherData.name}</div>
          </div>
          <div>{formatDateShort(weatherData.dt)}</div>
        </div>
        <GooeySwitch isCelsius={isCelsius} onToggle={() => setIsCelsius(!isCelsius)} />
        <div className="weather-icon">
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt={weatherData.weather[0].description}
          />
        </div>

      <div className="weather-main">
        <div>{displayTemp}°{isCelsius ? "C" : "F"}</div>
        <div className="description">{weatherData?.weather?.[0]?.description || ""}</div>
      </div>

        <div className="humidity">
          <Humidity/>
          <div>Влажность <br/>{weatherData.main.humidity}%</div>
        </div>

        <div className="wind">
          <Wind/>
          <div>Ветер <br/>{weatherData.wind.speed}м/с</div>
        </div>
      </div>
      )}
      {dailyForecasts.length > 0 && <ForecastCardList forecasts={dailyForecasts} />}
    </div>
  );
};

export default WeatherCard;