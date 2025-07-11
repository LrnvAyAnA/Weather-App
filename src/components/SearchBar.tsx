import { useState } from "react";
import { ReactComponent as Search } from '../assests/Search.svg'
import '../styles/WeatherCard.css'
interface SearchBarProps {
  onSearch: (city: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [city, setCity] = useState("");

  const handleSearch = () => {
    if (city.trim() !== "") {
      onSearch(city);
      setCity("");
    }
  };

  return (
    <div className="searchBar">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Search city"
        className="input"
      />
      <button onClick={handleSearch} className="buttonSearch">
        <Search width="24" height="24"/>
      </button>
    </div>
  );
};

export default SearchBar;