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
      {entries.map(([key, animation]) => (
        <div key={key} className="test-item">
          <div className="test-label">{key}</div>

          <div className="test-icon">
            <Lottie animationData={animation} loop autoplay />
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
