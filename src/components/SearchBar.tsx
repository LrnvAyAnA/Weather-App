import { useEffect, useState } from "react";
import { ReactComponent as Search } from '../assests/Search.svg'
import '../styles/WeatherCard.css'
import { getCitySuggestions } from "../weatherApi";

interface CityOption {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

interface SearchBarProps {
  onSearch: (city: CityOption) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState<CityOption[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
  const timeout = setTimeout(() => {
    if (city.trim().length > 1) {
      getCitySuggestions(city).then(setSuggestions).catch(console.error);
    } else {
      setSuggestions([]);
    }
  }, 300);

  return () => clearTimeout(timeout);
}, [city]);

const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setCity(value);

  if (value.length < 2) {
    setSuggestions([]);
    setIsVisible(false);
    return;
  }

  try {
    const results = await getCitySuggestions(value);
    setSuggestions(results);
    setIsVisible(results.length > 0);
  } catch {
    setSuggestions([]);
    setIsVisible(false);
  }
};

const handleSelect = (city: CityOption) => {
  onSearch(city);    
  setCity("");       
  setSuggestions([]);
  setIsVisible(false);
};

  return (
    <div className="container">
    <div className="searchBar">
      <input
        type="text"
        value={city}
        onChange={handleInputChange}
        placeholder="Search city"
        className="input"
      />
      <button onClick={() => setCity("")} className="buttonSearch">
        <Search width="24" height="24" />
      </button>
    </div>  
   <ul className={`suggestions ${isVisible ? "show" : ""}`}>
  {suggestions.map((option, i) => (
    <li key={i} onClick={() => handleSelect(option)}>
      {option.name}, {option.country}
    </li>
  ))}
</ul>
    </div>
  );
};

export default SearchBar;