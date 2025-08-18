import React, { useState } from 'react';
import '../styles/WeatherCard.css'
import SearchBar from './SearchBar';
import { ReactComponent as Point } from '../assests/Point.svg';
import { ReactComponent as Humidity } from '../assests/Humidity.svg';
import { ReactComponent as Wind } from '../assests/Wind.svg';
import {fetchCurrentWeather, fetchWeatherForecast} from '../weatherApi';
import { GooeySwitch } from './GooeySwitch';

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
  const [toggled, setToggled] = useState(false);
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

function getFormattedDate(dt: number): string {
  const date = new Date(dt * 1000);

  const weekday = date.toLocaleDateString("ru-RU", {
    weekday: "long",
  });

  const day = date.getDate();
  const month = date.toLocaleDateString("ru-RU", {
    month: "short",
  });

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return `${capitalize(weekday)}, ${day} ${month}`;
}
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
    <div>{getFormattedDate(weatherData.dt)}</div>
  </div>
  <GooeySwitch/>
  <div className="weather-icon">
    <img
      src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
      alt={weatherData.weather[0].description}
    />
  </div>

  <div className="weather-main">
    <div>{Math.round(weatherData.main.temp)}°C</div>
    <div className="description">{weatherData.weather[0].description}</div>
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


    </div>
  );
};

export default WeatherCard;