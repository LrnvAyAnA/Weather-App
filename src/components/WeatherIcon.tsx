import Lottie from "lottie-react";
import {
  weatherIconMap,
  DEFAULT_ICON,
} from "../features/constants/weatherIconMap";
import { useEffect, useRef } from "react";

interface Props {
  type: string;
  iconCode?: string; // ← ДОБАВИЛИ
  size?: number;
  mode?: "always" | "interactive";
  isActive?: boolean;
}

export const WeatherIcon = ({
  type,
  iconCode,
  mode = "always",
  isActive = true,
  size = 120,
}: Props) => {
  const lottieRef = useRef<any>(null);

  // ✔️ определяем день/ночь
  const isNight = iconCode?.endsWith("n");

  // ✔️ берём вариант
  const variant = weatherIconMap[type];

  const animation =
    variant?.[isNight ? "night" : "day"] || DEFAULT_ICON;

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
  }, [isActive, mode, animation]); 

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