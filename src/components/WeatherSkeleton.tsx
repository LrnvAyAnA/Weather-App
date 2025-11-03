import React, { useEffect, useState } from "react";
import "../styles/WeatherSkeleton.css";

export const WeatherSkeleton: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 580);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 580);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="skeleton-wrapper">
      <div className="skeleton-current">
        <div className="skeleton-city-date-switch">
          <div className="skeleton-city-block">
            <div className="skeleton-city shimmer" />
            <div className="skeleton-city shimmer wide" />
          </div>
          {isMobile && (
              <div className="gooey-toggle-placeholder">
                <div className="toggle-circle-placeholder"/>
                <span className="t-C">°C</span>
                <span className="t-F">°F</span>
              </div>
          )}
        </div>

        <div className="skeleton-temp-row">
          <div className="left-side">
            <div className="skeleton-main-temp shimmer circle" />
            <div className="skeleton-temp-column">
              <div className="skeleton-temp shimmer tall" />
              <div className="skeleton-temp shimmer small" />
            </div>
          </div>

          <div className="skeleton-details">
            {[1, 2].map((i) => (
              <div key={i} className="skeleton-detail-row">
                <div className="skeleton-icon shimmer circle-small" />
                <div className="skeleton-text shimmer medium" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="skeleton-forecast-list">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton-forecast-card shimmer" />
        ))}
      </div>
    </div>
  );
};
