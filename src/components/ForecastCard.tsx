import React, { useState } from "react";
import "../styles/ForecastCard.css";
import { convertTemp } from "../utils/convertTemp";
import { WeatherIcon } from "./WeatherIcon";

interface ForecastCardProps {
  weekday: string;
  iconType: string;
  min: number;
  max: number;
  isCelsius: boolean;
  description: string;
  onClick: () => void;
  isSelected: boolean;
}

const ForecastCard: React.FC<ForecastCardProps> = ({
  weekday,
  iconType,
  min,
  max,
  isCelsius,
  description,
  onClick,
  isSelected,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isActive = isSelected || isHovered;
  return (
    <button
      className={`forecast-card ${isSelected ? "active" : ""}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="forecast-icon">
        <WeatherIcon
          type={iconType}
          size={60}
          mode="interactive"
          isActive={isActive}
        />
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
