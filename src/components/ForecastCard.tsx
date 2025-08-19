import React from "react";
import "../styles/ForecastCard.css";
import { formatDateShort } from "../utils/formatDate";

interface ForecastCardProps {
  date: string;
  icon: string;
  min: number;
  max: number;
}

const ForecastCard: React.FC<ForecastCardProps> = ({
  date, icon, min, max
}) => {
  return (
      <div className="forecast-card">
    <div>{formatDateShort(new Date(date).getTime() / 1000)}</div>
    <img className="forecast-icon"src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt="" />
    <div className="forecast-temp">{min}° / {max}°</div>
  </div>
  );
};

export default ForecastCard;