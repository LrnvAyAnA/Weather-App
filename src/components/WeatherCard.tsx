import React, { useEffect, useState } from 'react';
import '../styles/WeatherCard.css'
import SearchBar from './SearchBar';
import {fetchWeatherForecast, getCoordinatesByCity} from '../weatherApi';


const WeatherCard: React.FC = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

const handleSearch = async (newCity: string) => {
  const normalizedCity = newCity.trim();
  setCity(normalizedCity);
  setError(null);
  setWeatherData(null);

  try {
    const coords = await getCoordinatesByCity(normalizedCity);
    const data = await fetchWeatherForecast(coords.lat, coords.lon);
    setWeatherData(data);
  } catch (err) {
    setError("Не удалось получить данные о погоде");
  }
};
const cityCoords: { [key: string]: { lat: number; lon: number } } = {
  Moscow: { lat: 55.7558, lon: 37.6173 },
  Paris: { lat: 48.8566, lon: 2.3522 },
  Rome: { lat: 41.9028, lon: 12.4964 },
};

  return (
    <div className='wrapper'>
      <SearchBar onSearch={handleSearch} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {weatherData && (
        <div>
          <h2>Погода для {city}</h2>
          <pre>{JSON.stringify(weatherData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;