import clouds from "../../assests/lottie/brokenClouds.json"
import rain from "../../assests/lottie/rain.json"
import drizzle from "../../assests/lottie/showerRain.json"
import snow from "../../assests/lottie/snow.json"
import sun from "../../assests/lottie/sun.json"
import thunderstorm from "../../assests/lottie/thunderstorm.json"
import wind from "../../assests/lottie/wind.json"
import atmosphere from "../../assests/lottie/wind.json"


export const weatherIconMap: Record<string, any> = {
  Clear: sun,
  Clouds: clouds,
  Rain: rain,
  Snow: snow,
  Thunderstorm: thunderstorm,
  Drizzle: drizzle,
  Wind: wind,
  Mist: atmosphere,
  Smoke: atmosphere,
  Haze: atmosphere,
  Dust: atmosphere,
  Fog: atmosphere,
  Sand: atmosphere,
	Tornado: atmosphere,
	Squall: atmosphere,
	Ash: atmosphere
};

// fallback
export const DEFAULT_ICON = sun;