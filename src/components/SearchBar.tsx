import { useEffect, useRef, useState } from "react";
import { ReactComponent as Search } from '../assests/Search.svg'
import { ReactComponent as Point } from '../assests/Point.svg';
import '../styles/WeatherCard.css'
import { getCitySuggestions } from "../weatherApi";
import { getUserLocation } from "../utils/getUserLocation";

interface CityOption {
    name: string;     
  localName: string;  
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

interface SearchBarProps {
  onSearch: (city: CityOption) => void;
  onLocationSearch: (coords: { lat: number; lon: number }) => void; // новый проп
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch,onLocationSearch  }) => {
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

const listRef = useRef<HTMLUListElement>(null);

useEffect(() => {
  const el = listRef.current;
  if (!el) return;

  if (isVisible) {
    el.style.height = el.scrollHeight + "px";

    const timer = setTimeout(() => {
      if (el) el.style.height = "auto";
    }, 300);

    return () => clearTimeout(timer);
  } else {
    el.style.height = el.scrollHeight + "px";
    requestAnimationFrame(() => {
      el.style.height = "0px";
    });
  }
}, [suggestions.length, isVisible]);

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

const handleLocationClick = async () => {
  try {
    const coords = await getUserLocation();
    onLocationSearch(coords);
  } catch {
    alert("Не удалось определить местоположение");
  }
};

const handleSelect = (city: CityOption) => {
  onSearch(city);    
  setCity("");       
  setSuggestions([]);
  setIsVisible(false);
};

  return (
    <div className="searchBarWrapper">
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
    <button className="butLocation" onClick={handleLocationClick}>
      <Point/>
    </button>
  </div>

  <ul
    ref={listRef}
    className={`suggestions ${isVisible ? "show" : ""}`}
  >
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