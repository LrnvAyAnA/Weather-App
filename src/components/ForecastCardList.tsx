import ForecastCard from "./ForecastCard";
import "../styles/ForecastCard.css";
import { DailyForecast } from "../utils/transformForecastData";
import { useEffect, useRef, useState } from "react";

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
  selectedDay,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isCompact, setIsCompact] = useState(window.innerWidth < 1100);

  useEffect(() => {
    const handleResize = () => setIsCompact(window.innerWidth < 1100);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    <div
      className={`forecast-list ${isCompact ? "forecast-list--compact" : ""}`}
      ref={containerRef}
    >
      {forecasts.map((f) => (
        <ForecastCard
          key={f.date}
          weekday={f.weekday}
          iconType={f.main}
          min={f.min}
          max={f.max}
          description={f.description}
          isSelected={selectedDay === f.date}
          isCelsius={isCelsius}
          onClick={() => onSelect(f.date)}
          compact={isCompact}
        />
      ))}
    </div>
  );
};
export default ForecastCardList;
