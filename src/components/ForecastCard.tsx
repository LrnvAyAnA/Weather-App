import React from "react";
import "../styles/ForecastCard.css";
import { formatDateShort } from "../utils/formatDate";
import { convertTemp } from "../utils/convertTemp";

interface ForecastCardProps {
  date: string;
  icon: string;
  min: number;
  max: number;
  isCelsius: boolean;
}

const ForecastCard: React.FC<ForecastCardProps> = ({
  date, icon, min, max, isCelsius
}) => {
   return (
      <div className="forecast-card">
    <div>{formatDateShort(new Date(date).getTime() / 1000)}</div>
    <img className="forecast-icon"src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt="" />
    <div className="forecast-temp"> {convertTemp(min, isCelsius)}° / {convertTemp(max, isCelsius)}°</div>
  </div>
  );
};

export default ForecastCard;