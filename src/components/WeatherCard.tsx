import React, { useState } from 'react';
import '../styles/WeatherCard.css'
import SearchBar from './SearchBar';
import {fetchWeatherForecast} from '../weatherApi';

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
    const data = await fetchWeatherForecast(selectedCity.lat, selectedCity.lon);
    setWeatherData(data);
  } catch (err) {
    setError("Не удалось получить данные о погоде");
  }
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