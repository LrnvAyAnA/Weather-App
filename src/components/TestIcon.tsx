import {
  weatherIconMap,
  DEFAULT_ICON,
} from "../features/constants/weatherIconMap";
import Lottie from "lottie-react";
import "../styles/TestIcon.css";

export const TestIcon = () => {
  const entries = Object.entries(weatherIconMap);

  return (
    <div className="test-grid">
      {entries.map(([key, variants]) => (
        <div key={key} className="test-item">
          <div className="test-label">{key} (day)</div>
          <div className="test-icon">
            <Lottie animationData={variants.day} loop autoplay />
          </div>
          <div className="test-label">{key} (night)</div>
          <div className="test-icon">
            <Lottie animationData={variants.night} loop autoplay />
          </div>
        </div>
      ))}

      {/* fallback */}
      <div className="test-item">
        <div className="test-label">DEFAULT</div>
        <div className="test-icon">
          <Lottie animationData={DEFAULT_ICON} loop autoplay />
        </div>
      </div>
    </div>
  );
};
