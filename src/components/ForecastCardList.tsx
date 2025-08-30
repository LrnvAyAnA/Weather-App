import ForecastCard  from "./ForecastCard";
import "../styles/ForecastCard.css";
import { DailyForecast } from "../utils/transformForecastData";
import { useEffect, useRef } from "react";

interface ForecastCardListProps {
  forecasts: DailyForecast[];
}

const ForecastCardList: React.FC<ForecastCardListProps> = ({ forecasts }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);
  return (
    <div className="forecast-list" ref={containerRef}>
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