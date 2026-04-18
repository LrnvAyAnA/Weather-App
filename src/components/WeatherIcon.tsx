import Lottie from "lottie-react";
import { weatherIconMap, DEFAULT_ICON } from "../features/constants/weatherIconMap";

interface Props {
  type: string;
  size?: number;
}

export const WeatherIcon = ({ type, size = 120 }: Props) => {
  const animation = weatherIconMap[type] || DEFAULT_ICON;

  return (
    <div style={{ width: size, height: size }}>
      <Lottie animationData={animation} loop />
    </div>
  );
};