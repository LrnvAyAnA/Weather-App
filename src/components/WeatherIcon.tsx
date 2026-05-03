import Lottie from "lottie-react";
import {
  weatherIconMap,
  DEFAULT_ICON,
} from "../features/constants/weatherIconMap";
import { useEffect, useRef } from "react";

interface Props {
  type: string;
  size?: number;
  mode?: "always" | "interactive";
  isActive?: boolean;
}

export const WeatherIcon = ({
  type,
  mode = "always",
  isActive = true,
  size = 120,
}: Props) => {
  const animation = weatherIconMap[type] || DEFAULT_ICON;
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    if (!lottieRef.current) return;

    if (mode === "always") {
      lottieRef.current.play();
      return;
    }

    if (isActive) {
      lottieRef.current.play();
    } else {
      lottieRef.current.stop();
    }
  }, [isActive, mode]);

  return (
    <div style={{ width: size, height: size }}>
      <Lottie
        lottieRef={lottieRef}
        animationData={animation}
        autoplay={false}
        loop
      />
    </div>
  );
};
