import React, { useState } from 'react';
import '../styles/WeatherCard.css'
import SearchBar from './SearchBar';
import {fetchCurrentWeather, fetchWeatherForecast} from '../weatherApi';

interface CityOption {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

const WeatherCard: React.FC = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

const handleSearch = async (selectedCity: CityOption) => {
  setCity(`${selectedCity.name}, ${selectedCity.country}`);
  setError(null);
  setWeatherData(null);

  try {
    const data = await fetchCurrentWeather(selectedCity.lat, selectedCity.lon);
    setWeatherData(data);
  } catch (err) {
    setError("Не удалось получить данные о погоде");
  }
};

function getWeekday(dt: number): string {
  const date = new Date(dt * 1000); // UNIX timestamp → ms
  return date.toLocaleDateString("ru-RU", { weekday: "long" });
}

  return (
    <div className='wrapper'>
      <SearchBar onSearch={handleSearch} />
      
      {error && <p style={{ color: "red" }}>{error}</p>}
      {weatherData && (
  <div className="current-weather">
    <h2>{weatherData.name}</h2>
    <p>{getWeekday(weatherData.dt)}</p>

    <div className="weather-main">
      <img
        src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
        alt={weatherData.weather[0].description}
      />
      <p className="description">{weatherData.weather[0].description}</p>
    </div>

    <p>🌡 Температура: {Math.round(weatherData.main.temp)}°C</p>
    <p>💧 Влажность: {weatherData.main.humidity}%</p>
    <p>💨 Ветер: {weatherData.wind.speed} м/с</p>
  </div>
)}

    </div>
  );
};

export default WeatherCard;