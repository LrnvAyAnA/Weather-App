import React from "react";
import "../styles/ForecastCard.css";
import { convertTemp } from "../utils/convertTemp";

interface ForecastCardProps {
  weekday: string;
  icon: string;
  min: number;
  max: number;
  isCelsius: boolean;
  description: string;
  onClick: () => void;
  isSelected: boolean;
}

const ForecastCard: React.FC<ForecastCardProps> = ({
  weekday,
  icon,
  min,
  max,
  isCelsius,
  description,
  onClick,
  isSelected,
}) => {
  return (
    <button
      className={`forecast-card ${isSelected ? "active" : ""}`}
      onClick={onClick}
    >
      <div className="forecast-icon">
        <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt="" />
      </div>
      <div className="forecast-date">
        <div className="weekday">{weekday}</div>
        <div className="description">{description}</div>
      </div>
      <div className="forecast-temp">
        {" "}
        {Math.round(convertTemp(max, isCelsius))}°/ 
        {Math.round(convertTemp(min, isCelsius))}°
        
      </div>
    </button>
  );
};

export default ForecastCard;
