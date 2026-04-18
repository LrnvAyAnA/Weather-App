import ForecastCard  from "./ForecastCard";
import "../styles/ForecastCard.css";
import { DailyForecast } from "../utils/transformForecastData";
import { useEffect, useRef } from "react";

interface ForecastCardListProps {
  forecasts: DailyForecast[];
  isCelsius: boolean;
  onSelect: (date: string) => void;
  selectedDay: string | null;
}

const ForecastCardList: React.FC<ForecastCardListProps> = ({
  forecasts,
  isCelsius,
  onSelect,
  selectedDay
}) => {
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
      {forecasts.map((f) => (
        <ForecastCard
          key={f.date}
          weekday={f.weekday}
          icon={f.icon}
          min={f.min}
          max={f.max}
          description={f.description}
          isSelected={selectedDay === f.date}
          isCelsius={isCelsius}
          onClick={() => onSelect(f.date)}
        />
      ))}
    </div>
  );
};
export default ForecastCardList;