import ForecastCard  from "./ForecastCard";
import "../styles/ForecastCard.css";
import { DailyForecast } from "../utils/transformForecastData";

interface ForecastCardListProps {
  forecasts: DailyForecast[];
}

const ForecastCardList: React.FC<ForecastCardListProps> = ({ forecasts }) => {
  return (
    <div className="forecast-list">
      {forecasts.map(f => (
        <ForecastCard
          key={f.date}
          date={f.date}
          icon={f.icon}
          min={f.min}
          max={f.max}
        />
      ))}
    </div>
  );
};
export default ForecastCardList;