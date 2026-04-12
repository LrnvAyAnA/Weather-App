import clouds from "../assests/lottie/brokenClouds.json"
import rain from "../assests/lottie/rain.json"
import drizzle from "../assests/lottie/showerRain.json"
import snow from "../assests/lottie/snow.json"
import sun from "../assests/lottie/sun.json"
import thunderstorm from "../assests/lottie/thunderstorm.json"

// ключи = OpenWeather weather[0].main
export const weatherIconMap: Record<string, any> = {
  Clear: sun,
  Clouds: clouds,
  Rain: rain,
  Snow: snow,
  Thunderstorm: thunderstorm,
  Drizzle: drizzle,
  Wind: clouds
};

// fallback
export const DEFAULT_ICON = sun;