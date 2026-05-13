import clouds from "../../assests/lottie/brokenClouds.json"
import rain from "../../assests/lottie/rain.json"
import drizzle from "../../assests/lottie/showerRain.json"
import snow from "../../assests/lottie/snow.json"
import sun from "../../assests/lottie/sun.json"
import thunderstorm from "../../assests/lottie/thunderstorm.json"
import wind from "../../assests/lottie/wind.json"
import rainN from "../../assests/lottie/rainN.json"
import moon from "../../assests/lottie/moon.json"
import atmosphere from "../../assests/lottie/atmosphere.json"


export const weatherIconMap: Record<string, any> = {
  Clear: {
    day: sun,
    night: moon,
  },
  Rain: {
    day: rain,
    night: rainN,
  },
  Clouds: {
    day: clouds,
    night: clouds,
  },
  Snow: {
    day: snow,
    night: snow,
  },
  Thunderstorm: {
    day: thunderstorm,
    night: thunderstorm,
  },
  Drizzle: {
    day: drizzle,
    night: drizzle,
  },

  // атмосфера одинаковая
  Mist: { day: atmosphere, night: atmosphere },
  Smoke: { day: atmosphere, night: atmosphere },
  Haze: { day: atmosphere, night: atmosphere },
  Dust: { day: atmosphere, night: atmosphere },
  Fog: { day: atmosphere, night: atmosphere },
  Sand: { day: atmosphere, night: atmosphere },
  Tornado: { day: atmosphere, night: atmosphere },
  Squall: { day: atmosphere, night: atmosphere },
  Ash: { day: atmosphere, night: atmosphere },
};

// fallback
export const DEFAULT_ICON = sun;